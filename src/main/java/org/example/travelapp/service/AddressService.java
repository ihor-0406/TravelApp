package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Address;
import org.example.travelapp.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Transactional(readOnly = true)
    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Address> findById(long id) {
        return addressRepository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }
}
