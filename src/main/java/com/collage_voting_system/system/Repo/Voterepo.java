package com.collage_voting_system.system.Repo;

import  com.collage_voting_system.system.entity.Vote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface Voterepo extends JpaRepository<Vote, Integer> {

}