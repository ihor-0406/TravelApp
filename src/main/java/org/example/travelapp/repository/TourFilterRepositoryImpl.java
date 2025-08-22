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
import org.springframework.data.domain.Sort;
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

        List<Predicate> predicates = buildPredicates(filter, cb, root);
        if (!predicates.isEmpty()) {
            cq.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order order : pageable.getSort()) {
                Path<Object> path = root.get(order.getProperty());
                orders.add(order.isAscending() ? cb.asc(path) : cb.desc(path));
            }
            cq.orderBy(orders);
        }

        TypedQuery<Tour> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Tour> content = query.getResultList();


        CriteriaQuery<Long> countCq = cb.createQuery(Long.class);
        Root<Tour> countRoot = countCq.from(Tour.class);
        List<Predicate> countPredicates = buildPredicates(filter, cb, countRoot);
        if (!countPredicates.isEmpty()) {
            countCq.where(cb.and(countPredicates.toArray(new Predicate[0])));
        }
        countCq.select(cb.count(countRoot));

        Long total = entityManager.createQuery(countCq).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }

    private List<Predicate> buildPredicates(TourFilterRequstDto filter, CriteriaBuilder cb, Root<Tour> root) {
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

            Integer max = Collections.max(filter.getMaxPeople());
            predicates.add(cb.le(root.get("maxPeople"), max));
        }
        if (filter.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(filter.getMinPrice())));
        }
        if (filter.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(filter.getMaxPrice())));
        }

        return predicates;
    }
}
