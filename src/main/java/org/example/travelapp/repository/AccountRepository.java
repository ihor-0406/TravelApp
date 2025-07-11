package org.example.travelapp.repository;

import org.example.travelapp.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;



import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);

    Account id(Long id);
}
