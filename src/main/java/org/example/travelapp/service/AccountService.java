package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.example.travelapp.model.Account;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    @Value("${app.upload.dir:src/main/resources/static/uploads/avatars}")
    private String uploadDir;

    public Optional<Account> findByEmail(String  email) {
        return accountRepository.findByEmail(email);
    }

    public Account save(Account account) {
        return accountRepository.save(account);
    }

    public Optional<Account> findById(Long id) {
        return accountRepository.findById(id);
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Account getCurrentAccountOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return  null;
        }
        String email = authentication.getName();
        return accountRepository.findByEmail(email).orElse(null);
    }

    public Optional<Account> getCurrentAccount() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return accountRepository.findByEmail(email);
        } else {
            return Optional.empty();
        }
    }




    public String storeAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Empty avatar file");
        }
        try {
            Path dirPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            String original = file.getOriginalFilename();
            String ext = original.substring(original.lastIndexOf('.'));
            String filename = UUID.randomUUID() + ext;
            Path target = dirPath.resolve(filename);
            file.transferTo(target.toFile());


            return "/uploads/avatars/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store avatar file", e);
        }
    }
}
