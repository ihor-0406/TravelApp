package org.example.travelapp.dto;

import lombok.Data;
import org.example.travelapp.model.Availability;
import org.example.travelapp.model.Difficulty;
import org.example.travelapp.model.TourType;

import java.math.BigDecimal;

@Data
public class TourFilterRequstDto {
    private String keyword;
    private String location;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String duration;
    private Difficulty difficulty;
    private Availability availability;
    private TourType tourType;
}
