package org.example.travelapp.controller;

import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Tour;
import org.example.travelapp.service.StripeService;
import org.example.travelapp.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.param.checkout.SessionCreateParams;


import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class StripeController {

    private final StripeService stripeService;
    private final TourService tourService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            // Проверяем входящие поля
            if (!payload.containsKey("tourId") || !payload.containsKey("tourTitle") || !payload.containsKey("adults")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // Безопасное извлечение
            Long tourId = Long.parseLong(payload.get("tourId").toString());
            String tourTitle = payload.get("tourTitle").toString();
            Integer adults = Integer.parseInt(payload.get("adults").toString());

            // Получение тура
            Tour tour = tourService.findById(tourId)
                    .orElseThrow(() -> new RuntimeException("Tour not found"));

            if (tour.getPrice() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tour price not set"));
            }

            // Расчёт суммы в центах
            BigDecimal price = tour.getPrice();
            long amount = price.multiply(BigDecimal.valueOf(adults)).multiply(BigDecimal.valueOf(100)).longValue();

            // Создание Stripe-сессии
            SessionCreateParams params = stripeService.buildSessionParams(tourTitle, amount);
            Session session = stripeService.createSession(params);

            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid numeric values"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create session: " + e.getMessage()));
        }
    }


}

