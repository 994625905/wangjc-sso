package com.wangjc.sso.web;

import com.wangjc.sso.core.entity.TUser;
import com.wangjc.sso.core.help.AutoLoginHelp;
import com.wangjc.sso.core.result.ActionResult;
import com.wangjc.sso.core.result.ResultEnum;
import com.wangjc.sso.core.service.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 单点登录的控制层
 * @author com.wangjc
 * @title: AutoLoginController
 * @projectName wangjc-blog
 * @description: TODO
 * @date 2020/6/1718:22
 */
@Controller
@RequestMapping("/autoLogin")
public class AutoLoginController{

    private static final Logger logger = LoggerFactory.getLogger(AutoLoginController.class);

    @Autowired
    private RedisService redisService;

    /**
     * 登录请求页面
     * @return
     */
    @RequestMapping(value = "/index",method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView index(String redirect, HttpServletRequest request){

        TUser user = AutoLoginHelp.loginCheck(request, redisService);

        if(user == null){
            ModelAndView view = new ModelAndView("/page/login");
            view.addObject("redirect", redirect);

            logger.info("登录请求，站点[{}]",redirect);
            return view;
        }
        if(redirect == null){
            return new ModelAndView("/index");
        }
        return new ModelAndView("redirect:"+redirect);
    }

    /**
     * 账号密码登录动作(以此类推，可添加手机验证码，微信……第三方登录接口)
     * @param userName
     * @param password
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/login",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public ActionResult<String> login(String userName,String password, HttpServletRequest request, HttpServletResponse response){

        // 验证登录是否通过
        TUser user = new TUser();

        if(user.getUserName().equals(userName) && user.getPassword().equals(password)) {
            // 设置登录
            String token = AutoLoginHelp.login(user, redisService,response);
            // 重定向
            String redirectUrl = request.getParameter("redirect");
            if (redirectUrl != null && redirectUrl.trim().length() > 0) {
                redirectUrl = redirectUrl + "?token=" + token;
                logger.info("登录成功，重定向地址[{}]",redirectUrl);
            }
            return ActionResult.ok(redirectUrl);
        }
        return ActionResult.error(ResultEnum.LOGIN_FAIL.getMsgCn());
    }

    /**
     * 注销登录
     * @param request
     * @return
     */
    @RequestMapping(value = "/logout",method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView logout(HttpServletRequest request){
        AutoLoginHelp.logout(request,redisService);
        return new ModelAndView("/autoLogin/index");
    }


}
