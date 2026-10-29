package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treatments")
@CrossOrigin(origins = "*")
public class TreatmentMethodController {

    @Autowired
    private TreatmentMethodRepository treatmentMethodRepository;

    @Autowired
    private UserRepository userRepository;

    // For Injured users to share their treatment method
    @PostMapping
    public ResponseEntity<String> shareTreatment(@RequestBody TreatmentMethod treatmentMethod, @RequestParam Long userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null || (!"injured".equalsIgnoreCase(user.getRole()) && !"admin".equalsIgnoreCase(user.getRole()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only injured users or admins can share treatment methods");
        }
        treatmentMethod.setInjuredUserId(user.getId());
        treatmentMethodRepository.save(treatmentMethod);
        return ResponseEntity.status(HttpStatus.CREATED).body("Treatment method shared successfully");
    }

    // Getting all the treatments shared by injured users
    @GetMapping
    public List<TreatmentMethod> getAllTreatments() {
        return treatmentMethodRepository.findAll();
    }
}
