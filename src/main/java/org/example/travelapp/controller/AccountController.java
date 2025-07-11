package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.AccountDto;
import org.example.travelapp.dto.AddressDto;
import org.example.travelapp.dto.BookingDto;
import org.example.travelapp.dto.TourDto;
import org.example.travelapp.model.*;
import org.example.travelapp.service.AccountService;
import org.example.travelapp.service.BookingService;
import org.example.travelapp.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final FavoriteService favoriteService;
    private final BookingService bookingService;

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

        if(accountDto.getGender() != null) {
            account.setGender(Gender.valueOf(accountDto.getGender()));
        }else {
            account.setGender(null);
        }

        account.setAvatarUrl(accountDto.getAvatarUrl());

        AddressDto addressDto = accountDto.getAddress();
        Address address = new Address();
        if (addressDto != null) {
            address.setStreet(addressDto.getStreet());
            address.setCity(addressDto.getCity());
            address.setZipcode(addressDto.getZipCode());
            address.setCountry(addressDto.getCountry());
        }
        account.setAddress(address);

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

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDto>> getBookings() {
        Account account = accountService.getCurrentAccount();
        List<BookingDto> bookings = bookingService.getByAccount(account);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/avatar")
    public ResponseEntity<AccountDto> updateAvatar(@RequestParam("file") MultipartFile file)  {
        Account account = accountService.getCurrentAccount();
        String url = accountService.storeAvatar(file);
        account.setAvatarUrl(url);
        accountService.save(account);
        return ResponseEntity.ok(toDto(account));
    }


    private AccountDto toDto(Account account) {
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
       return accountDto;
    }

    private TourDto toTourDto(Tour tour) {
        TourDto tourDto = new TourDto();
        tourDto.setId(tour.getId());
        tourDto.setTitle(tour.getTitle());
        tourDto.setDescription(tour.getDescription());
        tourDto.setPrice(tour.getPrice());
        return tourDto;
    }


}
