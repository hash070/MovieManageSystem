package com.guico.moviemanagesystembackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Controller
@CrossOrigin
@RequestMapping("/api/file")
public class FileController {
    String path = System.getProperty("user.dir");

    @GetMapping("/pic")
    public MultipartFile getPic(@RequestParam(value = "url", required = true) String url) {
        return null;
    }

}
