package com.collage_voting_system.system.Repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.collage_voting_system.system.entity.Voter;;

@Repository
public interface VoterRepo extends JpaRepository<Voter, Integer> {

    Voter findByEmail(String email);

    boolean existsByEmail(String email);

}
