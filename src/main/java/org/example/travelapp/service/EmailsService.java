package org.example.travelapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailsService {

    private JavaMailSender mailSender;

    @Value("${frontend.url}")
    private String frontendUrl;


    public EmailsService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public  void send(String to, String token) {

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Reset Password");
        message.setText(resetLink);
        mailSender.send(message);
    }
}
