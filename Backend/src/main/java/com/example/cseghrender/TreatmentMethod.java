package com.example.cseghrender;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TreatmentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String situation;
    private String methodShared;
    private Long injuredUserId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSituation() {
        return situation;
    }

    public void setSituation(String situation) {
        this.situation = situation;
    }

    public String getMethodShared() {
        return methodShared;
    }

    public void setMethodShared(String methodShared) {
        this.methodShared = methodShared;
    }

    public Long getInjuredUserId() {
        return injuredUserId;
    }

    public void setInjuredUserId(Long injuredUserId) {
        this.injuredUserId = injuredUserId;
    }
}
