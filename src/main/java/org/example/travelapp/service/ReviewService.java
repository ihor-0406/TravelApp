package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.ReviewDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Review;
import org.example.travelapp.model.Role;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.ReviewRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;

    public List<Review> findByTour(Tour tour) {
        return reviewRepository.findByTour(tour);
    }

    public List<Review> findByAccount(Account account) {
        return reviewRepository.findByAccount(account);
    }

    public Optional<Review> findByAccountAndTour(Account account, Tour tour) {
        return reviewRepository.findByAccountAndTour(account,tour);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    public void delete(Long reviewId, Account account) {
        Review review = reviewRepository.findById(reviewId).orElse(null);

        boolean isAuthor = review.getAccount().getId().equals(account.getId());
        boolean isAdmin = account.getRole().equals(Role.ADMIN);

        if (isAdmin || isAuthor) {
            throw new AccessDeniedException("You are not allowed to edit this review");
        }

        reviewRepository.delete(review);
    }
    public  void adminDelete(Long id) {
        reviewRepository.deleteById(id);
    }

    public void updateAverageRating(Tour tour) {
        List<Review> reviews = reviewRepository.findByTour(tour);
        if (reviews.isEmpty()) {
            tour.setAvailability(null);
        }else {
            double avg = reviews.stream().mapToInt(Review :: getRating).average().orElse(0.0);
            tour.setAverageRating(avg);
        }
        tourRepository.save(tour);
    }

    public  List<ReviewDto> getReviewsByTour(Tour tour, Account account) {
        return reviewRepository.findByTour(tour).stream()
                .map(review ->{
                            ReviewDto dto = new ReviewDto();
                            dto.setId(review.getId());
                            dto.setComment(review.getComment());
                            dto.setRating(review.getRating());
                            dto.setDate(review.getReviewDate());
                            dto.setMine(account != null && review.getAccount().getId().equals(account.getId()));

                            Account reviewer = review.getAccount();
                            dto.setFirstName(reviewer.getFirstName());
                            dto.setLastName(reviewer.getLastName());
                            dto.setAvatarUrl(reviewer.getAvatarUrl());
                            dto.setCity(reviewer.getAddress() != null ? reviewer.getAddress().getCity() : "Unknown");


                            return dto;
                        }).toList();

    }
    public void addReview(Tour tour, Account account, ReviewDto reviewDto) {
        Review review = new Review();
        review.setTour(tour);
        review.setAccount(account);
        review.setComment(reviewDto.getComment());
        review.setRating(reviewDto.getRating());
        review.setReviewDate(reviewDto.getDate());

        reviewRepository.save(review);
        updateAverageRating(tour);
    }
    public  void editReview(Long reviewId, Account account, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(reviewDto.getId()).orElse(null);

        boolean isAuthor = review.getAccount().getId().equals(account.getId());
        boolean isAdmin = account.getRole().equals(Role.ADMIN);

        if (isAdmin || isAuthor) {
            throw new AccessDeniedException("You are not allowed to edit this review");
        }

        review.setComment(reviewDto.getComment());
        review.setRating(reviewDto.getRating());
        reviewRepository.save(review);
        updateAverageRating(review.getTour());
    }

    public List<ReviewDto> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public void deleteReviewByAdmin(Long id) {
        reviewRepository.deleteById(id);
    }


    private ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setDate(review.getReviewDate());

        Account reviewer = review.getAccount();
        dto.setFirstName(reviewer.getFirstName());
        dto.setLastName(reviewer.getLastName());
        dto.setAvatarUrl(reviewer.getAvatarUrl());
        dto.setCity(reviewer.getAddress() != null ? reviewer.getAddress().getCity() : "Unknown");


        return dto;
    }


}
