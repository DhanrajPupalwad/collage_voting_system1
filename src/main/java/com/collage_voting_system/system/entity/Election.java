package com.collage_voting_system.system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;   // ✅ ADD THIS IMPORT

@Entity
@Data
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean isActive;
}