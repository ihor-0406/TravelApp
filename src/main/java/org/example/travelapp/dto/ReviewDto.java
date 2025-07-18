package org.example.travelapp.dto;

import lombok.Data;
import org.example.travelapp.model.Account;

import java.time.LocalDate;

@Data
public class ReviewDto {
    private Long id;
    private String comment;
    private Integer rating;
    private boolean mine;
    private LocalDate date;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String city;

}
