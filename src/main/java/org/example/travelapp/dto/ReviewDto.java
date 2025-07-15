package org.example.travelapp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReviewDto {
    private Long id;
    private String comment;
    private Integer rating;
    private String LastName;
    private boolean mine;
    private LocalDate date;
}
