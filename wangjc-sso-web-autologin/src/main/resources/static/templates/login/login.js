var form,layer;//声明组件

layui.use(["form","layer"],function(){

    form = layui.form;
    layer = layui.layer;

    form.render();//渲染表单

    /** 验证条件 */
    form.verify({
        username:function(value){
            if(BaseUtil.isEmpty(value)){
                return "用户名不可为空";
            }
        },
        password:function(value){
            if(BaseUtil.isEmpty(value)){
                return "验证密码不可为空";
            }
        }
    });

    /**监听submit提交*/
    form.on("submit(submit)",function(data){
        var param = data.field;
        Request.async("/wangjc-sso-autologin/autoLogin/login",{
            ...param,
            redirect:redirect
        }).then(res=>{
            if(BaseUtil.isEmpty(res)){
                location.reload();
            }else{
                BaseUtil.redirect(res)
            }
        })
        return false;
    });
});