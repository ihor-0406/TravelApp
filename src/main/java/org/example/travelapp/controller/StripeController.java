package org.example.travelapp.controller;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Tour;
import org.example.travelapp.service.BookingService;
import org.example.travelapp.service.StripeService;
import org.example.travelapp.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.param.checkout.SessionCreateParams;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class StripeController {

    private final StripeService stripeService;
    private final TourService tourService;
    private final BookingService bookingService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("tourId") || !payload.containsKey("tourTitle") || !payload.containsKey("adults") || !payload.containsKey("email")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            Long tourId = Long.parseLong(payload.get("tourId").toString());
            String tourTitle = payload.get("tourTitle").toString();
            Integer adults = Integer.parseInt(payload.get("adults").toString());
            String email = payload.get("email").toString();

            Tour tour = tourService.findById(tourId)
                    .orElseThrow(() -> new RuntimeException("Tour not found"));

            if (tour.getPrice() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tour price not set"));
            }

            BigDecimal price = tour.getPrice();
            long amount = price.multiply(BigDecimal.valueOf(adults)).multiply(BigDecimal.valueOf(100)).longValue();

            SessionCreateParams params = stripeService.buildSessionParams(tourTitle, amount, tourId, email);
            Session session = stripeService.createSession(params);

            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid numeric values"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create session: " + e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = stripeService.constructEvent(payload, sigHeader);

            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null && session.getMetadata() != null) {
                    String tourId = session.getMetadata().get("tourId");
                    String email = session.getMetadata().get("email");

                    bookingService.confirmBooking(Long.parseLong(tourId), email);
                }
            }

            return ResponseEntity.ok("");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }
    }
}