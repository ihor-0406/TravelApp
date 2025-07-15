package org.example.travelapp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AccountDto {
    private Long id;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String avatarUrl;
    private AddressDto address;
    private String role;
    private LocalDate registrationDate;

}
