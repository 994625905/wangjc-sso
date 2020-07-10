# wangjc-sso
分布式单点登陆(记得点个star哦)
# 一款简单实用的分布式单点登录系统

1. 单点登录，简称SSO：在多个应用系统中，只需要登录一次，就可以访问其他相互信任的应用系统。
2. 所以在数据存储的角度来看，相互信任的应用至少共用着一套用户数据，可以分库，但核心验证身份的用户表应该是共享的
在链接的认证与跳转的过程中必然存在数据的传递与读取的过程，我这里采用的方式是：
#### 服务端redis存储登录用户信息；客户端cookie存储认证token，摒弃session的存储
（cookie的存储，token的概念，这个不是很明白的，建议先去自行百度搞清楚。注：该博客站点不会去浪费文笔去解释各种名词与定义）

## 1.模型如图所示
![模型图](http://www.wangjc.vip/group1/M00/00/00/rBAAD18G6sWANbfsAAAXAo47zjg053.png "模型图")

## 2.架构的设计（分3个模块）
![idea目录](http://www.wangjc.vip/group1/M00/00/00/rBAAD18HxCuAO9LjAADhB_eevMU631.png "idea目录")

| 模块名称  | 作用  |
| ------------ | ------------ |
| wangjc-sso-core  | 如截图所示，放定制好的实体，redisService,工具类，返回值，常量……  |
| wangjc-sso-web-autologin |  认证中心，主要负责登陆页面，核心业务在于登陆的存储，成功后的重定向 |
| wangjc-sso-web-test  | 测试实例，主要代码在拦截器里，拦截当前的请求是否已认证，是否需要转发到认证中心  |
1. 这里只是为了测试案例，表达思想，追求速度与简洁，真实场景的架构千万被如此随意


## 3.直接上部分核心代码

	public class TUser implements Serializable {
        private static final long serialVersionUID = -6882766758996195727L;
        private Long id = 1L;
        private String userName = "wangjc";
        private String password = "123456";
    	//省略getting,setting
    }
	//这里的实体避开访问数据库的操作，直接写死。。
##### 认证中心的controller

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
    public ActionResult&lt;String&gt; login(String userName,String password, HttpServletRequest request, HttpServletResponse response){

        // 验证登录是否通过
        TUser user = new TUser();

        if(user.getUserName().equals(userName) &amp;&amp; user.getPassword().equals(password)) {
            // 设置登录
            String token = AutoLoginHelp.login(user, redisService,response);
            // 重定向
            String redirectUrl = request.getParameter("redirect");
            if (redirectUrl != null &amp;&amp; redirectUrl.trim().length() &gt; 0) {
                redirectUrl = redirectUrl + "?token=" + token;
                logger.info("登录成功，重定向地址[{}]",redirectUrl);
            }
            return ActionResult.ok(redirectUrl);
        }
        return ActionResult.error(ResultEnum.LOGIN_FAIL.getMsgCn());
    }

##### AutoLoginHelp（主要是设置缓存和验证）

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
         * 登录,
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
    
##### 测试应用的拦截器
        /**
         * 核心过滤，资源放行
         * @param request
         * @param response
         * @param chain
         * @throws IOException
         * @throws ServletException
         */
        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
            HttpServletResponse res = (HttpServletResponse) response;
            HttpServletRequest req = (HttpServletRequest) request;
    
            String path = req.getServletPath();//获取访问的地址
    
            // 初始认证登陆的放行
            String token = request.getParameter("token");
            if(!StringUtil.isNullOrEmpty(token)){
    
                // 设置token到cookie
                CookieUtil.set(res,"token",token);
    
                TUser user = (TUser) redisService.hget(SystemConstant.REDIS_KEY.LOGIN,token);
                if(user == null){
                    res.sendRedirect(loginURL+"?redirect="+redirectServer);//定向到登录
                    return;
                }
    
                // 重定向，隐藏token
                if("/".equals(path)){
                    res.sendRedirect(redirectServer);
                    return;
                }
                chain.doFilter(request,response);
                return;
            }
    
            // 静态资源放行
            if(staticResource(path)){
                chain.doFilter(request,response);
                return;
            }
            ///这里一段业务逻辑（注销，分享，重置……）的放行，自定义
    
            TUser user = AutoLoginHelp.loginCheck(req,redisService);
            if(user == null){
                res.sendRedirect(loginURL+"?redirect="+redirectServer);//定向到登录
                return;
            }
            chain.doFilter(request,response);
        }
##### 测试案例的properties配置文件
	wangjc.sso.autologin=http://127.0.0.1:8090/wangjc-sso-autologin/autoLogin/index
	wangjc.sso.redirect-server=http://127.0.0.1:8091/wangjc-sso-test

## 4.应用，测试
1. 开启本地的redis后，分别启动wangjc-sso-web-autologin 和 wangjc-sso-web-test两个应用，然后初次访问http://127.0.0.1:8091/wangjc-sso-test/
2. 会看到自动跳转到认证中心，并携带重定向的地址，认证成功后自动跳转回来。再次访问时登陆的状态正常。重测可以手动清除浏览器的cookie或者是服务端的redis，则登陆状态失效。在maven父节点上再次新增web-test2,按照web-test的方式定义拦截器，会发现登陆状态是共享的，因为摒弃了session，每个应用都能按照指定的key读取到缓存信息
