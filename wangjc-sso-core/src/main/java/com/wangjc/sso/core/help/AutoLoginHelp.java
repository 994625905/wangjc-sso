package com.wangjc.sso.core.help;

import com.wangjc.sso.core.constant.SystemConstant;
import com.wangjc.sso.core.entity.TUser;
import com.wangjc.sso.core.service.RedisService;
import com.wangjc.sso.core.util.CookieUtil;
import com.wangjc.sso.core.util.JWTUtil;
import com.wangjc.sso.core.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 单点登录的协助
 * @author com.wangjc
 * @title: AutoLoginHelp
 * @projectName wangjc-blog
 * @description: TODO
 * @date 2020/6/17 19:24
 */
public class AutoLoginHelp {

    private static final Logger logger = LoggerFactory.getLogger(AutoLoginHelp.class);

    /**
     * 登录检查
     * @param request
     * @param request
     * @return
     */
    public static TUser loginCheck(HttpServletRequest request, RedisService redisService){

        String token = CookieUtil.getCookieValue(request,"token");

        if(StringUtil.isNullOrEmpty(token)){
            return null;
        }

        TUser user= (TUser) redisService.hget(SystemConstant.REDIS_KEY.LOGIN, token);
        if(user != null){
            redisService.hset(SystemConstant.REDIS_KEY.LOGIN,token,user,SystemConstant.REDIS_TIME.LOGIN);//刷新redis
            return user;
        }

        logger.info("redis已过期，需重新登录。");
        return null;
    }

    /**
     * 登录,同时设置主题(后期新增多主题功能)
     * @param user
     * @param redisService
     * @return token
     */
    public static String login(TUser user, RedisService redisService, HttpServletResponse response){

        if(user != null){
            String token = JWTUtil.sign(user.getId(),user.getPassword());
            // 设置token到cookie,user到redis
            CookieUtil.set(response,"token",token);
            redisService.hset(SystemConstant.REDIS_KEY.LOGIN,token,user,SystemConstant.REDIS_TIME.LOGIN);
            return token;
        }
        return null;
    }

    /**
     * 注销,注销user，token可能在请求头，也有可能设置参数传递
     * @param request
     * @param redisService
     */
    public static void logout(HttpServletRequest request,RedisService redisService){

        String token = StringUtil.isNullOrEmpty(request.getParameter("token"))?request.getHeader("Authorization"):request.getParameter("token");
        Long deleteHashKey = redisService.hashDeleteHashKey(SystemConstant.REDIS_KEY.LOGIN, token);
        logger.info("注销成功！删除redis存储条目[{}]", deleteHashKey);
    }



}
