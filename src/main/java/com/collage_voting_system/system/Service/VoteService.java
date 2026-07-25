package com.collage_voting_system.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import com.collage_voting_system.system.entity.*;
import com.collage_voting_system.system.Repo.*;

@Service
public class VoteService {

    @Autowired private VoterRepo voterRepo;
    @Autowired private CandidateRepo candidateRepo;
    @Autowired private Voterepo voteRepo;
    @Autowired private ElectionRepo electionRepo;

    public String castVote(int voterId, int candidateId) {

        Election e = electionRepo.findById(1).orElse(null);

        // ❌ No election
        if (e == null || !e.isActive()) {
            return "Election not started!";
        }

        // ❌ Before start
        if (LocalDateTime.now().isBefore(e.getStartTime())) {
            return "Voting not started!";
        }

        // ❌ After end
        if (LocalDateTime.now().isAfter(e.getEndTime())) {
            return "Voting ended!";
        }

        Voter voter = voterRepo.findById(voterId).orElse(null);

        // ❌ Already voted
        if (voter.isHasVoted()) {
            return "You already voted!";
        }

        Candidate c = candidateRepo.findById(candidateId).orElse(null);
        c.setVotes(c.getVotes() + 1);

        voter.setHasVoted(true);

        Vote vote = new Vote();
       
        voteRepo.save(vote);
        voterRepo.save(voter);
        candidateRepo.save(c);

        return "Vote Successful!";
    }
}