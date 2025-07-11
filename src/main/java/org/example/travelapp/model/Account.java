package org.example.travelapp.model;

import jakarta.persistence.*;
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
