package com.collage_voting_system.system.controller;

import com.collage_voting_system.system.entity.*;
import com.collage_voting_system.system.Repo.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin("*")
public class VoteController {

    @Autowired
    private VoterRepo voterRepo;

    @Autowired
    private CandidateRepo candidateRepo;

    @Autowired
    private Voterepo voteRepo;

    @Autowired
    private ElectionRepo electionRepo;

    @PostMapping("/{voterId}/{candidateId}")
    public String vote(@PathVariable int voterId, @PathVariable int candidateId) {

        // ✅ Get Election (assuming single election)
        Election e = electionRepo.findById(1).orElse(null);

        if (e == null || !e.isActive()) {
            return "Election not started";
        }

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(e.getStartTime())) {
            return "Voting not started yet";
        }

        if (now.isAfter(e.getEndTime())) {
            return "Election ended";
        }

        // ✅ Get Voter
        Voter voter = voterRepo.findById(voterId).orElse(null);

        if (voter == null) {
            return "Voter not found";
        }

        if (voter.isHasVoted()) {
            return "Already voted";
        }

        // ✅ Get Candidate
        Candidate c = candidateRepo.findById(candidateId).orElse(null);

        if (c == null) {
            return "Candidate not found";
        }

        // ✅ Update vote count
        c.setVotes(c.getVotes() + 1);

        // ✅ Mark voter as voted
        voter.setHasVoted(true);

        // ✅ Save vote record
        Vote vote = new Vote();
    
        voteRepo.save(vote);
        voterRepo.save(voter);
        candidateRepo.save(c);

        return "Vote Successful";
    }
}