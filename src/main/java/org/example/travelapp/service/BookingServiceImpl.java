package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Booking;
import org.example.travelapp.model.BookingStatus;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.BookingRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final TourRepository tourRepository;

    @Override
    public BookingDto createBooking(BookingDto bookingDto) {
        Booking booking = new Booking();

        booking.setBookingDate(bookingDto.getBookingDate());
        booking.setNumberOfPeople(bookingDto.getNumberOfPeople());
        booking.setStatus(bookingDto.getStatus());

        Account account = getCurrentAccount();
        Tour tour = tourRepository.findById(bookingDto.getTourId()).orElse(null);

        booking.setAccount(account);
        booking.setTour(tour);

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this :: mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDto getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this :: mapToDto)
                .orElseThrow();
    }

    @Override
    public BookingDto updateBooking(Long id, BookingDto bookingDto) {
        Booking booking = bookingRepository.findById(id).orElseThrow();

        booking.setBookingDate(bookingDto.getBookingDate());
        booking.setNumberOfPeople(bookingDto.getNumberOfPeople());
        booking.setStatus(bookingDto.getStatus());

        Account account = getCurrentAccount();
        booking.setTour(tourRepository.findById(bookingDto.getTourId()).orElseThrow());

        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
    private BookingDto mapToDto(Booking booking) {
        BookingDto dto = new BookingDto();

        dto.setId(booking.getId());
        dto.setTourId(booking.getTour().getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setStatus(booking.getStatus());
        return dto;
    }

    @Override
    public List<BookingDto> getByAccount(Account account) {
        List<Booking> bookings = bookingRepository.findAllByAccount(account);
        return bookings.stream().map(this :: toDto)
                .collect(Collectors.toList());
    }

    private Account getCurrentAccount() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if(principal instanceof UserDetails){
            email = ((UserDetails) principal).getUsername();
        }else {
            email = principal.toString();
        }
        return accountRepository.findByEmail(email)
                .orElseThrow();
    }
    private  BookingDto toDto(Booking b) {
        return BookingDto.builder()
                .id(b.getId())
                .tourId(b.getTour().getId())
                .tourTitle(b.getTour().getTitle())
                .bookingDate(b.getBookingDate())
                .numberOfPeople(b.getNumberOfPeople())
                .status(b.getStatus())
                .build();
    }
}
