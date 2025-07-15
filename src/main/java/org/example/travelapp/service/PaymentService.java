package org.example.travelapp.service;

import com.stripe.model.checkout.Session;
import org.example.travelapp.model.Payment;

public interface PaymentService {
    Payment createPaymentFromSession(Session session);
}
