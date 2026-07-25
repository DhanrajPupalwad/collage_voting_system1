package com.collage_voting_system.system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Relationship with Voter
    @ManyToOne
    @JoinColumn(name = "voter_id")
    private Voter voter;

    // Relationship with Candidate
    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;
}