package org.example.travelapp.service;
import org.example.travelapp.model.*;
import org.example.travelapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.BookingRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final TourRepository tourRepository;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

//    @Override
//    public BookingDto createBooking(BookingDto bookingDto) {
//        Booking booking = new Booking();
//
//        booking.setBookingDate(bookingDto.getBookingDate());
//        booking.setNumberOfPeople(bookingDto.getNumberOfPeople());
//        booking.setStatus(bookingDto.getStatus());
//
//        Account account = getCurrentAccount();
//        Tour tour = tourRepository.findById(bookingDto.getTourId())
//                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + bookingDto.getTourId()));
//        booking.setAccount(account);
//        booking.setTour(tour);
//
//        return mapToDto(bookingRepository.save(booking));
//    }
@Override
public BookingDto createBookingWithPayment(BookingDto bookingDto, String paymentIntentId) {
    Stripe.apiKey = stripeSecretKey;

    try {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(paymentIntent.getStatus())) {
            throw new RuntimeException("Payment not successful");
        }

        Booking booking = new Booking();
        booking.setBookingDate(bookingDto.getBookingDate());
        booking.setNumberOfPeople(bookingDto.getNumberOfPeople());
        booking.setStatus(BookingStatus.PENDING);

        Account account = getCurrentAccount();
        Tour tour = tourRepository.findById(bookingDto.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + bookingDto.getTourId()));
        booking.setAccount(account);
        booking.setTour(tour);

        Payment payment = new Payment();
        payment.setStripeSessionId(paymentIntentId);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentDateTime(LocalDateTime.now());
        payment.setAccount(account);
        payment = paymentRepository.save(payment);
        booking.setPayment(payment);

        return mapToDto(bookingRepository.save(booking));
    } catch (StripeException e) {
        throw new RuntimeException("Stripe payment verification failed: " + e.getMessage(), e);
    }
}
    @Override
    public void createBookingAfterPayment(String email, Long tourId, int adults, Payment payment) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Booking booking = new Booking();
        booking.setTour(tour);
        booking.setBookingDate(LocalDate.now());
        booking.setNumberOfPeople(adults);
        booking.setStatus(BookingStatus.PENDING);
        booking.setAccount(account);
        booking.setPayment(payment);

        bookingRepository.save(booking);
    }


    @Override
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this :: toDto)
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

    @Override
    public void deleteBookingByAdmin(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }


    @Override
    public void confirmBooking(Long tourId, String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with email: " + email));

        List<Booking> bookings = bookingRepository.findAllByAccountAndTourId(account, tourId);
        if (bookings.isEmpty()) {
            throw new RuntimeException("No booking found for confirmation");
        }

        for (Booking booking : bookings) {
            Payment payment = booking.getPayment();
            if (payment != null && payment.getStatus() == PaymentStatus.SUCCESS) {
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
            } else {
                throw new RuntimeException("Payment not confirmed for booking ID: " + booking.getId());
            }
        }
    }
    @Override
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
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
    private  BookingDto toDto(Booking booking) {
        BookingDto dto = new BookingDto();

        dto.setId(booking.getId());
        dto.setTourId(booking.getTour().getId());
        dto.setTourTitle(booking.getTour().getTitle());
        dto.setBookingDate(booking.getBookingDate());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setStatus(booking.getStatus());
        dto.setAccountEmail(booking.getAccount().getEmail());

        return dto;
    }
}
