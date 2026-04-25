package com.logiq.backend.config;

import com.logiq.backend.model.Category;
import com.logiq.backend.model.Product;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData(com.logiq.backend.repository.OrderPaymentRepository orderPaymentRepository) {
        return args -> {
            // Seed Users for demo
            if (userRepository.count() == 0) {
                com.logiq.backend.model.User admin = new com.logiq.backend.model.User();
                admin.setFullName("Sanjeev PM");
                admin.setEmail("admin@msr.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(com.logiq.backend.model.UserRole.ADMIN);
                userRepository.save(admin);

                com.logiq.backend.model.User customer = new com.logiq.backend.model.User();
                customer.setFullName("John Doe");
                customer.setEmail("customer@example.com");
                customer.setPassword(passwordEncoder.encode("customer123"));
                customer.setRole(com.logiq.backend.model.UserRole.CUSTOMER);
                userRepository.save(customer);

                System.out.println("Seeded admin and customer users.");
            }

            // Seed Dummy Orders for demo display
            if (orderPaymentRepository.count() == 0) {
                orderPaymentRepository.save(com.logiq.backend.model.OrderPayment.builder()
                        .orderId("ORD-5542")
                        .productId(1L)
                        .amount(java.math.BigDecimal.valueOf(899.99))
                        .fileName("slip_5542.jpg")
                        .fileType("image/jpeg")
                        .status(com.logiq.backend.model.PaymentStatus.VERIFYING_ORDER)
                        .driverName("Aqqil")
                        .uploadTime(java.time.LocalDateTime.now().minusHours(2))
                        .build());

                orderPaymentRepository.save(com.logiq.backend.model.OrderPayment.builder()
                        .orderId("ORD-9821")
                        .productId(5L)
                        .amount(java.math.BigDecimal.valueOf(650.00))
                        .fileName("slip_9821.jpg")
                        .fileType("image/jpeg")
                        .status(com.logiq.backend.model.PaymentStatus.PROCESSING)
                        .driverName("Sanjeev")
                        .uploadTime(java.time.LocalDateTime.now().minusDays(1))
                        .build());

                orderPaymentRepository.save(com.logiq.backend.model.OrderPayment.builder()
                        .orderId("ORD-1024")
                        .productId(2L)
                        .amount(java.math.BigDecimal.valueOf(1200.00))
                        .status(com.logiq.backend.model.PaymentStatus.PROCESSING)
                        .driverName("Aqqil")
                        .uploadTime(java.time.LocalDateTime.now().minusHours(5))
                        .build());

                System.out.println("Seeded 2 dummy orders for demo.");
            }

            if (productRepository.count() == 0) {
                List<Product> products = Arrays.asList(
                    // SOFAS
                    createProduct("Luxury Velvet Sofa", "Elegant 3-seater sofa with velvet finish", 899.99, "sofa1.jpg", Category.SOFA, 24),
                    createProduct("Modern Leather Couch", "Sleek black leather sofa for modern living rooms", 1200.00, "sofa2.jpg", Category.SOFA, 36),
                    createProduct("Corner Fabric Sectional", "Spacious L-shaped sofa with grey fabric", 750.50, "sofa3.jpg", Category.SOFA, 12),
                    createProduct("Classic Chesterfield", "Vintage tufted leather sofa", 1500.00, "sofa4.jpg", Category.SOFA, 24),
                    
                    // BEDS
                    createProduct("King Size Oak Bed", "Solid oak wood bed frame with headboard", 650.00, "bed1.jpg", Category.BED, 60),
                    createProduct("Queen Platform Bed", "Minimalist platform bed with metal frame", 350.99, "bed2.jpg", Category.BED, 24),
                    createProduct("Upholstered Storage Bed", "Bed with built-in drawers and fabric headboard", 550.00, "bed3.jpg", Category.BED, 12),
                    createProduct("Single Guest Bed", "Foldable single bed for guests", 120.00, "bed4.jpg", Category.BED, 6),
                    
                    // TABLES
                    createProduct("Dining Room Oak Table", "Large dining table for 8 people", 450.00, "table1.jpg", Category.TABLE, 24),
                    createProduct("Glass Coffee Table", "Modern glass top table with wooden legs", 150.00, "table2.jpg", Category.TABLE, 12),
                    createProduct("Study Desk", "Ergonomic desk for home office", 220.00, "table3.jpg", Category.TABLE, 24),
                    createProduct("Round Marble Table", "Luxury marble top side table", 300.00, "table4.jpg", Category.TABLE, 36),
                    
                    // CHAIRS
                    createProduct("Ergonomic Office Chair", "Adjustable chair with lumbar support", 180.00, "chair1.jpg", Category.CHAIR, 24),
                    createProduct("Velvet Dining Chair", "Set of 2 elegant dining chairs", 120.00, "chair2.jpg", Category.CHAIR, 12),
                    createProduct("Leather Recliner", "Comfortable recliner with footrest", 250.00, "chair3.jpg", Category.CHAIR, 24),
                    createProduct("Wooden Accent Chair", "Traditional wooden chair with cushion", 90.00, "chair4.jpg", Category.CHAIR, 12),
                    
                    // CUPBOARDS
                    createProduct("Wooden Wardrobe", "3-door wardrobe with mirror", 400.00, "cupboard1.jpg", Category.CUPBOARD, 36),
                    createProduct("Slim Kitchen Cabinet", "Space-saving cabinet for kitchen", 150.00, "cupboard2.jpg", Category.CUPBOARD, 12),
                    createProduct("Modern Bookshelf", "Open shelf cupboard for books and decor", 200.00, "cupboard3.jpg", Category.CUPBOARD, 24),
                    createProduct("Sideboard Buffet", "Elegant sideboard for dining room storage", 320.00, "cupboard4.jpg", Category.CUPBOARD, 24)
                );
                productRepository.saveAll(products);
                System.out.println("Seeded 20 furniture products into the database.");
            }
        };
    }

    private Product createProduct(String name, String desc, double price, String img, Category cat, int warranty) {
        return Product.builder()
                .name(name)
                .description(desc)
                .price(BigDecimal.valueOf(price))
                .imageUrl(img)
                .category(cat)
                .inStock(true)
                .warrantyPeriodMonths(warranty)
                .build();
    }
}
