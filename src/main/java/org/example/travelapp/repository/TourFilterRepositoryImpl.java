package org.example.travelapp.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.dto.TourFilterRequstDto;
import org.example.travelapp.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TourFilterRepositoryImpl implements TourFilterRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public Page<Tour> filterTours(TourFilterRequstDto request, Pageable pageable) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        CriteriaQuery<Tour> query = cb.createQuery(Tour.class);
        Root<Tour> tour = query.from(Tour.class);

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Tour> tourRoot = query.from(Tour.class);

        List<Predicate> predicates = new ArrayList<>();

        if(request.getKeyword() != null && !request.getKeyword().isBlank()) {
            predicates.add(cb.like(cb.lower(tour.get("title")), "%" + request.getKeyword().toLowerCase() + "%"));
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            predicates.add(cb.like(cb.lower(tour.get("location")), "%" + request.getLocation().toLowerCase() + "%"));
        }
        if(request.getMinPrice() != null){
            predicates.add(cb.greaterThanOrEqualTo(tour.get("minPrice"), request.getMinPrice()));
        }
        if(request.getMaxPrice() != null){
            predicates.add(cb.lessThanOrEqualTo(tour.get("maxPrice"), request.getMaxPrice()));
        }
        if(request.getDuration() != null){
            predicates.add(cb.greaterThanOrEqualTo(tour.get("duration"), request.getDuration()));
        }
        if(request.getDifficulty() != null){
            predicates.add(cb.equal(tour.get("difficulty"), request.getDifficulty()));
        }
        if(request.getAvailability() != null){
            predicates.add(cb.equal(tour.get("availability"), request.getAvailability()));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));
        countQuery.select(cb.count(tourRoot)).where(cb.and(predicates.toArray(new Predicate[0])));

        List<Tour> resultList = em.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
        Long count = em.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(resultList, pageable, count);

    }
}
