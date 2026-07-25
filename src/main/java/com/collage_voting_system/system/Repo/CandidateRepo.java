package com.collage_voting_system.system.Repo;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.collage_voting_system.system.entity.Candidate;;

@Repository
public interface CandidateRepo extends JpaRepository<Candidate, Integer> {

}