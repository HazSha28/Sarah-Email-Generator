package com.sarahjewellers.service;

import com.sarahjewellers.model.Customer;
import com.sarahjewellers.repository.CustomerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public Optional<Customer> getById(Long id) {
        return customerRepository.findById(id);
    }

    public List<Customer> getUpcomingBirthdays() {
        return customerRepository.findUpcomingBirthdays();
    }

    public List<Customer> getUpcomingAnniversaries() {
        return customerRepository.findUpcomingAnniversaries();
    }

    public List<Customer> getTodayBirthdays() {
        LocalDate today = LocalDate.now();
        return customerRepository.findByBirthdayMonthAndDay(today.getMonthValue(), today.getDayOfMonth());
    }

    public List<Customer> getTodayAnniversaries() {
        LocalDate today = LocalDate.now();
        return customerRepository.findByAnniversaryMonthAndDay(today.getMonthValue(), today.getDayOfMonth());
    }

    public Map<String, Object> importFromExcel(MultipartFile file) throws Exception {
        int imported = 0, skipped = 0;
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                try {
                    String email = getCellValue(row.getCell(1));
                    if (email == null || email.isBlank()) { skipped++; continue; }
                    if (customerRepository.existsByEmail(email)) { skipped++; continue; }

                    Customer c = new Customer();
                    c.setName(getCellValue(row.getCell(0)));
                    c.setEmail(email);
                    c.setPhone(getCellValue(row.getCell(2)));
                    c.setBirthday(parseDate(row.getCell(3)));
                    c.setAnniversary(parseDate(row.getCell(4)));
                    customerRepository.save(c);
                    imported++;
                } catch (Exception e) {
                    skipped++;
                }
            }
        }
        return Map.of("imported", imported, "skipped", skipped);
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> null;
        };
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null) return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            } else {
                String val = getCellValue(cell);
                if (val != null) return LocalDate.parse(val);
            }
        } catch (Exception ignored) {}
        return null;
    }
}
