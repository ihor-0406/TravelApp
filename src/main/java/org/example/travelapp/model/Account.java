package org.example.travelapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;


    private String phone;

    @Column(nullable = false)
//    @Size(min = 8, message = "Password must be at least 8 characters long")
//    @Pattern(
//            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
//            message = "Password must contain at least one uppercase letter, one number, and one special character"
//    )
    private String passwordHash;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;

    private Gender gender;

    private String avatarUrl;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", nullable = true)
    private Address address;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name =" registration_data", updatable = false)
    @CreationTimestamp
    private LocalDate registrationDate;

}
