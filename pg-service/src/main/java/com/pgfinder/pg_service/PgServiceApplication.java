package com.pgfinder.pg_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PgServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PgServiceApplication.class, args);
	}

}
