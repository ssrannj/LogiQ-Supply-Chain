package com.logiq.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@logiq-sc.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendStatusUpdateEmail(String to, Long orderId, String status) {
        String subject = "Order #" + orderId + " Status Update";
        String body = "Hello,\n\nYour order #" + orderId + " is now " + status + ".\n\nThank you for shopping with LogiQ!";
        sendEmail(to, subject, body);
    }

    public void sendRejectionEmail(String to, Long orderId, String reason) {
        String subject = "Order #" + orderId + " Payment Rejected";
        String body = "Hello,\n\nUnfortunately, your payment for order #" + orderId + " was rejected.\nReason: " + reason + "\n\nPlease reach out if you have any questions.";
        sendEmail(to, subject, body);
    }
}
