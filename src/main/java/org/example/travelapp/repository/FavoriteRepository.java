package org.example.travelapp.repository;

import org.example.travelapp.model.Account;
import org.example.travelapp.model.Favorite;
import org.example.travelapp.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository  extends JpaRepository<Favorite, Long> {

    boolean existsByAccountAndTour(Account account, Tour tour);

    List<Favorite> findByAccount(Account account);

    Optional<Favorite> findByAccountAndTour(Account account, Tour tour);

    void  deleteByAccountAndTour(Account account, Tour tour);
}
