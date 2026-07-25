package com.collage_voting_system.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.collage_voting_system.system.entity.Admin;
import com.collage_voting_system.system.Repo.AdminRepo;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;

    // ADMIN LOGIN
    public String login(String username, String password) {
        Admin admin = adminRepo.findByUsername(username);

        if (admin != null && admin.getPassword().equals(password)) {
            return "Login Success";
        }
        return "Invalid Admin Credentials";
    }
}