package com.collage_voting_system.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.collage_voting_system.system.entity.Candidate;
import com.collage_voting_system.system.Repo.CandidateRepo;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepo candidateRepo;

    // ADD CANDIDATE
    public Candidate addCandidate(Candidate c) {
        return candidateRepo.save(c);
    }

    // GET ALL CANDIDATES
    public List<Candidate> getAllCandidates() {
        return candidateRepo.findAll();
    }
}