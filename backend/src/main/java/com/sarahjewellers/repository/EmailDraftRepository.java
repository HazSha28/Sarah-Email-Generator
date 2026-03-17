package com.sarahjewellers.repository;

import com.sarahjewellers.model.EmailDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmailDraftRepository extends JpaRepository<EmailDraft, Long> {
    List<EmailDraft> findByStatus(String status);
    List<EmailDraft> findByCustomerId(Long customerId);
    long countByStatus(String status);
}
