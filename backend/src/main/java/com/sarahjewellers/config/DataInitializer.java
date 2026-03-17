package com.sarahjewellers.config;

import com.sarahjewellers.model.AdminUser;
import com.sarahjewellers.model.EmailTemplate;
import com.sarahjewellers.repository.AdminUserRepository;
import com.sarahjewellers.repository.EmailTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private AdminUserRepository adminRepo;
    @Autowired private EmailTemplateRepository templateRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (adminRepo.findByUsername("admin").isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminRepo.save(admin);
        }

        // Seed default templates
        if (templateRepo.findByOccasion("BIRTHDAY").isEmpty()) {
            EmailTemplate t = new EmailTemplate();
            t.setOccasion("BIRTHDAY");
            t.setSubject("Happy Birthday, {CustomerName}! A Special Gift from Sarah Jewellers");
            t.setBody("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #f0c040;border-radius:10px;">
                  <h2 style="color:#c8a415;text-align:center;">Happy Birthday, {CustomerName}! 🎂</h2>
                  <p>Wishing you a sparkling birthday filled with joy and beautiful moments!</p>
                  <p>As a token of our appreciation, enjoy <strong>{Offer}</strong> on your next purchase at Sarah Jewellers.</p>
                  <p>Visit us in-store or shop online to find the perfect piece to celebrate your special day.</p>
                  <br/>
                  <p style="color:#888;">With love,<br/>The Sarah Jewellers Team</p>
                </div>
                """);
            templateRepo.save(t);
        }

        if (templateRepo.findByOccasion("ANNIVERSARY").isEmpty()) {
            EmailTemplate t = new EmailTemplate();
            t.setOccasion("ANNIVERSARY");
            t.setSubject("Happy Anniversary, {CustomerName}! Celebrate with Sarah Jewellers");
            t.setBody("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #f0c040;border-radius:10px;">
                  <h2 style="color:#c8a415;text-align:center;">Happy Anniversary, {CustomerName}! 💍</h2>
                  <p>Congratulations on this beautiful milestone! May your love continue to shine.</p>
                  <p>Celebrate your special day with a timeless piece from Sarah Jewellers. Enjoy <strong>{Offer}</strong> on your next purchase.</p>
                  <br/>
                  <p style="color:#888;">With warm wishes,<br/>The Sarah Jewellers Team</p>
                </div>
                """);
            templateRepo.save(t);
        }

        if (templateRepo.findByOccasionAndFestivalName("FESTIVAL", "Diwali").isEmpty()) {
            EmailTemplate t = new EmailTemplate();
            t.setOccasion("FESTIVAL");
            t.setFestivalName("Diwali");
            t.setSubject("Happy Diwali, {CustomerName}! Shine Bright with Sarah Jewellers");
            t.setBody("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#fffbea;border:1px solid #f0c040;border-radius:10px;">
                  <h2 style="color:#c8a415;text-align:center;">✨ Happy Diwali, {CustomerName}! ✨</h2>
                  <p>May this festival of lights bring happiness, prosperity, and sparkle into your life!</p>
                  <p>Celebrate Diwali with our exclusive collection. Enjoy <strong>{Offer}</strong> this festive season.</p>
                  <br/>
                  <p style="color:#888;">Warm Diwali wishes,<br/>The Sarah Jewellers Team</p>
                </div>
                """);
            templateRepo.save(t);
        }
    }
}
