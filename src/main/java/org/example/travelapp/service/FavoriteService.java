package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Favorite;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.FavoriteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Transactional(readOnly = true)
    public boolean isFavorite(Account account, Tour tour) {
        return favoriteRepository.existsByAccountAndTour(account, tour);
    }

    @Transactional(readOnly = true)
    public List<Favorite> getFavoriteByUser(Account account) {

        return favoriteRepository.findByAccount(account);
    }

    @Transactional
    public void addToFavorites(Account account, Tour tour) {
        if(favoriteRepository.findByAccountAndTour(account,tour).isEmpty()){
            favoriteRepository.save(new Favorite(null, account, tour, LocalDateTime.now()));
        }
    }

    @Transactional
    public void removeFromFavorites(Account account, Tour tour) {
        favoriteRepository.deleteByAccountAndTour(account,tour);
    }
}
