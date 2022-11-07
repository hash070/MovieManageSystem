package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.interceptor.InterceptorUtil;
import com.guico.moviemanagesystembackend.mapper.MovieMapper;
import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MovieServiceImpl extends ServiceImpl<MovieMapper, Movie> implements IMovieService {

//    项目路径
    private final String path = System.getProperty("user.dir")+"/upload";

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
        movie1 = query().eq("name", name).eq("uploader",uploader).eq("file", movieUrl).one();
//        将完整对象存入redis,以Hash的形式存储
        Map<String, String> map = movie1.toMap();
        log.info("map:{}",map);
        stringRedisTemplate.opsForHash().putAll("movie:"+ movie1.getId(), map);
        return Result.ok();
    }

    @Override
    public Result getMovieById(Integer id) {
        Movie movie = getById(id);
        if(movie == null){
            return Result.fail("该电影不存在");
        }
        return Result.ok(movie);
    }


    @Override
    public Result getAll() {
//       先获取用户
        User user = InterceptorUtil.getUser(request, stringRedisTemplate);

//        先从redis中获取所有电影
        List<Object> movieList = stringRedisTemplate.opsForHash().values("movie:*");
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            List<Movie> movies = query().list();
            for(Object movie : movies){
                stringRedisTemplate.opsForHash().putAll("movie:"+((Movie)movie).getId(), ((Movie)movie).toMap());
            }
            movieList = Collections.singletonList(movies);
        }
//       如果用户为普通用户，返回自己上传的电影
        if(user.getLevel()>1) {
            if(movieList.size() == 0){
                return Result.fail("暂无电影");
            }
            movieList.removeIf(movie -> !((Movie) movie).getUploader().equals(user.getEmail()));
            return Result.ok(movieList);
        }
//        如果用户为管理员，返回所有电影
        return Result.ok(movieList);
    }

    @Override
    public Result getMovieByTags(List<Tag> tags) {
        return null;
    }

    @Override
    public Result getMovieByType(Integer typeId) {
//        先从redis中获取typeId对应的电影
        List<Object> movieList = stringRedisTemplate.opsForHash().values("movie:*");
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            List<Movie> movies = query().list();
            for(Object movie : movies){
                stringRedisTemplate.opsForHash().putAll("movie:"+((Movie)movie).getId(), ((Movie)movie).toMap());
            }
            movieList = Collections.singletonList(movies);
        }
        movieList.removeIf(movie -> !((Movie) movie).getType().equals(typeId));
        return Result.ok(movieList, movieList.size());
    }

    @Override
    public Result getMovieByUp(Integer upId) {
        List<Object> movieList = stringRedisTemplate.opsForHash().values("movie:*");
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            List<Movie> movies = query().list();
            for(Object movie : movies){
                stringRedisTemplate.opsForHash().putAll("movie:"+((Movie)movie).getId(), ((Movie)movie).toMap());
            }
            movieList = Collections.singletonList(movies);
        }
        movieList.removeIf(movie -> !((Movie) movie).getUploader().equals(upId));
        return Result.ok(movieList, movieList.size());
    }

    @Override
    public Result getMovieBySearch(String search) {
        List<Object> movieList = stringRedisTemplate.opsForHash().values("movie:*");
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            List<Movie> movies = query().list();
            for(Object movie : movies){
                stringRedisTemplate.opsForHash().putAll("movie:"+((Movie)movie).getId(), ((Movie)movie).toMap());
            }
            movieList = Collections.singletonList(movies);
        }
        movieList.removeIf(movie -> !((Movie) movie).getName().contains(search));
        return Result.ok(movieList, movieList.size());
    }

    @Override
    public Result deleteMovie(Integer movieId) {
        Movie movie = getMovie(movieId);
        if(movie == null){
            return Result.fail("该电影不存在");
        }
        removeById(movieId);
        stringRedisTemplate.delete("movie:"+movieId);
        return Result.ok();
    }


    @Override
    public Result getAllTags() {
        return null;
    }

    @Override
    public Result updateMovieMsg(Long id, String name, String des, Integer typeId, String tags,
                                 Boolean visibility, MultipartFile pic) throws IOException {
//        根据id获取movie对象
//        先从redis中获取
        Map<Object, Object> movieMap = stringRedisTemplate.opsForHash().entries("movie:"+id);
        Movie movie;
//        如果redis中没有,则从数据库中获取
        if(movieMap.size() == 0){
            movie = getById(id);
        }else{
            movie = new Movie(movieMap);
        }
//        获取picUrl
        String picUrl = movie.getPic();
//        如果不为空，删除
        if(picUrl != null){
            File file = new File(path + picUrl);
            if(file.exists()){
                file.delete();
            }
        }
//        上传新的pic
        picUrl = uploadMoviePic(pic);
//        更新movie对象
        movie.setName(name);
        movie.setDes(des);
        movie.setType(typeId);
        movie.setBanner(tags);
        movie.setVisibility(visibility);
        movie.setPic(picUrl);
//        更新数据库
        updateById(movie);
//        更新redis
        stringRedisTemplate.opsForHash().putAll("movie:"+id, movie.toMap());
        return Result.ok();
    }

//    上传功能实现类，如果成功返回url，失败则返回前缀为fail:的失败信息
    private String uploadMovieFile(MultipartFile movie) throws IOException {
        //        获取文件名
        String fileName = movie.getOriginalFilename();
//        如果文件为空，返回失败
        if(movie.isEmpty()||fileName==null){
            return "fail:上传失败，请选择文件";
        }

//        获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        if(!suffixName.contains(movieType)){
            log.info("上传电影文件类型错误,文件类型为"+suffixName);
            return "fail:上传失败，电影文件类型不匹配";
        }
//        文件名为时间戳+hashcode+后缀
        fileName = System.currentTimeMillis()+"-"+fileName.hashCode()+suffixName;
//        创建文件对象
        File file = new File(path+"/movies/"+fileName);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
//        如果文件已存在，返回失败，这个似乎已经不太可能了
        if(file.exists()){
            return "fail:上传失败，文件已存在";
        }
//        保存文件
        movie.transferTo(file);
        return file.getPath();
    }

    public String uploadMoviePic(MultipartFile pic) throws IOException {
        //        获取文件名
        String fileName = pic.getOriginalFilename();
//        如果文件为空，返回失败
        if(pic.isEmpty()||fileName==null){
            return "fail:上传失败，请选择文件";
        }

//        获取文件后缀
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
//        如果文件后缀不在允许的范围内，返回失败
        for(String type:picType){
            if(suffixName.equals(type)){
                return "fail:上传失败，文件类型不匹配";
            }
        }
//        创建文件对象
//        文件名为时间戳+hashcode+后缀
        fileName = System.currentTimeMillis()+"-"+fileName.hashCode()+suffixName;
        File file = new File(path+"/pics/"+fileName);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }
//        如果文件已存在，返回失败
        if(file.exists()){
            return "fail:上传失败，文件已存在";
        }
//        保存文件
        pic.transferTo(file);
        return file.getPath();
    }

    private Movie getMovie(Integer id){
//        先从redis中获取
        Map<Object, Object> movieMap = stringRedisTemplate.opsForHash().entries("movie:"+id);
        Movie movie;
//        如果redis中没有,则从数据库中获取
        if(movieMap.size() == 0){
            movie = getById(id);
        }else{
            movie = new Movie(movieMap);
        }
        return movie;
    }


}
