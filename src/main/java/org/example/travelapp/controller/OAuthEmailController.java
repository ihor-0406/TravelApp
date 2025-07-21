package org.example.travelapp.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Gender;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OAuthEmailController {

    private final AccountRepository accountRepository;

    @PostMapping("/enter-email")
    public ResponseEntity<?> enterEmail(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (accountRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        String name = (String) session.getAttribute("oauth_name");
        String provider = (String) session.getAttribute("oauth_provider");
        String id = (String) session.getAttribute("oauth_id");

        if (name == null || provider == null || id == null) {
            return ResponseEntity.badRequest().body("Session expired or invalid");
        }

        Account account = new Account();
        account.setEmail(email);
        account.setPasswordHash("OAUTH2_USER");
        account.setRole(Role.USER);
        account.setRegistrationDate(LocalDate.now());
        account.setGender(Gender.UNKNOWN);
        account.setFirstName(name);
        account.setLastName(provider);
        account.setAvatarUrl("https://graph.facebook.com/" + id + "/picture?type=large");

        accountRepository.save(account);

        session.removeAttribute("oauth_name");
        session.removeAttribute("oauth_provider");
        session.removeAttribute("oauth_id");

        return ResponseEntity.ok("Account created");
    }
}
