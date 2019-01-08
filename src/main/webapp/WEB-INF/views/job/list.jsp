<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<base href="<%=basePath %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作业列表</title>
    <link href="static/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="static/css/font-awesome.css?v=4.4.0" rel="stylesheet">
    <link href="static/css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="static/css/animate.css" rel="stylesheet">
    <link href="static/css/style.css?v=4.1.0" rel="stylesheet">
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight">
        <div class="ibox kw-ibox float-e-margins">
            <div class="ibox-title">
                <h5>作业列表</h5>
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
	            	<%--<a href="view/job/rAddUI.shtml" class="btn btn-w-m btn-info" type="button">--%>
	            		<%--<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增资源库作业--%>
            		<%--</a>--%>
                    <button id="addRepositoryBtn" class="btn btn-w-m btn-info" type="button">
                        <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增资源库作业
                    </button>
                    <button id="addFileJobBtn" class="btn btn-w-m btn-info" type="button">
                        <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增文件作业
                    </button>
            		<%--<a href="view/job/fAddUI.shtml" class="btn btn-w-m btn-info" type="button">--%>
	            		<%--<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增文件作业--%>
            		<%--</a>--%>
            	</div>
            	<div class="right">	
	            	<button id="refreshBtn" class="btn btn-w-m btn-info" type="button">
	            		<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;刷新列表
            		</button>
            	</div>
                <table id="jobList"></table>
                <%--<table id="jobList" data-toggle="table"--%>
					<%--data-url="job/getListJobView.shtml"--%>
					<%--data-query-params=queryParams data-query-params-type="limit"--%>
					<%--data-pagination="true"--%>
					<%--data-side-pagination="server" data-pagination-loop="false">--%>
					<%--<thead>--%>
						<%--<tr>--%>
							<%--<th data-field="jobId">作业编号</th>--%>
							<%--<th data-field="jobName" data-formatter="jobNameFormatter">作业名称</th>--%>
							<%--<th data-field="editTime">作业更新时间</th>--%>
                            <%--<th data-field="quartzDescription">定时策略描述</th>--%>
                            <%--<th data-field="quartzCron">定时策略表达式</th>--%>
							<%--<th data-field="jobStatus" data-formatter="jobStatusFormatter">作业状态</th>--%>
							<%--<th data-field="action" data-formatter="actionFormatter"--%>
								<%--data-events="actionEvents">操作</th><span></span>--%>
						<%--</tr>--%>
					<%--</thead>--%>
				<%--</table>--%>
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
        ;$(function () {
            var jobTable;
            window.actionEvents = {
                'click #start' : function(e, value, row, index) {
                    layer.confirm('确定启动该作业？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            $.ajax({
                                type: 'POST',
                                async: true,
                                url: 'job/start.shtml',
                                data: {
                                    "jobId": row.jobId
                                },
                                success: function (data) {
                                    location.replace(location.href);
                                },
                                error: function () {
                                    alert("系统出现问题，请联系管理员");
                                },
                                dataType: 'json'
                            });
                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
                'click #stop' : function(e, value, row, index) {
                    layer.confirm('确定停止该作业？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            $.ajax({
                                type: 'POST',
                                async: true,
                                url: 'job/stop.shtml',
                                data: {
                                    "jobId": row.jobId
                                },
                                success: function (data) {
                                    location.replace(location.href);
                                },
                                error: function () {
                                    alert("系统出现问题，请联系管理员");
                                },
                                dataType: 'json'
                            });
                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
                'click #edit' : function(e, value, row, index) {
                    var jobId = row.jobId;
                    //location.href = "view/job/editUI.shtml?jobId=" + jobId;
                    openJobFormIFrame(3, jobId);
                },
                'click #delete' : function(e, value, row, index) {
                    layer.confirm('确定删除该单位？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            $.ajax({
                                type: 'POST',
                                async: true,
                                url: 'job/delete.shtml',
                                data: {
                                    "jobId": row.jobId
                                },
                                success: function (data) {
                                    //location.replace(location.href);
                                    jobListRefresh();
                                },
                                error: function () {
                                    alert("系统出现问题，请联系管理员");
                                },
                                dataType: 'json'
                            });
                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
            };
            var defaultColunms = function () {
                return [
                    {title: '作业编号', field: 'jobId', align: 'center', valign: 'middle',width:'50px'},
                    {title: '作业名称', field: 'jobName', align: 'center', valign: 'middle', formatter: jobNameFormatter, sortable: false},
                    {title: '作业更新时间', field: 'editTime', align: 'center', valign: 'middle', sortable: false},
                    {title: '定时策略描述', field: 'quartzDescription', align: 'center', valign: 'middle', sortable: false},
                    {title: '定时策略表达式', field: 'quartzCron', align: 'center', valign: 'middle', sortable: false},
                    {title: '作业状态', field: 'jobStatus', align: 'center', valign: 'middle', formatter: jobStatusFormatter, sortable: false},
                    {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
                ];
            };
            function jobNameFormatter(value, row, index){
                if (value.length > 15){
                    var newValue = value.substring(0, 14);
                    return newValue + "……";
                } else {
                    return value;
                }
            }
            function jobStatusFormatter(value, row, index){
                if (value == "1"){
                    return "正在运行";
                }else if (value == "2"){
                    return "已停止";
                }else {
                    return "未定义";
                }
            }
            function actionFormatter(value, row, index) {
                if (row.jobStatus == "1"){
                    return ['<a class="btn btn-primary btn-xs" id="stop" type="button"><i class="fa fa-stop" aria-hidden="true"></i>&nbsp;停止</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
                }else if (row.jobStatus == "2"){
                    return ['<a class="btn btn-primary btn-xs" id="start" type="button"><i class="fa fa-play" aria-hidden="true"></i>&nbsp;启动</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
                }else {
                    return ['<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
                }
            };
            jobTable = new UtilsJS.BSTable("jobList", "job/getListJobView.shtml", defaultColunms());
            jobTable.init();

            function jobListRefresh(){
                jobTable.refresh();
            };
            function addRepositoryJobClick() {
                openJobFormIFrame(1);
            };

            function addFileJobClick() {
                openJobFormIFrame(2);
            };

            $("#addRepositoryBtn").click(function () {
                addRepositoryJobClick();
            });

            $("#addFileJobBtn").click(function(){
                addFileJobClick();
            });

            $("#refreshBtn").click(function () {
                jobListRefresh();
            });
            /**
             * 以IFrame的方式打开作业表单
             * @param type 类型 1：新增资源库job 2:新增文件job 3: 编辑job
             * @param jobId 作业ID
             */
            function openJobFormIFrame(type, jobId) {
                var url = '';
                if(type === 1){
                    url = 'view/job/rAddUI.shtml';
                }else if(type === 2){
                    url = 'view/job/fAddUI.shtml';
                }else if(type === 3){
                    url = 'view/job/editUI.shtml?jobId=' + jobId;
                } else {
                    return;
                }

                layer.open({
                    type: 2,
                    title: false,
                    area: ['100%', '100%'],
                    maxmin: false,
                    content: url,
                    success: function (layero, index) {

                    },
                    btn: ['保存', '取消'],
                    yes: function (index, layero) {
                        layero.find("iframe")[0].contentWindow.$("#RepositoryJobForm").submit();
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                });
            };

        });


    </script>
</body>
</html>