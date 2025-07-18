package org.example.travelapp.service;

import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.travelapp.model.Payment;
import org.example.travelapp.model.PaymentStatus;
import org.example.travelapp.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public Payment createPaymentFromSession(Session session) {
        log.info("Creating payment from session: {}", session.getId());
        Payment payment = new Payment();

        payment.setStripeSessionId(session.getId());
        payment.setPaymentDateTime(LocalDateTime.now());

        // Проверка статуса сессии
        String paymentStatus = session.getPaymentStatus();
        if ("paid".equalsIgnoreCase(paymentStatus)) {
            payment.setStatus(PaymentStatus.SUCCESS);
        } else if (paymentStatus != null && !paymentStatus.isEmpty()) {
            payment.setStatus(PaymentStatus.PENDING);
        } else {
            log.warn("Payment status is null or empty for session: {}", session.getId());
            payment.setStatus(PaymentStatus.PENDING);
        }

        // Обработка данных
        if (session.getMetadata() != null) {
            String email = session.getMetadata().get("email");
            if (email != null) {
                payment.setEmail(email);
            } else {
                log.warn("Email metadata is missing for session: {}", session.getId());
            }
        } else {
            log.warn("Metadata is null for session: {}", session.getId());
        }

        // Получение суммы из session.getAmountTotal()
        if (session.getAmountTotal() != null) {
            try {
                payment.setAmount(session.getAmountTotal().intValue());
            } catch (NumberFormatException e) {
                log.error("Failed to parse amount {} for session: {}", session.getAmountTotal(), session.getId(), e);
            }
        } else {
            log.warn("Amount total is null for session: {}", session.getId());
        }

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment saved successfully with ID: {}", savedPayment.getId());
        return savedPayment;
    }
}


