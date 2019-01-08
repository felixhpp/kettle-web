<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<base href="<%=basePath %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作业监控记录</title>
    <link href="static/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="static/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <link href="static/css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="static/css/animate.css" rel="stylesheet">
    <link href="static/css/style.css?v=4.1.0" rel="stylesheet">
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight">
    	<div class="row">
    		<div class="col-sm-4">
                <div class="widget style1 navy-bg">
                    <div class="row">
                        <div class="col-sm-4" style="opacity:0.2">
                        	<i class="fa fa-cogs fa-5x" aria-hidden="true"></i>
                        </div>
                        <div class="col-sm-8 text-right" style="font-size:20px">
                            <span> 总作业任务数 </span>
                            <h2 class="font-bold" id="alljob"></h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="widget style1 navy-bg">
                    <div class="row">
                        <div class="col-sm-4" style="opacity:0.2">
                            <i class="fa fa-check-circle-o fa-5x" aria-hidden="true"></i>
                        </div>
                        <div class="col-sm-8 text-right" style="font-size:20px">
                            <span> 总成功次数 </span>
                            <h2 class="font-bold" id="allSuccess"></h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="widget style1 yellow-bg">
                    <div class="row">
                        <div class="col-sm-4" style="opacity:0.2">
                            <i class="fa fa-times-circle-o fa-5x" aria-hidden="true"></i>
                        </div>
                        <div class="col-sm-8 text-right" style="font-size:20px">
                            <span> 总失败次数 </span>
                            <h2 class="font-bold" id="allFail"></h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ibox kw-ibox float-e-margins">
            <div class="ibox-title">
                <h5>作业监控记录</h5>
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
            	<div class="right">	
	            	<button onclick="search()" class="btn btn-w-m btn-info" type="button">
	            		<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;刷新列表
            		</button>
            	</div>
                <table id="jobMonitorList"></table>

            </div>
        </div>
	</div>
	<!-- 全局js -->
    <script src="static/js/jquery.min.js?v=2.1.4"></script>
    <script src="static/js/bootstrap.min.js?v=3.3.6"></script>
    <!-- layer javascript -->
    <script src="static/js/plugins/layer/layer.min.js"></script>
    <!-- 自定义js -->
    <script src="static/js/content.js?v=1.0.0"></script>
    <!-- Bootstrap table -->
    <script src="static/js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="static/js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
    <script src="static/js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <script src="static/js/my/kw-utils.js"></script>
	<script>
		$(document).ready(function () {
            var jobMonitorTable;
            var defaultColunms = function () {
                return [
                    {title: '记录编号', field: 'monitorId', align: 'center', valign: 'middle',width:'50px'},
                    {title: '作业名称', field: 'monitorJob', align: 'center', valign: 'middle', formatter: MonitorJobFormatter, sortable: false},
                    {title: '作业执行成功次数', field: 'monitorSuccess', align: 'center', valign: 'middle', sortable: false},
                    {title: '作业执行失败次数', field: 'monitorFail', align: 'center', valign: 'middle', sortable: false},
                    {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
                ];
            };
            UtilsJS.AjaxRequest({
                async: true,
                url: 'job/monitor/getAllMonitorJob.shtml',
                data:{},
                success:function (data) {
                    $("#alljob").text(data.data);
                }
            });
            UtilsJS.AjaxRequest({
                async: true,
                url: 'job/monitor/getAllSuccess.shtml',
                data:{},
                success:function (data) {
                    $("#allSuccess").text(data.data);
                }
            });
            UtilsJS.AjaxRequest({
                async: true,
                url: 'job/monitor/getAllFail.shtml',
                data:{},
                success:function (data) {
                    $("#allFail").text(data.data);
                }
            });

            function MonitorJobFormatter(value, row, index){
                var MonitorJob = "";
                UtilsJS.AjaxRequest({
                    async: false,
                    url: 'job/getJob.shtml',
                    data:{
                        "jobId": value
                    },
                    success:function (data) {
                        var job = data.data;
                        MonitorJob = job.jobName;
                    }
                });

                return MonitorJob;
            };

            function actionFormatter(value, row, index) {
                return ['<a class="btn btn-primary btn-xs" id="viewDetail" type="button"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;查看详细</a>'].join('');
            };
            window.actionEvents = {
                'click #viewDetail' : function(e, value, row, index) {
                    location.href="view/job/record/listUI.shtml?jobId=" + row.monitorJob;
                },
            };

            jobMonitorTable = new UtilsJS.BSTable("jobMonitorList", "job/monitor/getList.shtml", defaultColunms());
            jobMonitorTable.init();
        });

        function search(){
            window.location.reload();
        };
		    
    </script>
</body>
</html>