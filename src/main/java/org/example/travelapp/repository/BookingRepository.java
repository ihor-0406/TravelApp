package org.example.travelapp.repository;

import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Booking;
import org.example.travelapp.model.BookingStatus;
import org.example.travelapp.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findAllByAccount(Account account);
}
