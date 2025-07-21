package org.example.travelapp.repository;

import org.example.travelapp.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long>,  TourFilterRepository {

    @Query("SELECT t FROM Tour t LEFT JOIN FETCH t.discounts WHERE t.id = :id")
    Optional<Tour> findByIdWithDiscounts(@Param("id") Long id);


    List<Tour> findByLocationContainingIgnoreCase(String location);

}
