package com.collage_voting_system.system.controller;

import com.collage_voting_system.system.entity.Admin;
import com.collage_voting_system.system.entity.Candidate;
import com.collage_voting_system.system.entity.Election;
import com.collage_voting_system.system.Repo.AdminRepo;
import com.collage_voting_system.system.Repo.CandidateRepo;
import com.collage_voting_system.system.Repo.ElectionRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private CandidateRepo candidateRepo;

    @Autowired
    private ElectionRepo electionRepo;

    @PostMapping("/login")
    public String login(@RequestBody Admin a) {
        Admin admin = adminRepo.findByUsername(a.getUsername());
        if (admin != null && admin.getPassword().equals(a.getPassword())) {
            return "Login Success";
        }
        return "Invalid Username or Password";
    }

    @PostMapping("/setElection")
    public Election setElection(@RequestBody Election e) {
        e.setActive(true);
        return electionRepo.save(e);
    }

    @PostMapping("/addCandidate")
    public Candidate addCandidate(@RequestBody Candidate c) {
        return candidateRepo.save(c);
    }

    @GetMapping("/results")
    public List<Candidate> results() {
        return candidateRepo.findAll();
    }
@DeleteMapping("/delete/{id}")
public String deleteCandidate(@PathVariable int id){
    candidateRepo.deleteById(id);
    return "Deleted";
}

@PutMapping("/update/{id}")
public Candidate update(@PathVariable int id, @RequestBody Candidate c){
    c.setId(id);
    return candidateRepo.save(c);
}
@GetMapping("/candidates")
public List<Candidate> getCandidates(){
    return candidateRepo.findAll();
}


}