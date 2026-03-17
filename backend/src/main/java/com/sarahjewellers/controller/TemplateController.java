package com.sarahjewellers.controller;

import com.sarahjewellers.model.EmailTemplate;
import com.sarahjewellers.repository.EmailTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired private EmailTemplateRepository templateRepository;

    @GetMapping
    public List<EmailTemplate> getAll() {
        return templateRepository.findAll();
    }

    @PostMapping
    public EmailTemplate create(@RequestBody EmailTemplate template) {
        return templateRepository.save(template);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmailTemplate> update(@PathVariable Long id, @RequestBody EmailTemplate updated) {
        return templateRepository.findById(id).map(t -> {
            t.setSubject(updated.getSubject());
            t.setBody(updated.getBody());
            t.setFestivalName(updated.getFestivalName());
            return ResponseEntity.ok(templateRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        templateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
