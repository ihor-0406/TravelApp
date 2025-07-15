package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.ReviewDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.TourRepository;
import org.example.travelapp.service.AccountService;
import org.example.travelapp.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final AccountService accountService;
    private final TourRepository tourRepository;

    @GetMapping("/tour/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewsByTour(@PathVariable Long id) {

        Tour tour = tourRepository.findById(id).orElse(null);
        Account account = accountService.getCurrentAccountOrNull();

        List<ReviewDto> reviews = reviewService.getReviewsByTour(tour, account);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/tour/{id}")
    public ResponseEntity<Void> addReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto) {
        Tour tour = tourRepository.findById(id).orElse(null);
        Optional<Account> account = accountService.getCurrentAccount();

        reviewService.addReview(tour, account.orElse(null), reviewDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(@PathVariable Long reviewId, @RequestBody ReviewDto reviewDto) {
        Optional<Account> account = accountService.getCurrentAccount();

        reviewService.editReview(reviewId, account.orElse(null),reviewDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Optional<Account> account = accountService.getCurrentAccount();

        reviewService.delete(reviewId, account.orElse(null));
        return ResponseEntity.ok().build();
    }
//    ===============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/comments")
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/admin/comments/{id}")
    public ResponseEntity<Void> deleteReviewByAdmin(@PathVariable Long id) {
        reviewService.deleteReviewByAdmin(id);
        return ResponseEntity.ok().build();
    }

}
