package org.example.travelapp.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    public String getSecretKey() {
        return secretKey;
    }

    public Session createSession(SessionCreateParams params) {
        try {
            return Session.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Stripe session creation failed", e);
        }
    }

    public SessionCreateParams buildSessionParams(String tourTitle, long amount, Long tourId, String email) {
        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:3000/booking-cancelled")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(amount)
                                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(tourTitle)
                                                        .build())
                                                .build()
                                )
                                .build()
                )
                .putMetadata("tourId", tourId.toString())
                .putMetadata("email", email)
                .build();
    }

    public Event constructEvent(String payload, String sigHeader) throws SignatureVerificationException {
        String endpointSecret = "your_webhook_secret_here";
        return Webhook.constructEvent(payload, sigHeader, endpointSecret);
    }

}
