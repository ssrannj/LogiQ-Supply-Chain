package com.logiq.backend.service;

import com.logiq.backend.dto.WishlistResponse;
import com.logiq.backend.model.Product;
import com.logiq.backend.model.User;
import com.logiq.backend.model.WishlistItem;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<WishlistResponse> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            throw new RuntimeException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        
        wishlistRepository.save(item);
    }

    @org.springframework.transaction.annotation.Transactional
    public void removeFromWishlist(User user, Long id) {
        WishlistItem item = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to remove this item");
        }

        wishlistRepository.delete(item);
    }

    private WishlistResponse mapToResponse(WishlistItem item) {
        Product p = item.getProduct();
        WishlistResponse response = new WishlistResponse();
        response.setId(item.getId());
        response.setProductId(p.getId());
        response.setProductName(p.getName());
        response.setProductDescription(p.getDescription());
        response.setPrice(p.getPrice());
        response.setImageUrl(p.getImageUrl());
        response.setCategory(p.getCategory());
        response.setInStock(p.isInStock());
        return response;
    }
}
