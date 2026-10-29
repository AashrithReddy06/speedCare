package com.example.cseghrender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MedicationDataSeeder implements CommandLineRunner {

    @Autowired
    private MedicationRepository medicationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (medicationRepository.count() == 0) {
            // Seeding some common tablets/medicines for emergency situations
            
            saveMedication("Heart Attack", "Aspirin (325mg) - Chew one tablet immediately to help thin the blood.");
            saveMedication("Pain Relief / Fever", "Paracetamol (500mg) - Take 1-2 tablets for pain or fever. Do not exceed 8 tablets in 24 hours.");
            saveMedication("Allergy / Anaphylaxis", "Antihistamine (e.g., Cetirizine 10mg) or EpiPen if severe swelling occurs.");
            saveMedication("Acid Reflux / Heartburn", "Antacid (e.g., Digene or Gelusil) - Chew 1-2 tablets after meals.");
            saveMedication("Muscle Pain / Inflammation", "Ibuprofen (400mg) - Take 1 tablet after food as an anti-inflammatory.");
            saveMedication("Diarrhea", "Loperamide (2mg) - Take 2 capsules initially, then 1 after each loose stool.");
            saveMedication("Common Cold / Flu", "Cough Syrup (e.g., Benadryl) or Vicks Vaporub for congestion.");
            saveMedication("Wound Disinfection", "Betadine solution or Savlon for cleaning minor cuts.");
            
            System.out.println("Common medications seeded successfully.");
        }
    }

    private void saveMedication(String situation, String details) {
        Medication med = new Medication();
        med.setSituation(situation);
        med.setMedicationDetails(details);
        med.setDoctorUserId(1L); // Assigning to admin for seeding
        medicationRepository.save(med);
    }
}
