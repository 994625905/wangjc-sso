/**@author wangjc 封装layer的弹窗*/

var Feng = {
	
	alert: function (info, iconIndex) {//消息弹框,info:内容，inconIndex:图标编号
        layer.msg(info, {
            icon: iconIndex
        });
    },
    info: function (info) {//提示框,
        Feng.alert(info, 0);
    },
    success: function (info) {//成功框
        Feng.alert(info, 1);
    },
    msg:function(info){//遮罩框
    	layer.msg(info);
    },
    error: function (info) {//错误框
        Feng.alert(info, 2);
    },
    tip:function(info,follow,site,time){//吸附框，默认左侧，黑色，3秒,此处颜色要根据主题动态设置
        var disTips = [],disTime = 3000;
        if(!BaseUtil.isEmpty(site)){
            disTips.push(site);
        }else{
            disTips.push(4);//支持上右下左四个方向，通过1-4进行方向设定。
        }
        if(!BaseUtil.isEmpty(time)){
            disTime = time;
        }
        switch (CURR_THEME){
            case THEME_SYTLE.black://黑色主题
                disTips.push("red");
                break;
            case THEME_SYTLE.blue://蓝色主题

                break;
            case THEME_SYTLE.wood://黄昏

                break;
            default:
                disTips.push("#000000");
                break;
        }
        layer.tips(info,follow,{
            tips:disTips,
            time:disTime
        });
    },
    close:function(index){//作两次关闭
    	if(index == null){
    		layer.close(layer.index);
    	}else{
    		layer.close(index);
    	}
    },
    closeAll:function(){
    	layer.closeAll();
    },
    load:function(type){//loading动画，0,1,2（默认取0，建议取2）
    	if(type == null || type == ""){
    		return layer.load();
    	}else{
    		return layer.load(type);
    	}
    },
    loading:function(){//固定的请求加载，默认无极限加载，返回的index用来关闭
    	return layer.msg("正在读取数据，请稍候……", {
			icon:16,
			shade:[0.3, 'black'],
			time:false
		});
	},
    closeIframe:function(){//关闭iframe，用于弹框层自身的关闭
    	layer.closeAll();
    },
    confirm:function(title,ensure){//确认框，ensure：回调函数
    	layer.confirm(title, {
            btn: ['确定', '取消']
        }, function (index) {
            Feng.close(index);
            ensure();
        }, function (index) {
            Feng.close(index);
        });
    },
    loadWindow:function(title,url,height,width){//子窗口
    	var disheight="",diswidth="";
        if(height == null || width == null){
        	disheight = BASE_HEIGHT;//给默认值
        	diswidth = BASE_WIDTH;//给默认值
        }else{
        	disheight=height;
        	diswidth=width;
        }
	    layer.open({
	        title: title,
	        type: 2,//2：表示url,1:表示html
	        skin: 'demo-class', //加上边框
	        area: [diswidth,disheight], //宽高
	        content:url,
            maxmin: true
        });
    },
    open:function(title,info,success,height,width){
    	var disheight="",diswidth="";
        if(height == null || width == null){
            diswidth = "420px";//给默认值
        	disheight = "240px";//给默认值
        }else{
        	disheight=height;
        	diswidth=width;
        }
    	layer.open({
			skin: 'layer-title',
			type: 1,
			title:title,
			closeBtn: 1, //不显示关闭按钮
			area: [diswidth, disheight], //宽高
			content: info,
			success:success
		});
    },
    infoDetail:function (title,info,success,yes,width,height,type){//子窗口
        var display = "";
        if (typeof info == "string") {
            display = info;
        } else {
            if (info instanceof Array) {
                for (var x in info) {
                    display = display + info[x] + "<br/>";
                }
            } else {
                display = info;
            }
        }
        var disheight="",diswidth="";
        if(height == null || width == null){
            diswidth = "420px";//给默认值
            disheight = "240px";//给默认值
        }else{
        	disheight=height;
        	diswidth=width;
        }
        var disSuccess = null;
        if(BaseUtil.isEmpty(success)){
        	disSuccess = function(layero, index){}
        }else{
        	disSuccess = success;
        }
        var disType = null;
        if(BaseUtil.isEmpty(type)){
        	disType = 1;
        }else{
        	disType = type;
        }
        layer.open({
            title: title,
            type: disType,//1，标准版，5:可越界
            skin: 'layui-layer-btn1', //加上边框
            area: [diswidth, disheight], //宽高
            content: '<div style="padding: 20px;">' + display + '</div>',
            btn:['确认','取消'],
            btnAlign:"r",//按钮居右
            success:disSuccess,
            yes:yes,
            btn2:function(index){
            	Feng.close(index);
            }
        });
    },
    /**
     * 输入层
     * @param title：标题
     * @param callback：确认后的回调
     * @param value：默认值
     * @param formType：输入框类型，支持0（文本）默认1（密码）2（多行文本）
     */
    input:function(title,callback,value,formType){
        var disFormType = BaseUtil.isEmpty(formType)?0:formType;
        var disValue = BaseUtil.isEmpty(value)?"":value;
        layer.prompt({
            formType: disFormType,
            value: disValue,
            title: title,
        }, function(value, index, elem){
            if(callback){
                callback(value);
            }
            layer.close(index);
        });
    }
};