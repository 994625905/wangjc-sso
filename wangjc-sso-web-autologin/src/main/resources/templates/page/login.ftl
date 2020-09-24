<@override name="body">
<title>单点登录</title>
<link rel="stylesheet" href="${StaticServer}/templates/login/login.css" />

<body style="background-image: url(${StaticServer}/resource/image/loginbg.jpg)">
    <div class="content">
        <div class="bidTitle">分布式单点登陆 · <font style="font-family: 楷体;"> 认证中心</font></div>
        <div class="logCon">
            <form class="layui-form" style="background-color: transparent;">
                <span>账号:</span>
                <input class="bt_input" name="userName" lay-verify="username" />
                <span>密码:</span>
                <input class="bt_input" type="password" name="password" lay-verify="password" />
                <span>验证码:</span>
                <img id="authCode" style="width: 111px;height: 36px">
                <input class="bt_input" name="code" lay-verify="code" style="width: 50px;"/>
                <input name="key" type="hidden" value="" />
                <button lay-submit lay-filter="submit" class="logingBut">登录</button>
            </form>
        </div>
    </div>
</body>
<script>
    var redirect = "${redirect!''}";
</script>
<script type="text/javascript" src="${StaticServer}/templates/login/login.js"></script>
</@override>
<@extends name="/base.ftl"/>

