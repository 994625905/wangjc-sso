package com.wangjc.sso.core.entity;

import java.io.Serializable;

/**
 * @author wangjc
 * @title: TUser
 * @projectName wangjc-sso
 * @description: TODO
 * @date 2020/7/914:09
 */
public class TUser implements Serializable {

    private static final long serialVersionUID = -6882766758996195727L;

    private Long id = 1L;

    private String userName = "wangjc";

    private String password = "123456";

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
