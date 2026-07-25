package com.collage_voting_system.system.entity;



import jakarta.persistence.*;

@Entity
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String party;
    private int votes;

    // GETTER SETTER
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getParty() { return party; }
    public void setParty(String party) { this.party = party; }

    public int getVotes() { return votes; }
    public void setVotes(int votes) { this.votes = votes; }
}