package org.example.travelapp.repository;

import org.example.travelapp.model.Tour;
import org.example.travelapp.model.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourImageRepository extends JpaRepository<TourImage, Long> {
    List<TourImage> findByTour(Tour tour);
}
