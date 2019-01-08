<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<base href="<%=basePath %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>转换列表</title>
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
                <h5>转换列表</h5>
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
	            	<%--<a href="view/trans/rAddUI.shtml" class="btn btn-w-m btn-info" type="button">--%>
	            		<%--<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增资源库转换--%>
            		<%--</a>--%>
                    <button onclick="addRepositoryTranClick()" class="btn btn-w-m btn-info" type="button">
                        <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增资源库转换
                    </button>
                    <button onclick="addFileTranClick()" class="btn btn-w-m btn-info" type="button">
                        <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增文件转换
                    </button>
            		<%--<a href="view/trans/fAddUI.shtml" class="btn btn-w-m btn-info" type="button">--%>
	            		<%--<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新增文件转换--%>
            		<%--</a>--%>
            	</div>
            	<div class="right">	
	            	<button id="transListRefreshBtn" class="btn btn-w-m btn-info" type="button">
	            		<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;刷新列表
            		</button>
            	</div>
                <table id="transList"></table>
                <%--<table id="transList" data-toggle="table"--%>
					<%--&lt;%&ndash;data-url="trans/getList.shtml"&ndash;%&gt;--%>
                    <%--data-url="trans/getListTransView.shtml"--%>
					<%--data-query-params=queryParams data-query-params-type="limit"--%>
					<%--data-pagination="true"--%>
					<%--data-side-pagination="server" data-pagination-loop="false">--%>
					<%--<thead>--%>
						<%--<tr>--%>
							<%--<th data-field="transId">转换编号</th>--%>
							<%--<th data-field="transName" data-formatter="transNameFormatter">转换名称</th>--%>
							<%--<th data-field="editTime">转换更新时间</th>--%>
                            <%--<th data-field="quartzDescription">定时策略描述</th>--%>
                            <%--<th data-field="quartzCron">定时策略表达式</th>--%>
							<%--<th data-field="transStatus" data-formatter="transStatusFormatter">转换状态</th>--%>
							<%--<th data-field="action" data-formatter="actionFormatter"--%>
								<%--data-events="actionEvents">操作</th>--%>
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
            var transTable;
            window.actionEvents = {
                'click #start' : function(e, value, row, index) {
                    layer.confirm('确定启动该转换？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            UtilsJS.AjaxRequest({
                                url: 'trans/start.shtml',
                                data:{
                                    "transId": row.transId
                                },
                                success:function (data) {
                                    transListRefresh();
                                }
                            });

                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
                'click #stop' : function(e, value, row, index) {
                    layer.confirm('确定停止该转换？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            UtilsJS.AjaxRequest({
                                url: 'trans/stop.shtml',
                                data:{
                                    "transId": row.transId
                                },
                                success:function (data) {
                                    transListRefresh();
                                }
                            });

                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
                'click #edit' : function(e, value, row, index) {
                    var transId = row.transId;
                    //location.href = "view/trans/editUI.shtml?transId=" + transId;
                    openTranFormIFrame(3, transId);
                },
                'click #delete' : function(e, value, row, index) {
                    layer.confirm('确定删除该单位？', {
                            btn: ['确定', '取消']
                        },
                        function(index){
                            layer.close(index);
                            UtilsJS.AjaxRequest({
                                url: 'trans/delete.shtml',
                                data:{
                                    "transId": row.transId
                                },
                                success:function (data) {
                                    transListRefresh();
                                }
                            });
                        },
                        function(){
                            layer.msg('取消操作');
                        }
                    );
                },
            };
            function actionFormatter(value, row, index) {
                if (row.transStatus == "1"){
                    return ['<a class="btn btn-primary btn-xs" id="stop" type="button"><i class="fa fa-stop" aria-hidden="true"></i>&nbsp;停止</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
                        '&nbsp;&nbsp;',
                        '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
                }else if (row.transStatus == "2"){
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
            function transNameFormatter(value, row, index){
                if (value.length > 15){
                    var newValue = value.substring(0, 14);
                    return newValue + "……";
                } else {
                    return value;
                }
            };
            function transStatusFormatter(value, row, index){
                if (value == "1"){
                    return "正在运行";
                }else if (value == "2"){
                    return "已停止";
                }else {
                    return "未定义";
                }
            };

            var defaultColunms = function () {
                return [
                    {title: '转换编号', field: 'transId', align: 'center', valign: 'middle',width:'50px'},
                    {title: '转换名称', field: 'transName', align: 'center', valign: 'middle', formatter: transNameFormatter, sortable: false},
                    {title: '转换更新时间', field: 'editTime', align: 'center', valign: 'middle', sortable: false},
                    {title: '定时策略描述', field: 'quartzDescription', align: 'center', valign: 'middle', sortable: false},
                    {title: '定时策略表达式', field: 'quartzCron', align: 'center', valign: 'middle', sortable: false},
                    {title: '转换状态', field: 'transStatus', align: 'center', valign: 'middle', formatter: transStatusFormatter, sortable: false},
                    {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
                ];
            };

            jobTable = new UtilsJS.BSTable("transList", "trans/getListTransView.shtml", defaultColunms());
            jobTable.init();

            function transListRefresh(){
                jobTable.refresh();
            };

            $("#transListRefreshBtn").click(function () {
                transListRefresh();
            });
        });

        /**
         *  添加资源库转换
         */
        function addRepositoryTranClick() {
            openTranFormIFrame(1);
        };

        /**
         * 添加文件转换
         */
        function addFileTranClick() {
            openTranFormIFrame(2);
        };

        /**
         * 以IFrame的方式打开转换表单
         * @param type 类型 1：新增资源库tran 2:新增文件tran 3: 编辑tran
         * @param transId 转换ID
         */
        function openTranFormIFrame(type, transId) {
            var url = '';
            if(type === 1){
                url = 'view/trans/rAddUI.shtml';
            }else if(type === 2){
                url = 'view/trans/fAddUI.shtml';
            }else if(type === 3){
                url = 'view/trans/editUI.shtml?transId=' + transId;
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
                    layero.find("iframe")[0].contentWindow.$("#RepositoryTransForm").submit();
                },
                btn2: function (index, layero) {
                    layer.close(index);
                },
            });
        };
    </script>
</body>
</html>