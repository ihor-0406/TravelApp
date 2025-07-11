package org.example.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountDto {
    private Long id;
    private BigDecimal value;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Long tourId;
}
