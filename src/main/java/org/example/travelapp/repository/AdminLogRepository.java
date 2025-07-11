package org.example.travelapp.repository;

import org.example.travelapp.model.Account;
import org.example.travelapp.model.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.security.Timestamp;
import java.util.List;

@Repository
public interface AdminLogRepository  extends JpaRepository<AdminLog, Long> {

    List<AdminLog> findByAccount(Account admin);

    List<AdminLog> findByTimestampAfter(Timestamp time);
}
