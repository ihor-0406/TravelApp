package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourCreateRequestDto;
import org.example.travelapp.dto.TourDto;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.*;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.DiscountRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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


//    public TourDto mapToDto(Tour tour) {
//        TourDto dto = new TourDto();
//
//        dto.setId(tour.getId());
//        dto.setTitle(tour.getTitle());
//        dto.setDescription(tour.getDescription());
//        dto.setPrice(tour.getPrice());
//
//        if (tour.getImageUrl() != null && !tour.getImageUrl().isBlank()) {
//            dto.setImageUrl(tour.getImageUrl());
//        } else if (!tour.getAlbum().isEmpty()) {
//            dto.setImageUrl(tour.getAlbum().get(0).getImageUrls());
//        } else {
//            dto.setImageUrl("https://via.placeholder.com/400x250");
//        }
//
//        dto.setRating(
//                tour.getAverageRating() != null
//                        ? BigDecimal.valueOf(tour.getAverageRating())
//                        : BigDecimal.ZERO
//        );
//
//        Optional<Discount> activeDiscount = tour.getDiscounts()
//                .stream()
//                .filter(d ->
//                        !d.getStartDate().isAfter(LocalDate.now()) &&
//                                !d.getEndDate().isBefore(LocalDate.now())
//                )
//                .findFirst();
//
//        if (activeDiscount.isPresent()) {
//            BigDecimal discountValue = activeDiscount.get().getValue();
//            BigDecimal discountPrice = tour.getPrice().subtract(
//                    tour.getPrice().multiply(discountValue).divide(BigDecimal.valueOf(100))
//            );
//            dto.setDiscountValue(discountValue);
//            dto.setDiscountPrice(discountPrice);
//        } else {
//            dto.setDiscountValue(BigDecimal.ZERO);
//            dto.setDiscountPrice(tour.getPrice());
//        }
//
//        return dto;
//    }

}
