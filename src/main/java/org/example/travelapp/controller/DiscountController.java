package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.DiscountDto;
import org.example.travelapp.service.DiscountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/discounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DiscountController {

    private final DiscountService discountService;

    @PostMapping
    public ResponseEntity<DiscountDto> create(@RequestBody DiscountDto dto) {
        return ResponseEntity.ok(discountService.createDiscount(dto));
    }

    @GetMapping
    public ResponseEntity<List<DiscountDto>> getAll() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountDto> update(@PathVariable Long id, @RequestBody DiscountDto dto) {
        return ResponseEntity.ok(discountService.updateDiscount(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok().build();
    }
}
