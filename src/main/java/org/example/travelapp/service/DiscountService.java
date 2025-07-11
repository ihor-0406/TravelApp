package org.example.travelapp.service;

import org.example.travelapp.dto.DiscountDto;

import java.util.List;

public interface DiscountService {
    List<DiscountDto>  getAllDiscounts();

    DiscountDto  createDiscount(DiscountDto dto);

    DiscountDto getDiscountById(Long id);

    DiscountDto updateDiscount(Long id, DiscountDto dto);
    void deleteDiscount(Long id);


}
