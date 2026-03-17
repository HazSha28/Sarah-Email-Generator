package com.sarahjewellers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SarahJewellersApplication {
    public static void main(String[] args) {
        SpringApplication.run(SarahJewellersApplication.class, args);
    }
}
