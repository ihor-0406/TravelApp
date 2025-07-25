package org.example.travelapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account account;

    @ManyToOne
    private Tour tour;

    private LocalDate bookingDate;
    private Integer numberOfPeople;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToOne
    private Payment payment;
}
