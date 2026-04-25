package com.logiq.backend.service;

import com.logiq.backend.model.DamageTicket;
import com.logiq.backend.repository.DamageTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DamageTicketService {

    private final DamageTicketRepository damageTicketRepository;

    @Value("${upload.path:./uploads/damage}")
    private String uploadDir;

    public DamageTicket createTicket(String orderId, Long productId, Long userId, String description, MultipartFile image) throws IOException {
        String imageUrl = null;
        
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        }

        DamageTicket ticket = DamageTicket.builder()
                .orderId(orderId)
                .productId(productId)
                .userId(userId)
                .description(description)
                .imageUrl(imageUrl)
                .status("QUARANTINED")
                .build();

        log.info("Creating damage ticket for Order: {}, Product: {}. Status set to QUARANTINED.", orderId, productId);
        
        // TODO: Trigger workflow to update Order/Item status in central system
        
        return damageTicketRepository.save(ticket);
    }

    public DamageTicket getTicketById(Long id) {
        return damageTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Damage ticket not found with id: " + id));
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = root.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }
}
