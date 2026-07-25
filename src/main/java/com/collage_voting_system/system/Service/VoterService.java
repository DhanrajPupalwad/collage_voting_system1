package com.collage_voting_system.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.collage_voting_system.system.entity.Voter;
import com.collage_voting_system.system.Repo.VoterRepo;

@Service
public class VoterService {

    @Autowired
    private VoterRepo voterRepo;

    // REGISTER
    public String register(Voter v) {
        if (voterRepo.existsByEmail(v.getEmail())) {
            return "Email already exists!";
        }
        voterRepo.save(v);
        return "Registered Successfully!";
    }

    // LOGIN
    public Voter login(String email, String password) {
        Voter user = voterRepo.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // GET ALL VOTERS
    public List<Voter> getAllVoters() {
        return voterRepo.findAll();
    }

    // GET BY ID
    public Voter getVoterById(int id) {
        return voterRepo.findById(id).orElse(null);
    }
}