package org.example.travelapp.dto;

import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String city;
    private String zipCode;
    private String country;
}
