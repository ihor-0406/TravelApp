package org.example.travelapp.repository;

import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface TourFilterRepository {
    Page<Tour> filterTours(TourFilterRequstDto request, Pageable pageable);
}
