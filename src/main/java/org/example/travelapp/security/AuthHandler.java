package org.example.travelapp.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Gender;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Component
public class AuthHandler implements AuthenticationSuccessHandler {

    private final AccountRepository accountRepository;


    public AuthHandler(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User user = token.getPrincipal();
        Map<String, Object> attributes = user.getAttributes();

        String email = (String) attributes.get("email");
        Optional<Account> existion = accountRepository.findByEmail(email);

        if (existion.isEmpty()) {
            Account account = new Account();
            account.setEmail(email);
            account.setPasswordHash("OAUTH2_USER");
            account.setRole(Role.USER);
            account.setRegistrationDate(LocalDate.now());

            String registrationId = token.getAuthorizedClientRegistrationId();

            if ("google".equals(registrationId)) {
                account.setFirstName((String) attributes.get("given_name"));
                account.setLastName((String) attributes.get("family_name"));
                account.setAvatarUrl((String) attributes.get("picture"));
            } else if ("facebook".equals(registrationId)) {
                account.setFirstName((String) attributes.get("name"));
                account.setLastName("Facebook");
                account.setAvatarUrl("https://graph.facebook.com/" + attributes.get("id") + "/picture?type=large");
            }

            account.setGender(Gender.UNKNOWN);

            accountRepository.save(account);
        }

        response.sendRedirect("https://travel-app01-04b23cb7210b.herokuapp.com/profile");
    }


}
