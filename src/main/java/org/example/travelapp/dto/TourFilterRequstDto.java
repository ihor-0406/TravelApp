package org.example.travelapp.dto;

import lombok.Data;
import org.example.travelapp.model.Availability;
import org.example.travelapp.model.Difficulty;
import org.example.travelapp.model.TourType;
import java.util.List;

@Data
public class TourFilterRequstDto {
    private List<String> locations;
    private List<TourType> types;
    private List<Integer> maxPeople;
    private List<Difficulty> difficulty;
    private List<Availability> availability;
//    private List<Integer> ratings;
    private Integer minPrice;
    private Integer maxPrice;
    private String sortBy;
}

