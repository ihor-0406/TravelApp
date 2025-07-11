package org.example.travelapp.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String tourTitle;
    private Long amount;
}
