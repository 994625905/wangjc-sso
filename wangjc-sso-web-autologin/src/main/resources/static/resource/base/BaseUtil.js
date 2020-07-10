/*************************************基础Ajax请求 @wangjc***********************************/
var BaseAjax = {
	getDataAsync:function(ajax_url,param,success,contentType){//异步请求，回调函数一定要有
		var disParam,index;
		if(BaseUtil.isEmpty(param)){
			disParam = null;
		}else{
			disParam = param;
		}
		var ajaxOption={
			cache:false,//关闭缓存
			async:true,//默认为true
			url:ajax_url,
			data:disParam,
			method:"post",
			dataType:"json",

            beforeSend:function(){
                index = Feng.loading("数据请求中。。");
            },

			success:function(resultData){
            	Feng.close(index);
				success(resultData);
			}
		};
		//之前封装遗漏的，导致很多地方编辑保存，传参不合法
		if(contentType){
			ajaxOption.contentType="application/json; charset=UTF-8";
		}
		$.ajax(ajaxOption);
	},
	getDataAsync_Map:function(ajax_url,param,success){
		return BaseAjax.getDataAsync(ajax_url,JSON.stringify(param),success,true);
	},
	getData_Map:function(ajax_url,param,loadFlag){
		return BaseAjax.getData(ajax_url,JSON.stringify(param),true,loadFlag);
	},
	getData:function(ajax_url,param,contentType,loadFlag){//同步加载,是否带loading
		var disParam,result,index;
		if(BaseUtil.isEmpty(param)){
			disParam = null;
		}else{
			disParam = param;
		}
		var ajaxOption={
			cache:false,//关闭缓存
			async:false,
			url:ajax_url,
			data:disParam,
			method:"post",
			dataType:"json",
			success:function(resultData){
				result = resultData;
			}
		};
		//之前封装遗漏的，导致很多地方编辑保存，传参不合法
		if(contentType){
			ajaxOption.contentType="application/json; charset=UTF-8";
		}
        if(loadFlag == true){//默认不带loading加载
            ajaxOption.beforeSend=function(){
                index = Feng.loading();
            };
            ajaxOption.success=function(resultData){
            	Feng.close(index);
                result = resultData;
            };
        }
		$.ajax(ajaxOption);
		return result;
	},
	getPageHtml:function(ajax_url,param,success){
		var disParam,index;
		if(BaseUtil.isEmpty(param)){
			disParam = null
		}else{
			disParam = param;
		}
		var ajaxOption = {
			cache:false,
			url:ajax_url,
			data:disParam,
			method:"post",
			dataType:"html",
			beforeSend:function(){
				index = Feng.load(2);
			},
			success:function(resultData){
				Feng.close(index);
				success(resultData);
			}
		};
		$.ajax(ajaxOption);
	}
};
/*************************************公共util函数 @wangjc*********************************/
var BaseUtil = {
	/**判断非空*/
	isEmpty:function(obj){//判断非空
	    if(typeof obj == "undefined" || obj == null || obj == "" || obj == "null"){
	        return true;
	    }else{
	        return false;
	    }
	},
	
	/**替换字符串*/
	replaceAll:function(info,regax,replace){
		var t = eval("/"+regax+"/g");
		return info.replace(t,replace);
	},
	
	/**获取页面请求链接中包含的参数*/
	getPageParam:function(param){
		var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null){
	        return unescape(r[2]);
	    }else{
		    return "";	    	
	    }
	},

	/** 获取form表单的输入的参数 */
	getParamByFormId:function(formId){
        var a, o, h, i, e;
        a = $("#"+formId).serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = BaseUtil.trim(e.value);
            }
        }
        return o;
	},

	/** 去左右空格 */
	trim:function(s){
        return s.replace(/(^\s*)|(\s*$)/g, "");
	},

	/** 跳链接 */
    redirect:function(url){
        location.href = url;
    },

	/** 延时执行 */
    setTimeout:function(method,times){//延时函数
        setTimeout(method,times);
    },

	/** 清空对象属性 */
	clearParam:function(param){
		for(var key in param){
			param[key] = "";
		}
	},

	/** 点击复制 */
    clickCopy:function(copyInfo,successInfo){
        var oInput = document.createElement('input');//虚拟一个对象
        oInput.value = copyInfo;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';
        Feng.success(successInfo);
    },

	/** 刷新父页面 */
	reloadParent:function(){
		parent.location.reload();
	}
};

