package org.example.travelapp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingDto {
    private Long id;
    private Long tourId;
    private LocalDate bookingDate;
    private Integer numberOfPeople;
    private String status;

}
