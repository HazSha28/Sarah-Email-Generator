package com.sarahjewellers.controller;

import com.sarahjewellers.repository.CustomerRepository;
import com.sarahjewellers.service.CustomerService;
import com.sarahjewellers.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private CustomerService customerService;
    @Autowired private EmailService emailService;

    @GetMapping
    public Map<String, Object> getDashboard() {
        return Map.of(
                "totalCustomers", customerRepository.count(),
                "upcomingBirthdays", customerService.getUpcomingBirthdays().size(),
                "upcomingAnniversaries", customerService.getUpcomingAnniversaries().size(),
                "pendingEmails", emailService.countPending(),
                "sentEmails", emailService.countSent()
        );
    }
}
