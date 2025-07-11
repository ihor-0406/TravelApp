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
                                        Authentication authentication) throws IOException{
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User user = token.getPrincipal();

        Map<String, Object> attributes = user.getAttributes();
        String email = (String) attributes.get("email");

        Optional<Account> existion = accountRepository.findByEmail(email);
        if(existion.isEmpty()){
            Account account = new Account();
            account.setEmail(email);
            account.setPasswordHash("OAUTH2_USER");
            account.setFirstName((String) attributes.get("given_name"));
            account.setLastName((String) attributes.get("family_name"));
            account.setAvatarUrl((String) attributes.get("picture"));
            account.setRole(Role.USER);
            account.setRegistrationDate(LocalDate.now());

            Object genderAttr = attributes.get("gender");
            if (genderAttr != null){
                try{
                    Gender gender = Gender.valueOf(genderAttr.toString().toUpperCase());
                    account.setGender(gender);
                }catch (IllegalArgumentException e){
                    account.setGender(Gender.UNKNOWN);
                }
            }else {
                account.setGender(Gender.UNKNOWN);
            }

            accountRepository.save(account);
        }

        response.sendRedirect("http://localhost:3000/profile");
    }

}
