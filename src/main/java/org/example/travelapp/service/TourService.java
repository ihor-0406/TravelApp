package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourCreateRequestDto;
import org.example.travelapp.dto.TourDto;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.*;
import org.example.travelapp.repository.DiscountRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class TourService {
    private final TourRepository tourRepository;
    private final AccountService accountService;
    private final DiscountRepository discountRepository;

    public Page<Tour> findAll( Pageable pageable) {
        return tourRepository.findAll( pageable );
    }

    public Optional<Tour> findById(Long id) {
        return tourRepository.findById(id);
    }

    public Tour create(TourCreateRequestDto dto, String adminEmail) {
        Account admin = accountService.findByEmail(adminEmail)
                        .orElseThrow();

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
        tour.setCreatedBy(admin);

        Tour savedTour = tourRepository.save(tour);

        if(dto.getImageUrls() != null) {
            List<TourImage> images = dto.getImageUrls().stream()
                    .map(url -> new TourImage(null, url, savedTour))
                    .toList();

            savedTour.setAlbum(images);
        }

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

    private TourDto mapToDto(Tour tour) {
        TourDto dto = new TourDto();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());

        Discount discount = discountRepository.findAll().stream()
                .filter(d ->d.getTour() != null && d.getTour().getId().equals(tour.getId()))
                .findFirst().orElse(null);

        if(discount != null) {
            dto.setDiscountValue(discount.getValue());
            dto.setDiscountPrice(tour.getPrice()
                    .multiply(BigDecimal.ONE.subtract(discount.getValue()))
                    .setScale(2,BigDecimal.ROUND_HALF_UP)
            );
        }else {
            dto.setDiscountValue(BigDecimal.ZERO);
            dto.setDiscountPrice(tour.getPrice());
        }
        return dto;
    }
}
