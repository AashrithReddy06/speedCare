package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminDataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seeding admin if it doesn't exist
        if (userRepository.findByEmail("ash@gmail.com") == null) {
            Users admin = new Users();
            admin.setUsername("ash");
            admin.setEmail("ash@gmail.com");
            admin.setPassword("ash87");
            admin.setRole("admin");
            userRepository.save(admin);
            System.out.println("Admin user seeded with email ash@gmail.com.");
        }

        // Deleting users without roles: ash87, hmm
        String[] targetUsers = {"ash87", "hmm"};
        for (String username : targetUsers) {
            java.util.List<Users> users = userRepository.findByUsername(username);
            for (Users u : users) {
                if (u.getRole() == null || u.getRole().trim().isEmpty()) {
                    userRepository.delete(u);
                    System.out.println("Deleted user without role: " + username + " (ID: " + u.getId() + ")");
                }
            }
        }
    }
}
