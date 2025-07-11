package org.example.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal discountValue; //..%..
    private BigDecimal discountPrice;
}