/***************************************基础的校验规则 @wangjc***************************************************/
var BaseRegax = {

	/**正整数+0*/
	regaxZN:/^\d+$/,

	/**正整数，不包括0*/
	regaxIN:/^\+?[1-9][0-9]*$/,

	regaxZNumber:/^\d+(\.\d+)?$/,

	/** 非负数 */
	regaxNoNegative:/^\d+(\.{0,1}\d+){0,1}$/,

	/** 校验手机号 */
    isMobile:function(mobile){
        return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(mobile);
    },

    /** 校验邮箱 */
    isEmail:function(email){
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email);
    },

	/** 验证整数 */
	isInteger:function(obj){
        return typeof obj === 'number' && obj%1 === 0;
	},

	/** 验证数字 */
	isNum:function(num){
        var reNum=/^\d*$/;
        return(reNum.test(num));
	},

	/** 大于0小于1 */
	smallNumber:function(value){
		if(BaseUtil.isEmpty(value)){

		}else{
			return /^0\.\d+$/.test(value)
		}
	},

	/** 非负数验证 */
	noNegative:function(value){
		if(BaseUtil.isEmpty(value)){
			return false;
		}else{
			return this.regaxNoNegative.test(value);
		}
	},

    /**非负整数验证*/
    regaxZInteger:function(value,type){//type：是否包括0
        if(BaseUtil.isEmpty(type)){
            if(this.regaxZN.test(value)){
                return true;
            }else{
                return false;
            }
        }else{
            if(this.regaxIN.test(value)){
                return true;
            }else{
                return false;
            }
        }
    },

    /**正小数验证*/
    regaxZFload:function(value){
        if(/^[0-9]+(.[0-9]{1,4})?$/.test(value)){
            return true;
        }else{
            return false;
        }
    },

};

