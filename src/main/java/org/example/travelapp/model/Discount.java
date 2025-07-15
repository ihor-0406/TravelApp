package org.example.travelapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal value;

    private LocalDate startDate;
    private LocalDate endDate;

    private String description;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;
}
