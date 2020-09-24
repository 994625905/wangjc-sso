package com.wangjc.sso.core.constant;

/**
 * 常量类
 * @author wangjc
 * @title: SystemConstant
 * @projectName wangjc-sso
 * @description: TODO
 * @date 2020/7/914:42
 */
public class SystemConstant {


    public interface REDIS_KEY{
        String LOGIN = "wangjc-sso";
        String AUTH_CODE = "wangjc-sso";
    }

    public interface REDIS_TIME{
        Long LOGIN = 60 * 60 * 24 * 7L;//7天
    }

}
