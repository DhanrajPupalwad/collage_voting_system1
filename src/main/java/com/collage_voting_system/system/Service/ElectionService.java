package com.collage_voting_system.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collage_voting_system.system.entity.Election;
import com.collage_voting_system.system.Repo.ElectionRepo;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepo electionRepo;

    // SET ELECTION
    public Election setElection(Election e) {
        return electionRepo.save(e);
    }

    // GET CURRENT ELECTION
    public Election getElection() {
        return electionRepo.findById(1).orElse(null);
    }
}