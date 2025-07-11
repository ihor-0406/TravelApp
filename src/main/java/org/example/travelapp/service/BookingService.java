package org.example.travelapp.service;

import org.example.travelapp.dto.BookingDto;

import java.util.List;

public interface BookingService {
    BookingDto createBooking(BookingDto bookingDto);
    List<BookingDto> getAllBookings();
    BookingDto getBookingById(Long id);
    BookingDto updateBooking(Long id, BookingDto bookingDto);

    void deleteBooking(Long id);
}
