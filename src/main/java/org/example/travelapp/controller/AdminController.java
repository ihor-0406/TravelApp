package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Account;
import org.example.travelapp.model.Role;
import org.example.travelapp.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AccountRepository accountRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Account>> getAllUsers() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?>deleteUser(@PathVariable Long id) {
        accountRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    @PostMapping("/user/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                            @RequestBody Role role) {
        Optional<Account> userOpt = accountRepository.findById(id);
        Account account = userOpt.get();
        account.setRole(role);
        accountRepository.save(account);
        return ResponseEntity.ok("Role updated");
    }
}
