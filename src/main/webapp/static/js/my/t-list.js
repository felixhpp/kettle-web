$(document).ready(function () {
    var transMonitorTable;
    var defaultColunms = function () {
        return [
            {title: '记录编号', field: 'monitorId', align: 'center', valign: 'middle',width:'50px'},
            {title: '转换名称', field: 'monitorTrans', align: 'center', valign: 'middle', formatter: MonitorTransFormatter, sortable: false},
            {title: '转换执行成功次数', field: 'monitorSuccess', align: 'center', valign: 'middle', sortable: false},
            {title: '转换执行失败次数', field: 'monitorFail', align: 'center', valign: 'middle', sortable: false},
            {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
        ];
    };
    UtilsJS.AjaxRequest({
        async: true,
        url: 'trans/monitor/getAllMonitorTrans.shtml',
        data:{},
        success:function (data) {
            $("#allTrans").text(data.data);
        }
    });
    UtilsJS.AjaxRequest({
        async: true,
        url: 'trans/monitor/getAllSuccess.shtml',
        data:{},
        success:function (data) {
            $("#allSuccess").text(data.data);
        }
    });
    UtilsJS.AjaxRequest({
        async: true,
        url: 'trans/monitor/getAllFail.shtml',
        data:{},
        success:function (data) {
            $("#allFail").text(data.data);
        }
    });

    transMonitorTable = new UtilsJS.BSTable("transMonitorList", "trans/monitor/getList.shtml", defaultColunms());
    transMonitorTable.init();
});
function MonitorTransFormatter(value, row, index){
    var MonitorTrans = "";
    UtilsJS.AjaxRequest({
        async: false,
        url: 'trans/monitor/getAllFail.shtml',
        data:{
            "transId": value
        },
        success:function (data) {
            var Trans = data.data;
            MonitorTrans = Trans.transName;
        }
    });

    return MonitorTrans;
};

function actionFormatter(value, row, index) {
    return ['<a class="btn btn-primary btn-xs" id="viewDetail" type="button"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;查看详细</a>'].join('');
};
window.actionEvents = {
    'click #viewDetail' : function(e, value, row, index) {
        location.href="view/trans/record/listUI.shtml?transId=" + row.monitorTrans;
    },
};

function search(){
    window.location.reload();
};