package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Booking;
import org.example.travelapp.model.BookingStatus;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.BookingRepository;
import org.example.travelapp.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final AccountRepository accountRepository;
    private final BookingRepository bookingRepository;



    @PostMapping("/bookings/payment")
    public ResponseEntity<BookingDto> createBookingWithPayment(
            @RequestBody BookingDto bookingDto,
            @RequestParam String paymentIntentId) {
        try {
            BookingDto createdBooking = bookingService.createBookingWithPayment(bookingDto, paymentIntentId);
            return ResponseEntity.ok(createdBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/check-payment")
    public ResponseEntity<Map<String, Boolean>> checkPayment(@RequestParam String paymentIntentId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("confirmed", false));
        }
        try {
            // Логика проверки paymentIntentId (например, через BookingService)
            // Здесь нужно связать paymentIntentId с существующей бронью
            Account account = accountRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            List<Booking> bookings = bookingRepository.findAllByAccount(account);
            boolean confirmed = bookings.stream()
                    .anyMatch(b -> b.getPayment() != null && b.getPayment().getStripeSessionId().equals(paymentIntentId)
                            && b.getStatus() == BookingStatus.CONFIRMED);
            return ResponseEntity.ok(Map.of("confirmed", confirmed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("confirmed", false));
        }
    }
    @GetMapping
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        try {
            return ResponseEntity.ok(bookingService.getAllBookings());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDto> updateBooking(@PathVariable Long id,
                                                    @RequestBody BookingDto bookingDto) {
        try {
            return ResponseEntity.ok(bookingService.updateBooking(id, bookingDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        bookingService.deleteBookingByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            BookingStatus status = BookingStatus.valueOf(statusStr);
            booking.setStatus(status);
            bookingRepository.save(booking);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
    }


}
