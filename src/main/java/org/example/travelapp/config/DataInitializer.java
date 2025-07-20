package org.example.travelapp.config;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.*;
import org.example.travelapp.repository.AccountRepository;
import org.example.travelapp.repository.TourRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final AccountRepository accountRepository;
    private final TourRepository tourRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public CommandLineRunner initData() {
        return args -> {
            // ----------- Admin ----------
            String adminEmail = "admin@admin.com";
            Account admin = accountRepository.findByEmail(adminEmail).orElseGet(() -> {
                Account newAdmin = new Account();
                newAdmin.setEmail(adminEmail);
                newAdmin.setPasswordHash(passwordEncoder.encode("Admin123!"));
                newAdmin.setFirstName("Admin");
                newAdmin.setLastName("User");
                newAdmin.setRole(Role.ADMIN);
                newAdmin.setDateOfBirth(LocalDate.of(1990, 1, 1));
                newAdmin.setRegistrationDate(LocalDate.now());
                return accountRepository.save(newAdmin);
            });

            // ----------- User ----------

            String userEmail = "user@user.com";
            Account user = accountRepository.findByEmail(userEmail).orElseGet(() -> {
                Account newUser = new Account();
                newUser.setEmail(userEmail);
                newUser.setPasswordHash(passwordEncoder.encode("User123!"));
                newUser.setFirstName("Regular");
                newUser.setLastName("User");
                newUser.setRole(Role.USER);
                newUser.setDateOfBirth(LocalDate.of(1997, 5, 20));
                newUser.setRegistrationDate(LocalDate.now());
                return accountRepository.save(newUser);
            });


            // ----------- Tours ----------
            if (tourRepository.count() == 0) {
                List<Tour> tours = List.of(
                        createTourWithAlbum("Golden Circle Adventure",
                                "Explore Iceland’s iconic Golden Circle including Thingvellir National Park, the majestic Gullfoss waterfall, and the erupting geysers of Geysir geothermal area. This full-day tour offers stunning landscapes, cultural landmarks, and the rich history of the island. Ideal for nature lovers and first-time visitors.",
                                "Reykjavík", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825885/Golden_Circle_Adventure_zyvb9k.jpg",
                                BigDecimal.valueOf(120), 30, "8 hours", Difficulty.EASY, Availability.YEAR_ROUND,
                                4.8, TourType.NATURAL, admin),

                        createTourWithAlbum("Northern Lights Midnight Tour",
                                "Join us on a magical evening hunt for the Northern Lights. Drive into the dark countryside far away from city lights, where the aurora borealis is most visible. Our guides use advanced tracking systems and meteorological data to increase the chances of seeing this natural wonder.",
                                "Vik", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825893/Northern_Lights_Midnight_Tour_qtwojk.avif",
                                BigDecimal.valueOf(95), 20, "4 hours", Difficulty.EASY, Availability.WINTER,
                                4.7, TourType.ADVENTURE, admin),

                        createTourWithAlbum("Glacier Hike on Sólheimajökull",
                                "Experience the thrill of walking on ice with crampons and an ice axe! Explore the deep crevasses and dramatic ice formations of the Sólheimajökull glacier under the guidance of certified glacier guides. A must-do adventure for outdoor enthusiasts.",
                                "Vik", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825892/Glacier_Hike_on_S%C3%B3lheimaj%C3%B6kull_now8o0.jpg",
                                BigDecimal.valueOf(140), 15, "5 hours", Difficulty.MEDIUM, Availability.SUMMER,
                                4.9, TourType.EXTREME, admin),

                        createTourWithAlbum("Blue Lagoon Spa Experience",
                                "Relax in the warm, mineral-rich waters of the world-famous Blue Lagoon. Perfect after a long flight or a full day of exploring. Includes admission, a silica mud mask, towel, and a complimentary drink from the swim-up bar.",
                                "Snæfellsnes", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825894/chris-lawton-rH810coWgTI-unsplash1_pq4qdj.jpg",
                                BigDecimal.valueOf(110), 40, "3 hours", Difficulty.EASY, Availability.YEAR_ROUND,
                                4.6, TourType.BEACH, admin),

                        createTourWithAlbum("Volcano and Lava Cave Expedition",
                                "Venture inside an ancient lava tube formed thousands of years ago by flowing magma. Equipped with helmets and headlamps, you’ll explore colorful rock formations, lava stalactites, and the fascinating geology of Iceland's underground world.",
                                "Akureyri", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825902/Volcano_and_Lava_Cave_Expedition_t8g5jd.jpg",
                                BigDecimal.valueOf(130), 25, "4 hours", Difficulty.MEDIUM, Availability.SPRING,
                                4.5, TourType.ADVENTURE, admin),

                        createTourWithAlbum("Icelandic Horseback Riding Tour",
                                "Enjoy a gentle ride through lava fields and scenic countryside on the unique Icelandic horse – a breed known for its smooth gait and friendly temperament. Suitable for both beginners and experienced riders.",
                                "Reykjavík", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825905/Icelandic_Horseback_Riding_Tour_gr3z9z.jpg",
                                BigDecimal.valueOf(85), 10, "2.5 hours", Difficulty.EASY, Availability.SUMMER,
                                4.9, TourType.FAMILY, admin),

                        createTourWithAlbum("Whale Watching from Húsavík",
                                "Embark on a boat tour from the whale capital of Iceland to observe humpback whales, dolphins, and even blue whales in their natural environment. The tour includes marine expert guidance and thermal overalls for comfort.",
                                "Húsavík", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825905/Whale_Watching_from_H%C3%BAsav%C3%ADk_mbjmbe.jpg",
                                BigDecimal.valueOf(105), 50, "3 hours", Difficulty.EASY, Availability.SUMMER,
                                4.8, TourType.NATURAL, admin),

                        createTourWithAlbum("Landmannalaugar Super Jeep Tour",
                                "Explore Iceland’s remote highlands with a powerful Super Jeep. Witness multicolored rhyolite mountains, volcanic deserts, and natural hot springs. Perfect for adventurous souls looking for off-the-beaten-path beauty.",
                                "Akureyri", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825896/Landmannalaugar_Super_Jeep_Tour_l4aov2.jpg",
                                BigDecimal.valueOf(160), 10, "9 hours", Difficulty.HARD, Availability.SUMMER,
                                4.7, TourType.EXTREME, admin),

                        createTourWithAlbum("Snorkeling in Silfra Fissure",
                                "Float between two tectonic plates in crystal-clear glacial water. Silfra is one of the world’s top dive sites thanks to its visibility and geological uniqueness. Dry suit and certified guide included.",
                                "Reykjavík", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825893/Snorkeling_in_Silfra_Fissure_hoa1ny.jpg",
                                BigDecimal.valueOf(155), 12, "3 hours", Difficulty.MEDIUM, Availability.SUMMER,
                                5.0, TourType.EXTREME, admin),

                        createTourWithAlbum("Puffin Watching Boat Tour",
                                "Sail close to rocky coastal cliffs to see thousands of puffins nesting during the summer season. Learn about their behavior and habitat from local experts while enjoying a scenic cruise.",
                                "Snæfellsnes", "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825894/Puffin_Watching_Boat_Tour_i5ngyc.jpg",
                                BigDecimal.valueOf(75), 35, "2 hours", Difficulty.EASY, Availability.SUMMER,
                                4.6, TourType.CULTURAL, admin)
                );

                tourRepository.saveAll(tours);
            };

        };
    }

