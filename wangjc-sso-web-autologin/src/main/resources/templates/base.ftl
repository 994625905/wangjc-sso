<@extends name="/assign.ftl"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="${StaticServer}/resource/image/web.ico">

    <!--引入jQuery-->
    <script type="text/javascript" src="${StaticServer}/resource/plugin/jquery/jquery.min.js"></script>

    <!--引入layUI-->
    <link rel="stylesheet" href="${StaticServer}/resource/plugin/layui/css/layui.css">
    <script type="text/javascript" src="${StaticServer}/resource/plugin/layui/layui.js"></script>

    <!--引入自定义工具-->
    <script type="text/javascript" src="${StaticServer}/resource/base/BaseUtil.js"></script>
    <script type="text/javascript" src="${StaticServer}/resource/base/Feng.js"></script>
    <script type="text/javascript" src="${StaticServer}/resource/base/Request.js"></script>

    <@block name="body" >base_body_content</@block>

</html>