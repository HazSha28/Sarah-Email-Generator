package com.sarahjewellers.controller;

import com.sarahjewellers.model.EmailDraft;
import com.sarahjewellers.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired private EmailService emailService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/drafts")
    public List<EmailDraft> getDrafts() {
        return emailService.getPendingDrafts();
    }

    @GetMapping("/sent")
    public List<EmailDraft> getSent() {
        return emailService.getSentEmails();
    }

    @GetMapping("/drafts/{id}")
    public ResponseEntity<EmailDraft> getDraft(@PathVariable Long id) {
        return emailService.getDraftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/drafts/{id}")
    public ResponseEntity<EmailDraft> updateDraft(@PathVariable Long id, @RequestBody EmailDraft updated) {
        return emailService.getDraftById(id).map(d -> {
            d.setSubject(updated.getSubject());
            d.setBody(updated.getBody());
            return ResponseEntity.ok(emailService.saveDraft(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/drafts/{id}/send")
    public ResponseEntity<?> sendDraft(@PathVariable Long id) {
        try {
            emailService.sendDraft(id);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/drafts/{id}")
    public ResponseEntity<Void> deleteDraft(@PathVariable Long id) {
        emailService.deleteDraft(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate/birthdays")
    public ResponseEntity<?> generateBirthdays() {
        emailService.generateBirthdayDrafts();
        return ResponseEntity.ok(Map.of("message", "Birthday drafts generated"));
    }

    @PostMapping("/generate/anniversaries")
    public ResponseEntity<?> generateAnniversaries() {
        emailService.generateAnniversaryDrafts();
        return ResponseEntity.ok(Map.of("message", "Anniversary drafts generated"));
    }

    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody Map<String, String> body) {
        try {
            emailService.sendFestivalBroadcast(body.get("subject"), body.get("body"));
            return ResponseEntity.ok(Map.of("message", "Broadcast sent to all customers"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            file.transferTo(new File(dir.toAbsolutePath() + "/" + filename));
            return ResponseEntity.ok(Map.of("url", "/uploads/" + filename));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "pending", emailService.countPending(),
                "sent", emailService.countSent()
        );
    }
}
