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
    private String location;
    private String title;
    private String description;
    private String duration;
    private String availability;
    private String difficulty;
    private BigDecimal price;
    private String imageUrl;
    private BigDecimal discountValue; //..%..
    private BigDecimal discountPrice;
    private BigDecimal rating;

}
