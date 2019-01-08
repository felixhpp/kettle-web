$(document).ready(function () {
    var transMonitorTabel;
    var jobMonitorTabel;

    var transColunms = function () {
        return [
            {title: '记录编号', field: 'monitorId', align: 'center', valign: 'middle',width:'50px'},
            {title: '转换名称', field: 'monitorTrans', align: 'center', valign: 'middle', formatter: MonitorTransFormatter, sortable: false},
            {title: '转换执行成功次数', field: 'monitorSuccess', align: 'center', valign: 'middle', sortable: false}
        ];
    };
    var jobColunms = function () {
        return [
            {title: '记录编号', field: 'monitorId', align: 'center', valign: 'middle',width:'50px'},
            {title: '作业名称', field: 'monitorJob', align: 'center', valign: 'middle', formatter: MonitorJobFormatter, sortable: false},
            {title: '作业执行成功次数', field: 'monitorSuccess', align: 'center', valign: 'middle', sortable: false}
        ];
    };

	/*获取全部在监控的任务*/
    UtilsJS.AjaxRequest({
        async: false,
        url: 'main/allRuning.shtml',
        data:{},
        success:function (data) {
            $("#allNum").text(data.data);
        }
    });

	/*获取在监控的转换数*/
    UtilsJS.AjaxRequest({
        async: false,
        url: 'trans/monitor/getAllMonitorTrans.shtml',
        data:{},
        success:function (data) {
            $("#transNum").text(data.data);
        }
    });

	/*获取在监控的作业数*/
    UtilsJS.AjaxRequest({
        async: false,
        url: 'job/monitor/getAllMonitorJob.shtml',
        data:{},
        success:function (data) {
            $("#jobNum").text(data.data);
        }
    });
	
	$.ajax({
        type: 'POST',
        async: false,
        url: 'main/getKettleLine.shtml',
        data: {},
        success: function (data) {
            //console.log(data.data.trans);
            var lineChart = echarts.init(document.getElementById("kettleLine"));
    	    var lineoption = {
    	        title : {
    	            text: '7天内作业和转换的监控状况'
    	        },
    	        tooltip : {
    	            trigger: 'axis'
    	        },
    	        legend: {
    	            data:['作业','转换']
    	        },
    	        xAxis : [
    	            {
    	                type : 'category',
    	                boundaryGap : false,
    	                data : data.data.legend
    	            }
    	        ],
    	        yAxis : [
    	            {
    	                type : 'value',
    	                axisLabel : {
    	                    formatter: '{value}'
    	                }
    	            }
    	        ],
    	        series : [
    	            {
    	                name:data.data.trans.name,
    	                type:'line',
    	                data:data.data.trans.data,
    	                markPoint : {
    	                    data : [
    	                        {type : 'max', name: '最大值'},
    	                        {type : 'min', name: '最小值'}
    	                    ]
    	                },
    	            },
    	            {
    	                name:data.data.job.name,
    	                type:'line',
    	                data:data.data.job.data,
    	                markPoint : {
    	                    data : [
    	                    	{type : 'max', name: '最大值'},
    	                        {type : 'min', name: '最小值'}
    	                    ]
    	                },
    	            }
    	        ]
    	    };
    	    lineChart.setOption(lineoption);
    	    $(window).resize(lineChart.resize);
        },
        error: function () {
        	window.location.href="view/loginUI.shtml";
        },
        dataType: 'json'
    });

    transMonitorTabel = new UtilsJS.BSTable("transMonitorList", "main/getTransList.shtml", transColunms());
    transMonitorTabel.init();
    jobMonitorTabel = new UtilsJS.BSTable("jobMonitorList", "main/getJobList.shtml", jobColunms());
    jobMonitorTabel.init();
    function refreshTrans() {
        transMonitorTabel.refresh();
    };

    function refreshJobs() {
        jobMonitorTabel.refresh();
    };

    $("#refreshTransBtn").on('click',function () {
        refreshTrans();
    });

    $("#refreshJobsBtn").on('click', function () {
        refreshJobs();
    });
});

function MonitorTransFormatter(value, row, index){
	var MonitorTrans = "";
	$.ajax({
        type: 'POST',
        async: false,
        url: 'trans/getTrans.shtml',
        data: {
            "transId": value          
        },
        success: function (data) {
        	var Trans = data.data;
        	MonitorTrans = Trans.transName;		        	 				        	 
        },
        error: function () {
            alert("系统出现问题，请联系管理员");
        },
        dataType: 'json'
    });
	return MonitorTrans;
}; 
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
