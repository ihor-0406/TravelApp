package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourCreateRequestDto;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Tour;
import org.example.travelapp.model.TourImage;
import org.example.travelapp.repository.TourImageRepository;
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

import java.security.Principal;
import java.util.List;
import java.util.Collections;
import java.util.Map;


import static com.fasterxml.jackson.databind.type.LogicalType.Collection;


@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;
    private final TourImageRepository tourImageRepository;
    private final FavoriteService  favoriteService;
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTour (@PageableDefault(size = 10) Pageable pageable) {
       Page<Tour> tours = tourService.findAll(pageable);
        return ResponseEntity.ok(tours.getContent());
    }

    @PostMapping("/filter")
    public Page<Tour> filterTours(@RequestBody TourFilterRequstDto filter,
                                  @PageableDefault(size = 10) Pageable pageable) {
        return tourService.filterTours(filter, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        return tourService.findById(id)
                .map(ResponseEntity :: ok)
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

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id,
                                           @RequestBody Tour updatedTour,
                                           Principal principal) {
        Tour tour = tourService.update(id, updatedTour, principal.getName());
        return ResponseEntity.ok(tour);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }

//    ================================================================================================
    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> addFavorite(@PathVariable("id") Long id,
                                            Authentication auth) {

        if (auth==null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountService.getCurrentAccount();
        Tour tour = tourService.findById(id)
                .orElseThrow();
        favoriteService.addToFavorites(account, tour);
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
        Account account = accountService.getCurrentAccount();

        Tour tour = tourService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean fav = favoriteService.isFavorite(account, tour);

        return Collections.singletonMap("isFavorite", fav);
    }

//    ===================================================================

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tour> createTour(@RequestBody TourCreateRequestDto tourDto, Principal principal) {
        Tour tour = tourService.create(tourDto, principal.getName());
        return ResponseEntity.ok(tour);
    }


}
