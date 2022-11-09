package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

@RestController
@CrossOrigin
@RequestMapping("/api/movie")
@Slf4j
public class MovieController {
    @Autowired
    IMovieService movieService;

    @Autowired
    HttpServletResponse response;

    @Autowired
    HttpServletRequest request;

    String path = System.getProperty("user.dir")+ "/upload";

    @PostMapping("/upload")
    public Result uploadMovie(String name, String des, Integer typeId, String tags,
                              Boolean visibility, String pic, String movie) throws IOException {
        return movieService.upload(name, des, typeId, tags, visibility, pic, movie);
    }

    @PostMapping("/getById")
    public Result getMovieById(Integer id) {
        return movieService.getMovieById(id);
    }

    @PostMapping("/getBySearch")
    public Result getMovieBySearch(String search) {
        return movieService.getMovieBySearch(search);
    }

    @PostMapping("/getByUp")
    public Result getMovieByUp(String upId) {
        return movieService.getMovieByUp(upId);
    }

    @PostMapping("/getByType")
    public Result getMovieByType(Integer typeId) {
        return movieService.getMovieByType(typeId);
    }

    @PostMapping("/getAll")
    public Result getAll() {
        return movieService.getAll();
    }

    @PostMapping("/delete")
    public Result deleteMovie(Integer movieId) {
        return movieService.deleteMovie(movieId);
    }

    @PostMapping("/update")
    public Result updateMovieMsg(Long id, String name, String des, Integer typeId, String tags,
                                 Boolean visibility, String pic) throws IOException {
        return movieService.updateMovieMsg(id, name, des, typeId, tags, visibility, pic);
    }

    @PostMapping("/uploadMovie")
    public Result uploadMovie(MultipartFile movie) throws IOException {
        return movieService.uploadMovie(movie);
    }

    @PostMapping("/uploadPic")
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
        return Result.ok(movieService.uploadMoviePic(pic));
    }


    @PostMapping("/getAllPublic")
    public Result getAllPublicMovie() {
        return movieService.getAllPublicMovie();
    }

    @RequestMapping("/getFile")
    public ResponseEntity<byte[]> getFile(String url) {
        url = path + url;
//        将url中的/替换为\
        url = url.replace("/", "\\");
        if(System.getProperty("os.name").equalsIgnoreCase("linux")) {
            url = url.replace("\\", "/");
        }
        File file = new File(url);
        log.info(url);
        if (file.exists()) {
            try {
                log.info("文件存在,开始下载");
                log.info("文件路径为:{}", url);
                byte[] bytes = Files.readAllBytes(file.toPath());
                HttpHeaders headers = new HttpHeaders();
                headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
                headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
                headers.add("Pragma", "no-cache");
                headers.add("Expires", "0");
//                如果后缀为mp4则设置为视频格式
                if (url.endsWith(".mp4")) {
//                    从0开始表示全下载，1表示从某字节开始下载，2表示从某字节开始下载到某字节结束
                    int rangeSwitch = 0;
                    long p = 0L;
                    long toLength = 0;
                    long contentLength = 0;
                    String rangeBytes = "";
                    long fileLength = file.length();

                    InputStream ins = new FileInputStream(file);
                    BufferedInputStream bis = new BufferedInputStream(ins);



                    String range = request.getHeader("Range");
                    headers.add("accept-ranges", "bytes");
                    headers.add("Content-Range", String.valueOf(range+file.length()));
                    response.setContentLength((int) file.length());
                    if(range!=null && range.trim().length()>0 && !"null".equals(range)) {
                        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
                        rangeBytes = range.replaceAll("bytes=", "");
                        if(rangeBytes.endsWith("-")) {
                            rangeSwitch = 1;
                            p = Long.parseLong(rangeBytes.substring(0, rangeBytes.indexOf("-")));
                            contentLength = fileLength - p;
                        } else {
                            rangeSwitch = 2;
                            String temp1 = rangeBytes.substring(0, rangeBytes.indexOf("-"));
                            String temp2 = rangeBytes.substring(rangeBytes.indexOf("-") + 1, rangeBytes.length());
                            p = Long.parseLong(temp1);
                            toLength = Long.parseLong(temp2);
                            contentLength = toLength - p + 1;
                        }
                    } else {
                        contentLength = fileLength;
                    }
                    response.setHeader("Content-Length", String.valueOf(contentLength));
                    if(rangeSwitch==1){
                        String contentRange = new StringBuffer("bytes ")
                                .append(new Long(p).toString()).
                                append("-").
                                append(new Long(fileLength - 1).toString()).
                                append("/").
                                append(new Long(fileLength).toString()).toString();
                        response.setHeader("Content-Range", contentRange);
                        bis.skip(p);
                    } else {
                        String contentRange = new StringBuffer("bytes ")
                                .append(new Long(p).toString()).
                                append("-").
                                append(new Long(toLength).toString()).
                                append("/").
                                append(new Long(fileLength).toString()).toString();
                        response.setHeader("Content-Range", contentRange);
                    }
                    String fileName = file.getName();
                    response.setContentType("application/octet-stream");
                    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

                    OutputStream out = response.getOutputStream();
                    int n = 0;
                    long readLength = 0;
                    int bsize = 1024;
                    byte[] bytes1 = new byte[bsize];
                    if(rangeSwitch==2) {
                        while (readLength <= contentLength - bsize) {
                            n = bis.read(bytes1);
                            readLength += n;
                            out.write(bytes1, 0, n);
                        }
                        if(readLength <= contentLength) {
                            n = bis.read(bytes1, 0, (int) (contentLength - readLength));
                            out.write(bytes1, 0, n);
                        }
                    } else {
                        while ((n = bis.read(bytes1)) != -1) {
                            out.write(bytes1, 0, n);
                        }
                    }
                    out.flush();
                    out.close();
                    bis.close();

                }
                ResponseEntity<byte[]> responseEntity = ResponseEntity
                        .ok()
                        .headers(headers)
                        .contentLength(file.length())
                        .body(bytes);
                return responseEntity;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        log.error("文件不存在");
        response.setStatus(404);
        return null;
    }





}