/*************************************分享的函数***********************************/
var BaseShare={

    /**
	 *
     * @param option：table渲染的选项
     * @param title：分享标题
     */
	table:function(option,title){
		var disTitle = BaseUtil.isEmpty(title)?"表格分享":title;
		var shareHtml = '  <div class="layui-form-item">' +
						'    <label class="layui-form-label">分享标题：</label>' +
						'    <div class="layui-input-block">' +
						'      <input type="text" name="title" value="'+disTitle+'" class="layui-input">' +
						'    </div>' +
						'  </div>' +
						'  <div class="layui-form-item">' +
						'    <label class="layui-form-label">有效时间：</label>' +
						'    <div class="layui-input-block">' +
						'      <select name="validtime" class="layui-input">' +
						'        <option value="7200">2小时</option>' +
						'        <option value="21600">6小时</option>' +
						'        <option value="43200">24小时</option>' +
						'        <option value="86400">24小时</option>' +
						'        <option value="">永久</option>' +
						'      </select>' +
						'    </div>' +
						'  </div>';
		Feng.infoDetail("分享表格",shareHtml,null,function(index){
			var model = {title:$("input[name='title']").val(),validtime:$("select[name='validtime']").val(),type:SHARE.table};
			model.jsonContent = JSON.stringify(option);
            Feng.close(index);
			BaseAjax.getDataAsync_Map(BasePath+"/share/createShare",{model:model},function(res){
				if(BaseUtil.isEmpty(res.result)){
					Feng.info("服务器繁忙，请稍后再试。。");
				}else{
                    layer.msg('分享成功，点击复制链接', {
                        time: 30000, //30s后自动关闭
                        btn: ['内网', '外网'],
                        yes:function(i){
                        	layer.close(i);
                            BaseUtil.clickCopy(res.result.innerUrl,"内网复制成功");
                        },
                        btn2:function(i){
                            layer.close(i);
                            BaseUtil.clickCopy(res.result.outerUrl,"外网复制成功");
						}
                    });
				}
			});
		},"420px","250px");
	},

	chart:function(option,title){
        var disTitle = BaseUtil.isEmpty(title)?"图表分享":title;
        var shareHtml = '  <div class="layui-form-item">' +
            '    <label class="layui-form-label">分享标题：</label>' +
            '    <div class="layui-input-block">' +
            '      <input type="text" name="title" value="'+disTitle+'" class="layui-input">' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item">' +
            '    <label class="layui-form-label">有效时间：</label>' +
            '    <div class="layui-input-block">' +
            '      <select name="validtime" class="layui-input">' +
            '        <option value="7200">2小时</option>' +
            '        <option value="21600">6小时</option>' +
            '        <option value="43200">24小时</option>' +
            '        <option value="86400">24小时</option>' +
            '        <option value="">永久</option>' +
            '      </select>' +
            '    </div>' +
            '  </div>';
        Feng.infoDetail("分享图表",shareHtml,null,function(index){
            var model = {title:$("input[name='title']").val(),validtime:$("select[name='validtime']").val(),type:SHARE.chart};
            model.jsonContent = JSON.stringify(option);
            Feng.close(index);
            BaseAjax.getDataAsync_Map(BasePath+"/share/createShare",{model:model},function(res){
                if(BaseUtil.isEmpty(res.result)){
                    Feng.info("服务器繁忙，请稍后再试。。");
                }else{
                    layer.msg('分享成功，点击复制链接', {
                        time: 30000, //30s后自动关闭
                        btn: ['内网', '外网'],
                        yes:function(i){
                            layer.close(i);
                            BaseUtil.clickCopy(res.result.innerUrl,"内网复制成功");
                        },
                        btn2:function(i){
                            layer.close(i);
                            BaseUtil.clickCopy(res.result.outerUrl,"外网复制成功");
                        }
                    });
                }
            });
        },"420px","250px");
	},

	scheduleChart:function(schedule,title){
        var disTitle = BaseUtil.isEmpty(title)?"分享报表（定时邮件通知）":title;
        var shareHtml = '  <div class="layui-form-item">' +
            '    <label class="layui-form-label">分享标题：</label>' +
            '    <div class="layui-input-block">' +
            '      <input type="text" name="title" value="'+disTitle+'" class="layui-input">' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item">' +
            '    <label class="layui-form-label">定时机制：</label>' +
            '    <div class="layui-input-block">' +
            '      <select name="validtime" class="layui-input">' +
            '        <option value="7200">2小时</option>' +
            '        <option value="21600">6小时</option>' +
            '        <option value="43200">24小时</option>' +
            '        <option value="86400">24小时</option>' +
            '        <option value="">永久</option>' +
            '      </select>' +
            '    </div>' +
            '  </div>';
        Feng.infoDetail("分享报表（定时邮件通知）",shareHtml,null,function(index){
            var model = {title:$("input[name='title']").val(),validtime:$("select[name='validtime']").val(),type:SHARE.chart};
            model.jsonContent = JSON.stringify(option);
            Feng.close(index);
            BaseAjax.getDataAsync_Map(BasePath+"/share/createShare",{model:model},function(res){
                if(BaseUtil.isEmpty(res.result)){
                    Feng.info("服务器繁忙，请稍后再试。。");
                }else{
                    layer.msg('分享成功，点击复制链接', {
                        time: 30000, //30s后自动关闭
                        btn: ['内网', '外网'],
                        yes:function(i){
                            layer.close(i);
                            BaseUtil.clickCopy(res.result.innerUrl,"内网复制成功");
                        },
                        btn2:function(i){
                            layer.close(i);
                            BaseUtil.clickCopy(res.result.outerUrl,"外网复制成功");
                        }
                    });
                }
            });
        },"420px","250px");
    },

};

