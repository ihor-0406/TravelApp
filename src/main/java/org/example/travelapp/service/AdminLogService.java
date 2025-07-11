package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.AdminLog;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.AdminLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLogService {

    private final AdminLogRepository adminLogRepository;

    public void logAction(Account admin, String action, String details) {
        AdminLog adminLog = new AdminLog();
        adminLog.setAccount(admin);
        adminLog.setAction(action);
        adminLog.setDetails(details);
        adminLog.setTimestamp(LocalDateTime.now());

        adminLogRepository.save(adminLog);
    }

    public List<AdminLog> getLogsByAdmin(Account admin) {
        return adminLogRepository.findByAccount(admin);
    }
}
