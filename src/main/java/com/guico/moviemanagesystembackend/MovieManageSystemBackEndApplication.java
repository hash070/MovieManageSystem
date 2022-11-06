package com.guico.moviemanagesystembackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MovieManageSystemBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieManageSystemBackEndApplication.class, args);
        System.out.println(System.getProperty("user.dir"));
    }

}
