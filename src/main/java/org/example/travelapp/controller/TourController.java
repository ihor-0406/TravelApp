package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourCreateRequestDto;
import org.example.travelapp.dto.TourDto;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Discount;
import org.example.travelapp.model.Tour;
import org.example.travelapp.model.TourImage;
import org.example.travelapp.repository.TourImageRepository;
import org.example.travelapp.repository.TourRepository;
import org.example.travelapp.service.AccountService;
import org.example.travelapp.service.FavoriteService;
import org.example.travelapp.service.TourService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;
    private final TourRepository tourRepository;
    private final TourImageRepository tourImageRepository;
    private final FavoriteService  favoriteService;
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<TourDto>> getAllTour(@PageableDefault(size = 9) Pageable pageable) {
        Page<Tour> tours = tourService.findAll(pageable);

        List<TourDto> dtos = tours.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<TourDto>> filterTours(@RequestBody TourFilterRequstDto filters,
                                                     @PageableDefault(size = 9) Pageable pageable) {
        System.out.println("Received filter request: " + filters);
        Page<Tour> result = tourService.filterTours(filters, pageable);

        Page<TourDto> dtoPage = result.map(this::mapToDto);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDto> getTourById(@PathVariable Long id) {
        return tourService.findById(id)
                .map(tour -> ResponseEntity.ok(mapToDto(tour)))
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/{id}/images")
    public ResponseEntity<List<TourImage>> getTourImages(@PathVariable Long id) {
        return tourService.findById(id)
                .map(tour -> ResponseEntity.ok(tourImageRepository.findByTour(tour)))
                .orElse(ResponseEntity.notFound().build());
    }


//    ==================================================================================================================
//    ==================                Admin               ============================================================
//    ==================================================================================================================


    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id,
                                           @RequestBody TourCreateRequestDto dto,
                                           Principal principal) {
        Optional<Tour> optionalTour = tourRepository.findById(id);
        if (optionalTour.isEmpty()) return ResponseEntity.notFound().build();

        Tour tour = optionalTour.get();
        updateEntityFromDto(tour, dto);
        tourRepository.save(tour);


        List<TourImage> oldImages = tourImageRepository.findByTour(tour);
        tourImageRepository.deleteAll(oldImages);

        if (dto.getImageUrls() != null) {
            for (String url : dto.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    TourImage img = new TourImage();
                    img.setTour(tour);
                    img.setImageUrls(url.trim());
                    tourImageRepository.save(img);
                }
            }
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tour> createTour(@RequestBody TourCreateRequestDto tourDto, Principal principal) {
        Tour tour = tourService.create(tourDto, principal.getName());

        if (tourDto.getImageUrls() != null) {
            for (String url : tourDto.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    TourImage img = new TourImage();
                    img.setTour(tour);
                    img.setImageUrls(url.trim());
                    tourImageRepository.save(img);
                }
            }
        }

        return ResponseEntity.ok(tour);
    }

    //    ================================================================================================

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> addFavorite(@PathVariable("id") Long id,
                                            Authentication auth) {

        if (auth==null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Account> account = accountService.getCurrentAccount();
        Tour tour = tourService.findById(id)
                .orElseThrow();
        favoriteService.addToFavorites(account.orElse(null), tour);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<Void> removeFavorite(@PathVariable("id") Long id,
                                               Authentication auth) {
        if (auth==null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        Account account = accountService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Tour tour = tourService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        favoriteService.removeFromFavorites(account, tour);
        return ResponseEntity.noContent().build();

    }

    @GetMapping("/{id}/favorite")
    public Map<String, Boolean> isFavorite(@PathVariable Long id) {
        Optional<Account> account = accountService.getCurrentAccount();

        Tour tour = tourService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean fav = favoriteService.isFavorite(account.orElse(null), tour);

        return Collections.singletonMap("isFavorite", fav);
    }

//    ===================================================================


    public void updateEntityFromDto(Tour tour, TourCreateRequestDto dto) {
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
    }

    public TourDto mapToDto(Tour tour) {
        TourDto dto = new TourDto();

        dto.setId(tour.getId());
        dto.setLocation(tour.getLocation());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setDuration(tour.getDuration());
        dto.setAvailability(String.valueOf(tour.getAvailability()));
        dto.setDifficulty(tour.getDifficulty().name());
        dto.setPrice(tour.getPrice());

        if (tour.getImageUrl() != null && !tour.getImageUrl().isBlank()) {
            dto.setImageUrl(tour.getImageUrl());
        } else if (!tour.getAlbum().isEmpty()) {
            dto.setImageUrl(tour.getAlbum().get(0).getImageUrls());
        } else {
            dto.setImageUrl("https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg");
        }

        dto.setRating(
                tour.getAverageRating() != null
                        ? BigDecimal.valueOf(tour.getAverageRating())
                        : BigDecimal.ZERO
        );

        Optional<Discount> activeDiscount = tour.getDiscounts()
                .stream()
                .filter(d ->
                        !d.getStartDate().isAfter(LocalDate.now()) &&
                                !d.getEndDate().isBefore(LocalDate.now())
                )
                .findFirst();

        if (activeDiscount.isPresent()) {
            BigDecimal discountValue = activeDiscount.get().getValue();
            BigDecimal discountPrice = tour.getPrice().subtract(
                    tour.getPrice().multiply(discountValue).divide(BigDecimal.valueOf(100))
            );
            dto.setDiscountValue(discountValue);
            dto.setDiscountPrice(discountPrice);
        } else {
            dto.setDiscountValue(BigDecimal.ZERO);
            dto.setDiscountPrice(tour.getPrice());
        }

        return dto;
    }

}
