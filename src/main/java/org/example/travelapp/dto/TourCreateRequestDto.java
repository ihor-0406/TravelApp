package org.example.travelapp.dto;


import lombok.Data;
import org.example.travelapp.model.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TourCreateRequestDto {
    private String title;
    private String description;
    private String location;
    private String imageUrl;
    private BigDecimal price;
    private Integer maxPeople;
    private String duration;
    private Difficulty difficulty;
    private Availability availability;
    private TourType type;
    private List<String> imageUrls;
}
