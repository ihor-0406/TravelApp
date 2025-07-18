package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourCreateRequestDto;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.*;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.DiscountRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.Optional;



@Service
@RequiredArgsConstructor
public class TourService {
    private final TourRepository tourRepository;
    private final AccountRepository accountRepository;
    private final DiscountRepository discountRepository;

    public Page<Tour> findAll( Pageable pageable) {
        return tourRepository.findAll( pageable );
    }

    public Optional<Tour> findById(Long id) {
        return tourRepository.findById(id);
    }


    public Tour create(TourCreateRequestDto dto, String createdByEmail) {
        Account account = accountRepository.findByEmail(createdByEmail)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Tour tour = new Tour();
        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setLocation(dto.getLocation());
        tour.setImageUrl(dto.getImageUrl());
        tour.setPrice(dto.getPrice());
        tour.setMaxPeople(dto.getMaxPeople());
        tour.setDuration(dto.getDuration());
        tour.setDifficulty(dto.getDifficulty());
        tour.setAvailability(dto.getAvailability());
        tour.setType(dto.getType());
        tour.setCreatedBy(account);

        return tourRepository.save(tour);
    }



    public  Tour update(Long id, Tour updated, String adminEmail) {
        Tour existing = tourRepository.findById(id)
                .orElseThrow();

        updated.setId(id);
        updated.setCreatedBy(existing.getCreatedBy());
        return tourRepository.save(updated);
    }

    public Tour save(Tour tour) {
        return tourRepository.save(tour);
    }

    public void delete(Long id) {
        Tour existing = tourRepository.findById(id)
                .orElseThrow();
        tourRepository.delete(existing);
    }

    public Page<Tour> filterTours(TourFilterRequstDto request, Pageable pageable) {
        return tourRepository.filterTours(request, pageable);
    }

}
