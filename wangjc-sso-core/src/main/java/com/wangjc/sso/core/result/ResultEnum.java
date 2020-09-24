package com.wangjc.sso.core.result;

/**
 * 结果集的枚举
 * @author com.wangjc
 * @title: ResultEnum
 * @projectName wangjc-blog
 * @description: TODO
 * @date 2020/5/416:28
 */
public enum ResultEnum {

    SUCCESS(200,"OK","请求成功"),
    ERROR(400,"Bad Request","请求错误"),
    UNAUTHORIZED(401,"Unauthorized","请先登录"),
    LOGIN_FAIL(410,"login fail","登录错误"),
    CODE_FAIL(411,"code fail","验证码错误"),
    ERROR_PARAMETER(455,"Params Error","参数错误"),

    EXCEPTION(500,"exception","系统内部异常");

    private int code;
    private String msg;
    private String msgCn;

    private ResultEnum(int code, String msgCn) {
        this.code = code;
        this.msgCn = msgCn;
    }

    private ResultEnum(int code, String msg, String msgCn) {
        this.code = code;
        this.msg = msg;
        this.msgCn = msgCn;
    }

    public int getCode() {
        return this.code;
    }

    public String getMsg() {
        return this.msg;
    }

    public String getMsgCn() {
        return this.msgCn;
    }

}
