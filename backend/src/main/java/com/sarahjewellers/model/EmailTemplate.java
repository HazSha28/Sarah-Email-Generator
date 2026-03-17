package com.sarahjewellers.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "email_templates")
@Data
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String occasion; // BIRTHDAY, ANNIVERSARY, FESTIVAL

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private String festivalName; // for FESTIVAL type (Diwali, Ramadan, etc.)
}
