package org.example.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.travelapp.model.BookingStatus;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingDto {
    private Long id;
    private Long tourId;
    private String tourTitle;
    private LocalDate bookingDate;
    private Integer numberOfPeople;
    private BookingStatus status;
    private String accountEmail;


}
