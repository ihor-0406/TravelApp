package org.example.travelapp.repository;


import org.example.travelapp.model.Account;
import org.example.travelapp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT DATE(b.bookingDate), COUNT(b) FROM Booking b GROUP BY DATE(b.bookingDate) ORDER BY DATE(b.bookingDate)")
    List<Object[]> countBookingsGroupedByDate();

    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countByStatus();

    List<Booking> findAllByAccount(Account account);
    List<Booking> findAllByAccountAndTourId(Account account, Long tourId);



}
