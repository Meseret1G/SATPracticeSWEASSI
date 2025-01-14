package com.example.satPractice.util;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class EmailUtil {

    private static final Logger logger = LoggerFactory.getLogger(EmailUtil.class);

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpEmail(String email, String otp) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("Verify Your Account");
            mimeMessageHelper.setText(
                    """
                    <div style="font-family: Arial, sans-serif; text-align: center; margin: 20px;">
                    <h2>Your OTP Code</h2>
                    <p style="font-size: 24px; font-weight: bold; color: #333;">%s</p>
                    <p>Please use this code to verify your account. The code is valid for a limited time.</p>
                    </div>""".formatted(otp), true
            );
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Error sending OTP email to {}: {}", email, e.getMessage());
            throw e;
        }
    }
}
