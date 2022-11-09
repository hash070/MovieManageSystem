package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.interceptor.InterceptorUtil;
import com.guico.moviemanagesystembackend.mapper.MovieMapper;
import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.RedisUtil;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

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
    public Result upload(String name, String des, Integer typeId, String tags, Boolean visibility, String pic, String movie) {
//      检查文件是否存在
        if (pic == null || movie == null) {
            return Result.fail("文件不存在");
        }
        if(!new File(path+pic).exists()||!new File(path+movie).exists()){
            return Result.fail("文件不存在");
        }

        //        生成Movie对象

        String uploader = InterceptorUtil.getUser(request,stringRedisTemplate).getEmail();
        Movie movie1 = new Movie(name,des,typeId,tags,uploader,visibility,pic,movie);
//        保存到数据库
        save(movie1);
//        保存到redis
        stringRedisTemplate.opsForHash().putAll("movie:"+movie1.getId(),movie1.toMap());
        return Result.ok();
    }

    @Override
    public Result uploadMovie(MultipartFile movie) throws IOException {
        String url = uploadMovieFile(movie);
        return Result.ok(url);
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
        List<Movie> movieList = RedisUtil.getAllMovies(stringRedisTemplate);
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            movieList = query().list();
            for(Movie movie : movieList){
                stringRedisTemplate.opsForHash().putAll("movie:"+movie.getId(), movie.toMap());
            }
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
        List<Movie> movieList = RedisUtil.getAllMovies(stringRedisTemplate);
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            movieList = query().list();
            for(Movie movie : movieList){
                stringRedisTemplate.opsForHash().putAll("movie:"+movie.getId(), movie.toMap());
            }
        }
        movieList.removeIf(movie -> !((Movie) movie).getType().equals(typeId));
        return Result.ok(movieList, movieList.size());
    }

    @Override
    public Result getMovieByUp(String upId) {
        List<Movie> movieList = RedisUtil.getAllMovies(stringRedisTemplate);
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            movieList = query().list();
            for(Movie movie : movieList){
                stringRedisTemplate.opsForHash().putAll("movie:"+movie.getId(), movie.toMap());
            }
        }
        movieList.removeIf(movie -> !((Movie) movie).getUploader().equals(upId));
        return Result.ok(movieList, movieList.size());
    }

    @Override
    public Result getMovieBySearch(String search) {
        List<Movie> movieList = RedisUtil.getAllMovies(stringRedisTemplate);
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            movieList = query().list();
            for(Movie movie : movieList){
                stringRedisTemplate.opsForHash().putAll("movie:"+movie.getId(), movie.toMap());
            }
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
        File file = new File(movie.getFile());
        if(file.exists()){
            file.delete();
        }
        File pic = new File(movie.getPic());
        if(pic.exists()){
            pic.delete();
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
                                 Boolean visibility, String pic) throws IOException {
        //        先从redis中获取电影
        Map movieMap = stringRedisTemplate.opsForHash().entries("movie:"+id);
        if(movieMap.size() == 0){
//            如果redis中没有电影,则从数据库中获取
            Movie movie = getById(id);
            if(movie == null){
                return Result.fail("该电影不存在");
            }
            movieMap = movie.toMap();
        }
//        对比pic是否变化，变化则删除之前的文件
        if(pic != null && !pic.equals(movieMap.get("pic"))){
            File file = new File((String) movieMap.get("pic"));
            if(file.exists()){
                file.delete();

            }
        }
//        更新电影信息
        movieMap.put("name", name);
        movieMap.put("des", des);
        movieMap.put("type", typeId.toString());
        movieMap.put("tags", tags);
        movieMap.put("visibility", visibility.toString());
        movieMap.put("pic", pic);
        stringRedisTemplate.opsForHash().putAll("movie:"+id, movieMap);
        updateById(new Movie(movieMap));
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
        return "/movies/"+fileName;
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
        return "/pics/"+fileName;
    }

    @Override
    public Result getAllPublicMovie() {
        //        先从redis中获取所有电影
        List<Movie> movieList = RedisUtil.getAllMovies(stringRedisTemplate);
//        如果redis中没有电影,则从数据库中获取
        if(movieList.size() == 0){
            movieList = query().list();
            for(Movie movie : movieList){
                stringRedisTemplate.opsForHash().putAll("movie:"+movie.getId(), movie.toMap());
            }
        }
        movieList.removeIf(movie ->!movie.getVisibility() );
        return Result.ok(movieList, movieList.size());
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
