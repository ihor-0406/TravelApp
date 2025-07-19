package org.example.travelapp.repository;

import org.example.travelapp.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    List<Tour> findByLocationContainingIgnoreCase(String location);

}
