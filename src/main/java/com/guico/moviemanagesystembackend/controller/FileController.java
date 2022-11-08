package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

@Controller
@CrossOrigin
@RequestMapping("/api/file")
public class FileController {
    String path = System.getProperty("user.dir");

    @Autowired
    HttpServletResponse response;

    @RequestMapping("/pic")
    public Result getPic(@RequestParam(value = "url") String url) {
        File file = new File(url);
        if(file.exists()){
            response.setHeader("Content-Disposition", "attachment;filename=" + file.getName());
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Length", String.valueOf(file.length()));
            byte[] buffer = new byte[(int)file.length()];
            FileInputStream fis = null;
            BufferedInputStream bfs = null;
            try {
                fis = new FileInputStream(file);
                bfs = new BufferedInputStream(fis);
                OutputStream os = response.getOutputStream();
                int len = bfs.read(buffer);
                while (len != -1) {
                    os.write(buffer, 0, len);
                    len = bfs.read(buffer);
                }
                response.getOutputStream().write(buffer);
            } catch (Exception e) {
                e.printStackTrace();
                return Result.fail(e.getMessage());
            }
        }
        return Result.ok();
    }

}
