package org.example.travelapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.LoginRequest;
import org.example.travelapp.dto.LoginResponse;
import org.example.travelapp.dto.RegisterRequest;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.service.EmailsService;
import org.example.travelapp.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final PasswordResetService passwordResetService;
    private final EmailsService emailsService;


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request,
                                               HttpServletRequest httpRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword())
        );

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);


        UserDetails user = (UserDetails) authentication.getPrincipal();
        Account account = accountRepository.findByEmail(user.getUsername()).orElse(null);
        String avatarUrl = account != null ? account.getAvatarUrl() : null;

        return ResponseEntity.ok(new LoginResponse("Login successful", avatarUrl));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setPhone(request.getPhone());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        account.setFirstName(request.getFirstName());
        account.setLastName(request.getLastName());
        account.setDateOfBirth(request.getDateOfBirth());
        account.setAvatarUrl(request.getAvatarUrl());
        account.setAddress(request.getAddress());
        account.setRole(Role.USER);

        accountRepository.save(account);

        return ResponseEntity.ok(new LoginResponse("Register successful", account.getAvatarUrl()));
    }

    @PostMapping("/login/oauth2/success")
    public void handleOAuth2Success(@AuthenticationPrincipal OAuth2User principal,
                                    HttpSession session,
                                    HttpServletResponse response) throws IOException {
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String sub = principal.getAttribute("sub");

        if (email == null && sub != null) {
            email = sub; // Используем sub как email, без @googleuser.com
        }

        if (email == null || name == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Не удалось получить email или имя от Google");
            return;
        }

        Account account = accountRepository.findByEmail(email).orElse(null);
        if (account == null) {
            account = new Account();
            account.setEmail(email);
            account.setFirstName(name.split(" ")[0]);
            account.setLastName(name.split(" ").length > 1 ? name.split(" ")[1] : "");
            account.setPasswordHash(passwordEncoder.encode("default"));
            account.setRole(Role.USER);
            accountRepository.save(account);
        }

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(email, null, account.getRole().getAuthorities());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        response.sendRedirect("http://localhost:3000/profile");
    }


    @PostMapping("/forgot-password")
    public  ResponseEntity<?> forgotPassword(@RequestParam String email) {

        Optional<Account> userOpt = accountRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        String token = passwordResetService.createToken(email);
        emailsService.send(email, token);

        return ResponseEntity.ok(new LoginResponse("Reset email sent", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {

        Optional<Account> userOpt = passwordResetService.validateToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Неверный или истекший токен");
        }

        Account account = userOpt.get();
        account.setPasswordHash(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        passwordResetService.clearToken(token);
        return ResponseEntity.ok("Password reset successful");

    }
}
