<%--
  Created by IntelliJ IDEA.
  User: lenovo
  Date: 2018/9/20
  Time: 12:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%String basePath = request.getScheme() + "://" + request.getServerName()
        + ":" + request.getServerPort() + request.getContextPath() + "/";%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <base href="<%=basePath %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>定时策略</title>
    <link href="static/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="static/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <link href="static/css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="static/css/animate.css" rel="stylesheet">
    <link href="static/css/plugins/cron-generator/cronGen.css" rel="stylesheet">
    <link href="static/css/style.css?v=4.1.0" rel="stylesheet">
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="ibox kw-ibox float-e-margins">
        <div class="ibox-title">
            <h5>定时策略</h5>
            <div class="ibox-tools">
                <a class="collapse-link">
                    <i class="fa fa-chevron-up"></i>
                </a>
                <a class="close-link">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        <div class="ibox-content">
            <div class="col-sm-6 float-left">
                <%--<a href="view/quartz/addUI.shtml" class="btn btn-w-m btn-info" type="button">--%>
                    <%--<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增定时策略--%>
                <%--</a>--%>
                <button onclick="addQuartzClick()" class="btn btn-w-m btn-info" type="button">
                    <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增定时策略
                </button>
            </div>
            <div class="right">
                <button onclick="quartzListRefresh()" class="btn btn-w-m btn-info" type="button">
                    <i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;刷新列表
                </button>
            </div>
            <table id="quartzList" data-toggle="table"
                   data-url="quartz/getList.shtml"
                   data-query-params=queryParams data-query-params-type="limit"
                   data-pagination="true"
                   data-side-pagination="server" data-pagination-loop="false">
                <thead>
                <tr>
                    <th data-field="quartzId">策略编号</th>
                    <th data-field="quartzDescription">策略描述</th>
                    <th data-field="quartzCron">定时策略表达式</th>
                    <th data-field="action" data-formatter="actionFormatter"
                        data-events="actionEvents">操作</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
</div>
<!-- 全局js -->
<script src="static/js/jquery.min.js?v=2.1.4"></script>
<script src="static/js/plugins/cron-generator/cronGen.js"></script>
<script src="static/js/bootstrap.min.js?v=3.3.6"></script>
<!-- jQuery Validation plugin javascript-->
<script src="static/js/plugins/validate/jquery.validate.min.js"></script>
<script src="static/js/plugins/validate/messages_zh.min.js"></script>
<!-- layer javascript -->
<script src="static/js/plugins/layer/layer.min.js"></script>
<!-- 自定义js -->
<script src="static/js/content.js?v=1.0.0"></script>
<!-- Bootstrap table -->
<script src="static/js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="static/js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
<script src="static/js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="static/js/my/cronValidate.js"></script>
<script src="static/js/my/quartz.js"></script>
</body>
</html>
