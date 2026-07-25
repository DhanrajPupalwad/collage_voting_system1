package com.collage_voting_system.system;

import com.collage_voting_system.system.Repo.AdminRepo;
import com.collage_voting_system.system.entity.Admin;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(SystemApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDefaultAdmin(AdminRepo adminRepo) {
		return args -> {
			if (adminRepo.findByUsername("admin") == null) {
				Admin admin = new Admin();
				admin.setUsername("admin");
				admin.setPassword("admin123");
				adminRepo.save(admin);
			}
		};
	}
}
