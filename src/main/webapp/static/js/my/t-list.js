$(document).ready(function () {
    $.ajax({
        type: 'POST',
        async: false,
        url: 'trans/monitor/getAllMonitorTrans.shtml',
        data: {},
        success: function (data) {
            console.log(data);
            $("#allTrans").text(data);
        },
        error: function () {
            alert("请求失败！请刷新页面重试");
        },
        dataType: 'json'
    });
    $.ajax({
        type: 'POST',
        async: false,
        url: 'trans/monitor/getAllSuccess.shtml',
        data: {},
        success: function (data) {
            console.log(data);
            $("#allSuccess").text(data);
        },
        error: function () {
            alert("请求失败！请刷新页面重试");
        },
        dataType: 'json'
    });
    $.ajax({
        type: 'POST',
        async: false,
        url: 'trans/monitor/getAllFail.shtml',
        data: {},
        success: function (data) {
            $("#allFail").text(data);
        },
        error: function () {
            alert("请求失败！请刷新页面重试");
        },
        dataType: 'json'
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

function actionFormatter(value, row, index) {
    return ['<a class="btn btn-primary btn-xs" id="viewDetail" type="button"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;查看详细</a>'].join('');
};
window.actionEvents = {
    'click #viewDetail' : function(e, value, row, index) {
        location.href="view/trans/record/listUI.shtml?transId=" + row.monitorTrans;
        /*
        layer.open({
            type: 2,
            title: 'iframe父子操作',
            maxmin: true,
            shadeClose: true, //点击遮罩关闭层
            area : ['800px' , '520px'],
            content: "view/trans/record/listUI.shtml?transId=" + row.monitorTrans
        });
        */
    },
};
function queryParams(params) {
    var temp = {limit: 10, offset: params.offset};
    return temp;
};

function search(){
    window.location.reload();
};