private Tour createTourWithAlbum(String title, String description, String location, String imageUrl,
                                 BigDecimal price, int maxPeople, String duration,
                                 Difficulty difficulty, Availability availability,
                                 double rating, TourType type, Account creator) {

    Tour tour = new Tour();
    tour.setTitle(title);
    tour.setDescription(description);
    tour.setLocation(location);
    tour.setImageUrl(imageUrl);
    tour.setPrice(price);
    tour.setMaxPeople(maxPeople);
    tour.setDuration(duration);
    tour.setDifficulty(difficulty);
    tour.setAvailability(availability);
    tour.setAverageRating(rating);
    tour.setType(type);
    tour.setCreatedBy(creator);

    List<TourImage> album = new ArrayList<>();

    switch (title) {
        case "Golden Circle Adventure" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Northern Lights Midnight Tour" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Glacier Hike on Sólheimajökull" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Blue Lagoon Spa Experience" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Volcano and Lava Cave Expedition" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Icelandic Horseback Riding Tour" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Whale Watching from Húsavík" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Landmannalaugar Super Jeep Tour" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Snorkeling in Silfra Fissure" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        case "Puffin Watching Boat Tour" -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826424/a2_lh2mtf.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826435/a3_mcmsxj.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a4_utxr7u.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826438/a1_gnedfy.jpg", tour));
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752826440/a5_jscyha.jpg", tour));

        }
        default -> {
            album.add(new TourImage(null, "https://res.cloudinary.com/dosi8fdjm/image/upload/v1752825885/Golden_Circle_Adventure_zyvb9k.jpg", tour));
        }
    }

    tour.setAlbum(album);

    return tour;
}


}
