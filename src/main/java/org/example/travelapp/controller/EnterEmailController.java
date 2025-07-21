package org.example.travelapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Gender;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class EnterEmailController {

    private final AccountRepository accountRepository;

    @PostMapping("/enter-email")
    public void enterEmail(@RequestBody EmailRequest request, HttpServletRequest httpRequest) {
        String email = request.getEmail();

        if (accountRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("409");
        }

        HttpSession session = httpRequest.getSession();
        String name = (String) session.getAttribute("oauth_name");
        String id = (String) session.getAttribute("oauth_id");
        String provider = (String) session.getAttribute("oauth_provider");

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

        User principal = new User(email, "OAUTH2_USER", Collections.singleton(Role.USER));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }

    public static class EmailRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
