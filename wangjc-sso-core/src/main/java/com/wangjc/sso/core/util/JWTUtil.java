package com.wangjc.sso.core.util;

import cn.hutool.core.convert.Convert;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * token生成和解析的工具
 * @author com.wangjc
 * @title: JWTUtil
 * @projectName wangjc-blog
 * @description: TODO
 * @date 2020/5/415:47
 */
public class JWTUtil {

    private final static Logger logger = LoggerFactory.getLogger(JWTUtil.class);

    private final static String USER_ID = "userId";
    private final static String USER_Name = "userName";

    /**
     * 解析userId
     * @param request
     * @param header
     * @return
     */
    public static Integer getUserId(HttpServletRequest request,String header){
        return Convert.toInt(getTokenValueByRequestAndKey(request,USER_ID,header));
    }

    public static Integer getUserId(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return getUserId(request,"Authorization");
    }

    /**
     * 解析userName
     * @param request
     * @param header
     * @return
     */
    public static String getUserName(HttpServletRequest request,String header){
        return getTokenValueByRequestAndKey(request,USER_Name,header);
    }

    public static String getUserName(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return getUserName(request,"Authorization");
    }

    /**
     * 根据key值解析token
     * @param request
     * @param key
     * @param header
     * @return
     */
    private static String getTokenValueByRequestAndKey(HttpServletRequest request, String key, String header){
        String token = request.getHeader(header);
        if (!StringUtil.isNullOrEmpty(token)) {
            try {
                DecodedJWT jwt = JWT.decode(token);
                Claim claim = jwt.getClaim(key);
                return claim.asString() != null ? claim.asString() : claim.asInt().toString();
            } catch (JWTDecodeException e) {
                logger.error("token解析失败");
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 用户ID+USER_NAME生成token
     * @param userId
     * @param userName
     * @return
     */
    public static String sign(Long userId, String userName){
        try {
            Algorithm algorithm = Algorithm.HMAC256(userId.toString());
            String sign = JWT.create().withClaim(USER_Name, userName).withClaim(USER_ID, userId).sign(algorithm);
            return sign;
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("token生成失败");
        }
        return null;
    }

}
