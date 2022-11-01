package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.ITypeService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/type")
@CrossOrigin
public class TypeController {

    @Autowired
    ITypeService typeService;

    @PostMapping("/add")
    public Result addType(String typeName, String SAToken) {
        return typeService.addType(typeName, SAToken);
    }

    @PostMapping("/delete")
    public Result deleteType(Long id, String SAToken) {
        return typeService.deleteType(id, SAToken);
    }

    @PostMapping("/update")
    public Result updateType(Long id, String typeName, String SAToken) {
        return typeService.updateType(id, typeName, SAToken);
    }

    @PostMapping("/getAll")
    public Result getTypeList() {
        return typeService.getTypeList();
    }

}
