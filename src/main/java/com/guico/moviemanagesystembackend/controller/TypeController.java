package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.ITypeService;
import com.guico.moviemanagesystembackend.service.impl.TypeServiceImpl;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/type")
@CrossOrigin
public class TypeController {


    @Autowired
    TypeServiceImpl typeService;

    @PostMapping("/add")
    public Result addType(String typeName) {
        return typeService.addType(typeName);
    }

    @PostMapping("/delete")
    public Result deleteType(Long id) {
        return typeService.deleteType(id);
    }

    @PostMapping("/update")
    public Result updateType(Long id, String typeName) {
        return typeService.updateType(id, typeName);
    }

    @PostMapping("/getAll")
    public Result getTypeList() {
        return typeService.getTypeList();
    }

}
