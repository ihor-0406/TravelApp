package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.BookingRepository;
import org.example.travelapp.repository.TourRepository;
import org.example.travelapp.service.AdminLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final AdminLogService adminLogService;

    @GetMapping("/users")
    public ResponseEntity<List<Account>> getAllUsers() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable Long id) {
        accountRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    @PostMapping("/user/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                            @RequestBody Role role) {
        Optional<Account> userOpt = accountRepository.findById(id);
        Account account = userOpt.get();
        account.setRole(role);
        accountRepository.save(account);
        return ResponseEntity.ok("Role updated");
    }


    @GetMapping("/logs/{adminId}")
    public ResponseEntity<?> getLogs(@PathVariable Long adminId) {
        Account admin = accountRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        return ResponseEntity.ok(adminLogService.getLogsByAdmin(admin));
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long userCount = accountRepository.count();
        long tourCount = tourRepository.count();
        long bookingCount = bookingRepository.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("users", userCount);
        stats.put("tours", tourCount);
        stats.put("bookings", bookingCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/bookings-per-day")
    public ResponseEntity<?> getBookingsPerDay() {
        List<Object[]> result = bookingRepository.countBookingsGroupedByDate();

        List<Map<String, Object>> data = result.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0].toString());
            map.put("count", row[1]);
            return map;
        }).toList();

        return ResponseEntity.ok(data);
    }
    @GetMapping("/bookings-by-status")
    public ResponseEntity<?> getBookingsByStatus() {
        List<Object[]> result = bookingRepository.countByStatus();

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : result) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }

        return ResponseEntity.ok(statusMap);
    }

}
