package org.example.travelapp.model;

import com.stripe.model.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stripeSessionId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime paymentDateTime;

    @ManyToOne
    @JoinColumn(name="account_id")
    private Account account;

    @OneToOne(mappedBy = "payment")
    private Booking booking;

    private String email;
    private Integer amount;

}
