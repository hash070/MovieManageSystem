package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import com.guico.moviemanagesystembackend.interceptor.InterceptorUtil;
import com.guico.moviemanagesystembackend.mapper.MovieMapper;
import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
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

    @Autowired
    HttpServletRequest request;

    @Override
    public Result uploadMovie(String name, String des, Integer typeId, String tags,
                              Boolean visibility, MultipartFile pic, MultipartFile movie) throws IOException {
//        先将文件上传到服务器
        String picUrl = uploadMoviePic(pic);
        String movieUrl = uploadMovieFile(movie);
        if(movieUrl.startsWith("fail:")){
            return Result.fail(movieUrl.substring(5));
        }
//        获取作者信息
        String uploader = InterceptorUtil.getUser(request, stringRedisTemplate).getEmail();
//        获取当前时间
        Date uploadTime = new Date();
//        创建Movie对象
        Movie movie1 = new Movie(name, des, typeId, tags, uploader,movieUrl, visibility, uploadTime,picUrl);

//        将Movie对象存入数据库
        save(movie1);
//        再从数据库中获取完整对象
        movie1 = query().eq("name", name).eq("uploader",uploader).one();
//        将完整对象存入redis,以Hash的形式存储
        stringRedisTemplate.opsForHash().putAll("movie:"+ movie1.getId(), movie1.toMap());
        return Result.ok();
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
    public Result updateMoviePic(MultipartFile pic, Long id) throws IOException {
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

//    上传功能实现类，如果成功返回url，失败则返回前缀为fail:的失败信息
    @Override
    public String uploadMovieFile(MultipartFile movie) throws IOException {
        //        获取文件名
        String fileName = movie.getOriginalFilename();
//        如果文件为空，返回失败
        if(movie.isEmpty()||fileName==null){
            return "fail:上传失败，请选择文件";
        }

//        获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        if(!suffixName.equals(movieType)){
            return "fail:上传失败，文件类型不匹配";
        }

//        创建文件对象
        File file = new File(path+"/movies/"+fileName);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
//        如果文件已存在，返回失败
        if(file.exists()){
            return "fail:上传失败，文件已存在";
        }
//        保存文件
        movie.transferTo(file);
        return file.getPath();
    }
}
