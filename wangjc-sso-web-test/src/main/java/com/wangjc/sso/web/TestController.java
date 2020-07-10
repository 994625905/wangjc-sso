package com.wangjc.sso.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author wangjc
 * @title: TestController
 * @projectName wangjc-sso
 * @description: TODO
 * @date 2020/7/915:54
 */
@Controller
@RequestMapping(value = "/test")
public class TestController {

    /**
     * 加载首页测试
     * @return
     */
    @RequestMapping(value = "/index")
    public ModelAndView index(){
        ModelAndView view = new ModelAndView("/index");
        return view;
    }

}
