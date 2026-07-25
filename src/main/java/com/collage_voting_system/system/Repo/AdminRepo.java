package com.collage_voting_system.system.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.collage_voting_system.system.entity.Admin;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Integer> {

    Admin findByUsername(String username);

}