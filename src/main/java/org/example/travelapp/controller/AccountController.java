package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.AccountDto;
import org.example.travelapp.dto.TourDto;
import org.example.travelapp.model.*;
import org.example.travelapp.service.AccountService;
import org.example.travelapp.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<AccountDto> getCurrentAccount(Authentication authentication) {
        System.out.println("Processing /api/profile request for email: " + authentication.getName());
        String email = authentication.getName();
        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oAuth2User) {
            String oAuthEmail = oAuth2User.getAttribute("email");
            if (oAuthEmail != null) {
                email = oAuthEmail;
            } else if (email.contains("@googleuser.com")) {
                email = email.replace("@googleuser.com", "");
            }
        }
        Account account = accountService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found for email: "));
        AccountDto accountDto = new AccountDto();
        accountDto.setId(account.getId());
        accountDto.setEmail(account.getEmail());
        accountDto.setPhone(account.getPhone());
        accountDto.setFirstName(account.getFirstName());
        accountDto.setLastName(account.getLastName());
        accountDto.setDateOfBirth(account.getDateOfBirth());
        accountDto.setGender(account.getGender() != null ? account.getGender().name() : null);
        accountDto.setAvatarUrl(account.getAvatarUrl());
        accountDto.setAddress(account.getAddress() != null ? account.getAddress().toString() : null);
        accountDto.setRole(account.getRole().name());
        accountDto.setRegistrationDate(account.getRegistrationDate());
        return ResponseEntity.ok(accountDto);
    }

    @PutMapping
    public  ResponseEntity<AccountDto> updateAccount(@RequestBody AccountDto accountDto) {
        Account account = accountService.getCurrentAccount();
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());
        account.setPhone(accountDto.getPhone());
        account.setDateOfBirth(accountDto.getDateOfBirth());
        account.setGender(Gender.valueOf(accountDto.getGender()));

        if(accountDto.getAddress() != null) {
            account.setAddress(new Address());
        }
        account.getAddress().setStreet(accountDto.getAddress());
        account.getAddress().setCity(accountDto.getAddress());
        account.getAddress().setCountry(accountDto.getAddress());
        accountService.save(account);

        return ResponseEntity.ok(toDto(account));
    }
    @GetMapping("/favorites")
    public ResponseEntity<List<TourDto>> getFavotites() {
        Account account = accountService.getCurrentAccount();
        List<TourDto> favotites = favoriteService.getFavoriteByUser(account).stream()
                .map(Favorite::getTour)
                .map(this :: toTourDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(favotites);
    }

    private AccountDto toDto(Account account) {
        AccountDto accountDto = new AccountDto();
        accountDto.setFirstName(account.getFirstName());
        accountDto.setLastName(account.getLastName());
        accountDto.setPhone(account.getPhone());
        accountDto.setDateOfBirth(account.getDateOfBirth());
        accountDto.setRole(account.getRole().name());
        accountDto.setGender(account.getGender().name());
        accountDto.setAddress(account.getAddress() != null ? account.getAddress().toString() : null);
        return accountDto;
    }

    private TourDto toTourDto(Tour tour) {
        TourDto dto = new TourDto();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        return dto;
    }

}
