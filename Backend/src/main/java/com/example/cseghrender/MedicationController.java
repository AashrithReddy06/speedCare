package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "*")
public class MedicationController {

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private UserRepository userRepository;

    // For Doctor to post medication
    @PostMapping
    public ResponseEntity<String> addMedication(@RequestBody Medication medication, @RequestParam Long userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null || !"doctor".equalsIgnoreCase(user.getRole()) && !"admin".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only doctors or admins can post medications");
        }
        medication.setDoctorUserId(user.getId());
        medicationRepository.save(medication);
        return ResponseEntity.status(HttpStatus.CREATED).body("Medication added successfully");
    }

    // For Pedestrian to search medication by situation
    @GetMapping("/search")
    public List<Medication> searchMedication(@RequestParam String situation) {
        return medicationRepository.findBySituationContainingIgnoreCase(situation);
    }
    
    // Get all medications
    @GetMapping
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }
}
