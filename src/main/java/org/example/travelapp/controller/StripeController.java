package org.example.travelapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.*;
import org.example.travelapp.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class StripeController {

    private final StripeService stripeService;
    private final TourService tourService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final AccountService accountService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;


    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("tourId") || !payload.containsKey("tourTitle") ||
                    !payload.containsKey("adults") || !payload.containsKey("email")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            Long tourId = Long.parseLong(payload.get("tourId").toString());
            String tourTitle = payload.get("tourTitle").toString();
            Integer adults = Integer.parseInt(payload.get("adults").toString());
            String email = payload.get("email").toString();

            Tour tour = tourService.findById(tourId)
                    .orElseThrow(() -> new RuntimeException("Tour not found"));

            if (tour.getPrice() == null || tour.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid tour price"));
            }

            if (adults <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid number of adults"));
            }

            BigDecimal price = tour.getPrice();
            BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(adults)).multiply(BigDecimal.valueOf(100));
            if (totalAmount.scale() > 0) {
                totalAmount = totalAmount.setScale(0, BigDecimal.ROUND_HALF_UP);
            }
            if (totalAmount.compareTo(BigDecimal.valueOf(Long.MAX_VALUE)) > 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount exceeds maximum limit"));
            }
            long amount = totalAmount.longValueExact();

            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(tourTitle)
                            .build();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("usd")
                            .setUnitAmount(amount)
                            .setProductData(productData)
                            .build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setPriceData(priceData)
                            .setQuantity(Long.valueOf(adults))
                            .build();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:3000/payment/cancel")
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .addLineItem(lineItem)
                    .putMetadata("tourId", tourId.toString())
                    .putMetadata("email", email)
                    .putMetadata("adults", adults.toString())
                    .build();


            Session session = stripeService.createSession(params);
            Account account = accountService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            Booking booking = new Booking();
            booking.setTour(tour);
            booking.setAccount(account);
            booking.setNumberOfPeople(adults);
            booking.setStatus(BookingStatus.PENDING);
            booking.setBookingDate(LocalDate.now());

            booking = bookingService.save(booking);
            String title = booking.getTour() != null ? booking.getTour().getTitle() : "Unknown";
            Map<String, Object> metadata = Map.of("tour", title);

            return ResponseEntity.ok(Map.of("url", session.getUrl()));

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid numeric values: " + e.getMessage()));
        } catch (ArithmeticException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Amount calculation overflow: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // покажет стек в консоли
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
            }
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(
            @RequestBody byte[] payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        String payloadStr = new String(payload, StandardCharsets.UTF_8);


        try {
            Event event = Webhook.constructEvent(payloadStr, sigHeader, endpointSecret);
            String eventType = event.getType();

            System.out.println("📡 Stripe Event Type: " + eventType);

            switch (eventType) {
                case "checkout.session.completed" -> {
                    Session session = (Session) event.getDataObjectDeserializer()
                            .getObject()
                            .orElseThrow(() -> new RuntimeException("No session object"));

                    System.out.println("✅ Session received: " + session.toJson());

                    String email = session.getMetadata().get("email");
                    String tourIdStr = session.getMetadata().get("tourId");
                    String adultsStr = session.getMetadata().get("adults");

                    if (email == null || tourIdStr == null || adultsStr == null) {
                        System.err.println(" Missing metadata in session!");
                        return ResponseEntity.badRequest().body("Missing metadata in session");
                    }

                    int adults = Integer.parseInt(adultsStr);
                    Payment payment = paymentService.createPaymentFromSession(session);

                    if (payment.getId() == null) {
                        System.err.println("Payment was not saved to database for session: " + session.getId());
                        throw new RuntimeException("Payment not saved");
                    }

                    bookingService.createBookingAfterPayment(email, Long.parseLong(tourIdStr), adults, payment);
                    System.out.println("Booking saved successfully.");
                    break;
                }
                default -> {
                    System.out.println(" Unhandled event: " + eventType);
                    break;
                }
            }

            return ResponseEntity.ok("Event processed");

        } catch (SignatureVerificationException e) {
            System.err.println(" Signature error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Stripe signature");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing failed: " + e.getMessage());
        }
    }

}