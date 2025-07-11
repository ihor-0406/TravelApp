package org.example.travelapp.repository;

import org.example.travelapp.model.Account;
import org.example.travelapp.model.Review;
import org.example.travelapp.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTour(Tour tour);

    List<Review> findByAccount(Account account);

    Optional<Review> findByAccountAndTour(Account account, Tour tour);
}
