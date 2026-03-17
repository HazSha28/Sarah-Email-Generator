package com.sarahjewellers.repository;

import com.sarahjewellers.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find customers whose birthday matches today's month and day
    @Query("SELECT c FROM Customer c WHERE MONTH(c.birthday) = :month AND DAY(c.birthday) = :day")
    List<Customer> findByBirthdayMonthAndDay(@Param("month") int month, @Param("day") int day);

    // Find customers whose anniversary matches today's month and day
    @Query("SELECT c FROM Customer c WHERE MONTH(c.anniversary) = :month AND DAY(c.anniversary) = :day")
    List<Customer> findByAnniversaryMonthAndDay(@Param("month") int month, @Param("day") int day);

    // Upcoming birthdays in next 7 days
    @Query(value = "SELECT * FROM customers WHERE DATE_FORMAT(birthday, '%m-%d') BETWEEN DATE_FORMAT(CURDATE(), '%m-%d') AND DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 7 DAY), '%m-%d')", nativeQuery = true)
    List<Customer> findUpcomingBirthdays();

    // Upcoming anniversaries in next 7 days
    @Query(value = "SELECT * FROM customers WHERE DATE_FORMAT(anniversary, '%m-%d') BETWEEN DATE_FORMAT(CURDATE(), '%m-%d') AND DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 7 DAY), '%m-%d')", nativeQuery = true)
    List<Customer> findUpcomingAnniversaries();

    boolean existsByEmail(String email);
}
