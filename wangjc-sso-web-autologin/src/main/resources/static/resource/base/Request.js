/*************************************封装请求的promise @wangjc***********************************/
var Request = {

    /**
     * 异步请求
     * @param url
     * @param param
     * @returns {Promise<unknown>}
     */
    async:function(url,param){
        return new Promise((success,fail)=>{
            BaseAjax.getDataAsync(url,param,res=>{
                if(res.code == 200){
                    return success(res.result)
                }else{
                    Feng.info(res.message || "系统服务器繁忙，请稍后再试")
                    return fail || null;
                }
            })
        })
    },
    /**
     * 异步请求：设置参数requestBody
     * @param url
     * @param param
     * @returns {Promise<unknown>}
     */
    asyncBody:function(url,param){
        return new Promise((success,fail)=>{
            BaseAjax.getDataAsync_Map(url,param,res=>{
                if(res.code == 200){
                    return success(res.result)
                }else{
                    Feng.info(res.message || "系统服务器繁忙，请稍后再试")
                    return fail || null;
                }
            })
        })
    }


}