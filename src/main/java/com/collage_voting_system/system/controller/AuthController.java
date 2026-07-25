package com.collage_voting_system.system.controller;



import com.collage_voting_system.system.entity.Voter;
import com.collage_voting_system.system.Repo.VoterRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private VoterRepo voterRepo;

    // ✅ REGISTER
    @PostMapping("/register")
    public String register(@RequestBody Voter v) {

        if (voterRepo.existsByEmail(v.getEmail())) {
            return "Email already exists";
        }

        voterRepo.save(v);
        return "Registered Successfully";
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Voter login(@RequestBody Voter v) {

        Voter user = voterRepo.findByEmail(v.getEmail());

        if (user != null && user.getPassword().equals(v.getPassword())) {
            return user;
        }

        return null; // invalid login
    }
}