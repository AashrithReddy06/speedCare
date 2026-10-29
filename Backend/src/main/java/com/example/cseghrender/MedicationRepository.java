package com.example.cseghrender;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findBySituationContainingIgnoreCase(String situation);
}
