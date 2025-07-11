package org.example.travelapp.dto;

import lombok.Data;
import org.example.travelapp.model.Address;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String email;
    private String phone;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private Address address;
}
