package org.example.travelapp.service;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    private static final String STRIPE_SECRET_KEY = "sk_test_51RjeuLCLcsetmetldxIE2HqN0e9kmgYJRdOtGYwvyOd6Cc9V7qp6HVAioPWo4zRAspJ0jECAzZrzZl8uF7DPvdKL00DN7hEx4Z";

    @PostConstruct
    public void init() {
        Stripe.apiKey = STRIPE_SECRET_KEY;
    }

    public Session createSession(SessionCreateParams params) {
        try {
            return Session.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Stripe session creation failed", e);
        }
    }

    public SessionCreateParams buildSessionParams(String tourTitle, long amountInCents) {
        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/success") // Замени на нужный URL
                .setCancelUrl("http://localhost:3000/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(tourTitle)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();
    }
}
