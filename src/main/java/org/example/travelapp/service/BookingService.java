package org.example.travelapp.service;

import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Booking;
import org.example.travelapp.model.Payment;

import java.util.Collection;
import java.util.List;

public interface BookingService {
//    BookingDto createBooking(BookingDto bookingDto);
    List<BookingDto> getAllBookings();

    BookingDto getBookingById(Long id);

    BookingDto updateBooking(Long id, BookingDto bookingDto);

    void deleteBooking(Long id);

    List<BookingDto> getByAccount(Account account);

    void deleteBookingByAdmin(Long bookingId);

    BookingDto createBookingWithPayment(BookingDto bookingDto, String paymentIntentId);

    void createBookingAfterPayment(String email, Long tourId, int adults, Payment payment);

    Booking save(Booking booking);

    void confirmBooking(Long tourId, String email);


}
