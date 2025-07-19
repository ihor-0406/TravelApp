package org.example.travelapp.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TourFilterRepositoryImpl implements TourFilterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Tour> filterTours(TourFilterRequstDto filter, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<Tour> cq = cb.createQuery(Tour.class);
        Root<Tour> root = cq.from(Tour.class);
        List<Predicate> predicates = new ArrayList<>();

        if (filter.getLocations() != null && !filter.getLocations().isEmpty()) {
            predicates.add(root.get("location").in(filter.getLocations()));
        }
        if (filter.getTypes() != null && !filter.getTypes().isEmpty()) {
            predicates.add(root.get("type").in(filter.getTypes()));
        }
        if (filter.getDifficulty() != null && !filter.getDifficulty().isEmpty()) {
            predicates.add(root.get("difficulty").in(filter.getDifficulty()));
        }
        if (filter.getAvailability() != null && !filter.getAvailability().isEmpty()) {
            predicates.add(root.get("availability").in(filter.getAvailability()));
        }
        if (filter.getMaxPeople() != null && !filter.getMaxPeople().isEmpty()) {
            predicates.add(cb.le(root.get("maxPeople"), Collections.max(filter.getMaxPeople())));
        }
        if (filter.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(filter.getMinPrice())));
        }
        if (filter.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(filter.getMaxPrice())));
        }

        cq.where(cb.and(predicates.toArray(new Predicate[0])));

        if (filter.getSortBy() != null) {
            switch (filter.getSortBy()) {
                case "priceAsc" -> cq.orderBy(cb.asc(root.get("price")));
                case "priceDesc" -> cq.orderBy(cb.desc(root.get("price")));
                case "alphaAsc" -> cq.orderBy(cb.asc(root.get("title")));
                case "alphaDesc" -> cq.orderBy(cb.desc(root.get("title")));
            }
        }

        TypedQuery<Tour> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Tour> result = query.getResultList();


        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Tour> countRoot = countQuery.from(Tour.class);
        List<Predicate> countPredicates = new ArrayList<>();

        if (filter.getLocations() != null && !filter.getLocations().isEmpty()) {
            countPredicates.add(countRoot.get("location").in(filter.getLocations()));
        }
        if (filter.getTypes() != null && !filter.getTypes().isEmpty()) {
            countPredicates.add(countRoot.get("type").in(filter.getTypes()));
        }
        if (filter.getDifficulty() != null && !filter.getDifficulty().isEmpty()) {
            countPredicates.add(countRoot.get("difficulty").in(filter.getDifficulty()));
        }
        if (filter.getAvailability() != null && !filter.getAvailability().isEmpty()) {
            countPredicates.add(countRoot.get("availability").in(filter.getAvailability()));
        }
        if (filter.getMaxPeople() != null && !filter.getMaxPeople().isEmpty()) {
            countPredicates.add(cb.le(countRoot.get("maxPeople"), Collections.max(filter.getMaxPeople())));
        }
        if (filter.getMinPrice() != null) {
            countPredicates.add(cb.greaterThanOrEqualTo(countRoot.get("price"), BigDecimal.valueOf(filter.getMinPrice())));
        }
        if (filter.getMaxPrice() != null) {
            countPredicates.add(cb.lessThanOrEqualTo(countRoot.get("price"), BigDecimal.valueOf(filter.getMaxPrice())));
        }

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(result, pageable, total);
    }
}
