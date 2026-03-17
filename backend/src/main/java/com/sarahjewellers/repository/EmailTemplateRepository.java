package com.sarahjewellers.repository;

import com.sarahjewellers.model.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    Optional<EmailTemplate> findByOccasion(String occasion);
    Optional<EmailTemplate> findByOccasionAndFestivalName(String occasion, String festivalName);
}
