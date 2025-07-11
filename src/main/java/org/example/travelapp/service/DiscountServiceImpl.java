package org.example.travelapp.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.DiscountDto;
import org.example.travelapp.model.Discount;
import org.example.travelapp.model.Tour;
import org.example.travelapp.repository.DiscountRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl  implements DiscountService{

    private final DiscountRepository discountRepository;
    private final TourRepository tourRepository;

    @Override
    public DiscountDto createDiscount(DiscountDto dto) {
        Discount discount=new Discount();
        discount.setValue(dto.getValue());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());
        discount.setDescription(dto.getDescription());

        Tour tour = tourRepository.findById(dto.getTourId()).orElse(null);

        discount.setTour(tour);
        Discount savedDiscount=discountRepository.save(discount);
        return mapToDto(savedDiscount);
    }

    @Override
    public List<DiscountDto> getAllDiscounts() {
        return discountRepository
                .findAll()
                .stream()
                .map(this :: mapToDto)
                .collect(Collectors.toList());
    }


    @Override
    public DiscountDto getDiscountById(Long id){
        Discount discount=discountRepository.findById(id)
                .orElse(null);
        return mapToDto(discount);
    }

    @Override
    public DiscountDto updateDiscount(Long id, DiscountDto dto) {
        Discount discount=discountRepository.findById(id).orElse(null);

        discount.setValue(dto.getValue());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());
        discount.setDescription(dto.getDescription());
        discount.setTour(tourRepository.findById(dto.getTourId()).orElse(null));

        return mapToDto(discountRepository.save(discount));
    }

    @Override
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }

    private  DiscountDto mapToDto(Discount discount) {
        DiscountDto dto=new DiscountDto();

        dto.setId(discount.getId());
        dto.setValue(discount.getValue());
        dto.setStartDate(discount.getStartDate());
        dto.setEndDate(discount.getEndDate());
        dto.setDescription(discount.getDescription());
        dto.setTourId(discount.getTour().getId());
        return dto;
    }
}
