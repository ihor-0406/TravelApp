package org.example.travelapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Gender;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;

@RestController
@RequiredArgsConstructor
public class OAuthEmailController {

    private final AccountRepository accountRepository;

    @PostMapping("/enter-email")
    public ResponseEntity<?> completeOAuthLogin(@RequestBody EmailRequest request, HttpServletRequest session) {

        String name = (String) session.getSession().getAttribute("oauth_name");
        String id = (String) session.getSession().getAttribute("oauth_id");
        String provider = (String) session.getSession().getAttribute("oauth_provider");

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body("User already exists");
        }
        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setFirstName(name);
        account.setLastName(provider.equals("facebook") ? "Facebook" : provider);
        account.setAvatarUrl("https://graph.facebook.com/" + id + "/picture?type=large");
        account.setPasswordHash("OAUTH2_USER");
        account.setRole(Role.USER);
        account.setGender(Gender.UNKNOWN);
        account.setRegistrationDate(LocalDate.now());

        accountRepository.save(account);

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(account, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        return ResponseEntity.ok().build();
    }
    public static class EmailRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