/*************************************日期工具**************************************/
var BaseDate = {

    /**
	 * 时间戳转字符串，精确到秒
     * @param timestamp:时间戳
     * @returns {*}
     * @constructor
     */
    timeStampToDate:function(timestamp){
        if(BaseUtil.isEmpty(timestamp)){
            return null;
        }else{
            var d = new Date(timestamp * 1000);
            return (d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate())+" "+(d.getHours())+":"+(d.getMinutes())+":"+(d.getSeconds());
        }
    },

    /**
	 * 字符串转为时间戳
     * @param DateStr
     * @returns {*}
     * @constructor
     */
    dateStrToTimeStamp:function(DateStr){
        if(BaseUtil.isEmpty(DateStr)){
            return null;
        }else{
            return new Date(DateStr).getTime()/1000;
        }
    },

    /**
     * 当前时间往前推几天，
     * @param before：负数之前，正数之后
     */
    rangeDate:function(before){
        var today = new Date();
        today.setTime(today.getTime()+(24*before)*60*60*1000);
        var y = today.getFullYear();
        var m = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);// 获取当前月份的日期
        var d = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
        var pre = y + "-" + m + "-" + d;
        return pre;
    },

    /**
     * 指定时间往前推几天，
     * @param before：负数之前，正数之后
     */
    rangeDateByOper:function(operDate,before){
        var today = new Date(operDate);
        today.setTime(today.getTime()+(24*before)*60*60*1000);
        var y = today.getFullYear();
        var m = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);// 获取当前月份的日期
        var d = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
        var pre = y + "-" + m + "-" + d;
        return pre;
    },

    /**
	 * 为了迎合数据库yyyyMMdd的格式，此处主要服务于日期联动框，格式化
     * @param date
     */
	getDateByRangeLay:function(date){
		var arr = date.split(" - ");
		var res = {};
		res.startDate = BaseUtil.replaceAll(arr[0],"-","");
		res.endDate = BaseUtil.replaceAll(arr[1],"-","");
		return res;
	},

	/**
	 * 获取日期之间的天数
	 * @param startDate：计划开始时间
	 * @param endDate：计划结束时间
	 * @param dayLength：每隔几天，0-代表每天，1-代表日期间隔一天
	 */
	getRangeDatelist:function(startDate, endDate, dayLength) {
		var res = [];
		res.push(startDate);
		for (var i = 0 ;; i++) {
			var getDate = getTargetDate(startDate, dayLength);
			startDate = getDate;
			if (getDate <= endDate) {
				res.push(getDate);
			} else {
				break;
			}
		}
		return res;
	},

	/**
	 *
	 * @param date 开始时间
	 * @param dayLength 每隔几天，0-代表获取每天，1-代表日期间隔一天
	 * @returns {string}
	 */
	getTargetDate:function(date,dayLength) {
		dayLength = dayLength + 1;
		var tempDate = new Date(date);
		tempDate.setDate(tempDate.getDate() + dayLength);
		var year = tempDate.getFullYear();
		var month = tempDate.getMonth() + 1 < 10 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
		var day = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
		return year + "-" + month + "-" + day;
	},
	/**
	 * 获取两个日期之间天数差
	 * @param start
	 * @param end
	 * @returns {number}
	 */
	getDiff:function(start,end){
		var days = new Date(end).getTime() - new Date(start).getTime();
		var time = parseInt(days / (1000 * 60 * 60 * 24));
		return time;
	}

};

/*************************************float(float的算法，JS自带bug)**************************************/
var BaseFloat={
	
	/**获取参数精度，如果为整数则精度为0*/ 
	_getPrecision:function(arg){  
	  	if(arg.toString().indexOf(".")==-1){  
	     	return 0;  
	  	}else{  
	     	return arg.toString().split(".")[1].length;  
	  	}   
	},
	
	/**获取小数的整数形式*/  
	_getIntFromFloat:function(arg){  
	  	if(arg.toString().indexOf(".")==-1){  
	     	return arg;  
	  	}else{  
	     	return Number(arg.toString().replace(".",""));  
	  	}
	},
	
	/**保留整数*/
	_getInt:function(arg){  
	  	if(arg.toString().indexOf(".")==-1){  
	     	return arg;  
	  	}else{  
	     	return Number(arg.toString().split(".")[0]);  
	  	}
	},

	/**加法*/
	floatAdd:function(arg1,arg2){  
	  var precision1=this._getPrecision(arg1);  
	  var precision2=this._getPrecision(arg2);  
	  var temp=Math.pow(10,Math.max(precision1,precision2));  
	  return (this.floatMulti(arg1,temp)+this.floatMulti(arg2,temp))/temp;  
	},

	/**乘法*/  
	floatMulti:function(arg1,arg2){  
	  	var precision1=this._getPrecision(arg1);  
	  	var precision2=this._getPrecision(arg2);  
	  	var tempPrecision=0;
	  	tempPrecision+=precision1;  
	  	tempPrecision+=precision2;  
	  	var int1=this._getIntFromFloat(arg1);  
	  	var int2=this._getIntFromFloat(arg2);  
	  	return (int1*int2)*Math.pow(10,-tempPrecision);  
	},
	
	/**减法 arg1:被减数 arg2:减数*/  
	floatSubtract:function(arg1,arg2){  
	  	var precision1=this._getPrecision(arg1);  
	  	var precision2=this._getPrecision(arg2);  
	  	var temp=Math.pow(10,Math.max(precision1,precision2));  
	  	return (this.floatMulti(arg1,temp)-this.floatMulti(arg2,temp))/temp;  
	},
	
	/**除法 arg1:被除数 arg2:除数*/  
	floatDiv:function(arg1,arg2){  
	   	var precision1=this._getPrecision(arg1);    
	   	var precision2=this._getPrecision(arg2);   
	   	var int1=this._getIntFromFloat(arg1);    
	   	var int2=this._getIntFromFloat(arg2);     
	   	var result=(int1/int2)*Math.pow(10,precision2-precision1);    
	   	return result;    
	}
};