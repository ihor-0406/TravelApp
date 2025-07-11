package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.PasswordResetToken;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.PasswordResetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    @Autowired
    private final PasswordResetRepository tokenRepository;

    @Autowired
    private final AccountRepository accountRepository;

    public String createToken (String email) {
        Optional<Account> userOpt = accountRepository.findByEmail(email);

        Account account = userOpt.get();
        tokenRepository.findByAccountId(account.getId()).ifPresent(tokenRepository :: delete);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setAccount(userOpt.get());
        resetToken.setExpiration(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);
        return token;
    }

    public Optional<Account> validateToken (String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> t.getExpiration().isAfter(LocalDateTime.now()))
                .map(PasswordResetToken :: getAccount);
    }

    public  void clearToken (String token) {
        tokenRepository.findByToken(token).ifPresent(tokenRepository::delete);
    }
}
