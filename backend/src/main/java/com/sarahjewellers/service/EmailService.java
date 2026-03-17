package com.sarahjewellers.service;

import com.sarahjewellers.model.Customer;
import com.sarahjewellers.model.EmailDraft;
import com.sarahjewellers.model.EmailTemplate;
import com.sarahjewellers.repository.CustomerRepository;
import com.sarahjewellers.repository.EmailDraftRepository;
import com.sarahjewellers.repository.EmailTemplateRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired private EmailDraftRepository draftRepository;
    @Autowired private EmailTemplateRepository templateRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Auto-generate drafts every day at 8 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void generateDailyDrafts() {
        generateBirthdayDrafts();
        generateAnniversaryDrafts();
    }

    public void generateBirthdayDrafts() {
        List<Customer> customers = customerRepository.findByBirthdayMonthAndDay(
                java.time.LocalDate.now().getMonthValue(),
                java.time.LocalDate.now().getDayOfMonth());
        Optional<EmailTemplate> template = templateRepository.findByOccasion("BIRTHDAY");
        template.ifPresent(t -> customers.forEach(c -> createDraft(c, t, "BIRTHDAY")));
    }

    public void generateAnniversaryDrafts() {
        List<Customer> customers = customerRepository.findByAnniversaryMonthAndDay(
                java.time.LocalDate.now().getMonthValue(),
                java.time.LocalDate.now().getDayOfMonth());
        Optional<EmailTemplate> template = templateRepository.findByOccasion("ANNIVERSARY");
        template.ifPresent(t -> customers.forEach(c -> createDraft(c, t, "ANNIVERSARY")));
    }

    private void createDraft(Customer customer, EmailTemplate template, String occasion) {
        EmailDraft draft = new EmailDraft();
        draft.setCustomer(customer);
        draft.setOccasion(occasion);
        draft.setSubject(fillPlaceholders(template.getSubject(), customer, "10% OFF"));
        draft.setBody(fillPlaceholders(template.getBody(), customer, "10% OFF"));
        draft.setStatus("PENDING");
        draftRepository.save(draft);
    }

    public String fillPlaceholders(String text, Customer customer, String offer) {
        return text
                .replace("{CustomerName}", customer.getName())
                .replace("{Occasion}", customer.getName())
                .replace("{Offer}", offer);
    }

    public EmailDraft saveDraft(EmailDraft draft) {
        return draftRepository.save(draft);
    }

    public void sendDraft(Long draftId) throws Exception {
        EmailDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        sendEmail(draft.getCustomer().getEmail(), draft.getSubject(), draft.getBody());
        draft.setStatus("SENT");
        draft.setSentAt(LocalDateTime.now());
        draftRepository.save(draft);
    }

    public void sendFestivalBroadcast(String subject, String body) throws Exception {
        List<Customer> all = customerRepository.findAll();
        for (Customer c : all) {
            String personalizedBody = body.replace("{CustomerName}", c.getName());
            String personalizedSubject = subject.replace("{CustomerName}", c.getName());
            sendEmail(c.getEmail(), personalizedSubject, personalizedBody);

            EmailDraft draft = new EmailDraft();
            draft.setCustomer(c);
            draft.setOccasion("FESTIVAL");
            draft.setSubject(personalizedSubject);
            draft.setBody(personalizedBody);
            draft.setStatus("SENT");
            draft.setSentAt(LocalDateTime.now());
            draftRepository.save(draft);
        }
    }

    private void sendEmail(String to, String subject, String body) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true = HTML
        mailSender.send(message);
    }

    public List<EmailDraft> getAllDrafts() {
        return draftRepository.findAll();
    }

    public List<EmailDraft> getPendingDrafts() {
        return draftRepository.findByStatus("PENDING");
    }

    public List<EmailDraft> getSentEmails() {
        return draftRepository.findByStatus("SENT");
    }

    public Optional<EmailDraft> getDraftById(Long id) {
        return draftRepository.findById(id);
    }

    public void deleteDraft(Long id) {
        draftRepository.deleteById(id);
    }

    public long countPending() {
        return draftRepository.countByStatus("PENDING");
    }

    public long countSent() {
        return draftRepository.countByStatus("SENT");
    }
}
