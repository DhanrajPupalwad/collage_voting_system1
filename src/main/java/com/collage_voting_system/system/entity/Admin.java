package com.collage_voting_system.system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admin")
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;
}