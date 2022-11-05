package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import com.guico.moviemanagesystembackend.mapper.MovieMapper;
import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class MovieServiceImpl extends ServiceImpl<MovieMapper, Movie> implements IMovieService {

    @Value("${file.upload.path}")
    private String path;

    @Value("${file.upload.movie-type}")
    private String movieType;

    @Value("${file.upload.pic-type}")
    private String[] picType;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result uploadMovie() {
        return null;
    }

    @Override
    public Result addMovie(Movie movie) {
        return null;
    }

    @Override
    public Result getAllMovie() {
        return null;
    }

    @Override
    public Result getMovieByTags(List<Tag> tags) {
        return null;
    }

    @Override
    public Result getMovieByType(Integer typeId) {
        return null;
    }

    @Override
    public Result getMovieByUp(Integer upId) {
        return null;
    }

    @Override
    public Result getMovieBySearch(String search) {
        return null;
    }

    @Override
    public Result deleteMovie(Integer movieId) {
        return null;
    }

    @Override
    public Result updateMovie(Movie movie) {
        return null;
    }

    @Override
    public Result getAllTags() {
        return null;
    }

    @Override
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
//        获取文件名
        String fileName = pic.getOriginalFilename();
//        如果文件为空，返回失败
        if(pic.isEmpty()||fileName==null){
            return Result.fail("上传失败，请选择文件");
        }

//        获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
//        如果文件后缀不在允许的范围内，返回失败
        for(String type:picType){
            if(suffixName.equals(type)){
                return Result.fail("上传失败，文件类型不匹配");
            }
        }
//        创建文件对象
        File file = new File(path+"/pics/"+fileName);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
//        如果文件已存在，返回失败
        if(file.exists()){
            return Result.fail("上传失败，文件已存在");
        }
//        保存文件
        pic.transferTo(file);
        return Result.ok(file.getPath());


    }

    @Override
    public Result uploadMovieFile(MultipartFile movie) throws IOException {
        //        获取文件名
        String fileName = movie.getOriginalFilename();
//        如果文件为空，返回失败
        if(movie.isEmpty()||fileName==null){
            return Result.fail("上传失败，请选择文件");
        }

//        获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        if(!suffixName.equals(movieType)){
            return Result.fail("上传失败，文件类型不匹配");
        }

//        创建文件对象
        File file = new File(path+"/movies/"+fileName);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
//        如果文件已存在，返回失败
        if(file.exists()){
            return Result.fail("上传失败，文件已存在");
        }
//        保存文件
        movie.transferTo(file);
        return Result.ok(file.getPath());


    }
}
