var formSubmitType = 1; //1：添加， 2：更新
var quartzFormBoxObj = function () {
    var curHtml = '        <div id="quartzFormBox" class="ibox-content">\n' +
        '            <form class="form-horizontal m-t" id="QuartzForm">\n' +
        '                <input type="hidden" name="quartzId" id="quartzId" value="0">\n' +
        '                <div class="form-group">\n' +
        '                    <label class="col-sm-3 control-label">策略描述：</label>\n' +
        '                    <div class="col-sm-7">\n' +
        '                        <input id="quartzDescription" name="quartzDescription" type="text" placeholder="请输入策略描述" class="form-control" aria-required="true">\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="form-group">\n' +
        '                    <label class="col-sm-3 control-label">定时策略：</label>\n' +
        '                    <div class="col-sm-7">\n' +
        '                        <input id="quartzCron" readonly name="quartzCron" placeholder="请选择定时任务的cron编码" class="form-control" aria-required="true">\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </form>\n' +
        '        </div>';
    var curObj = $(curHtml);

    return curObj;
}();

function actionFormatter(value, row, index) {
    return ['<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
        '&nbsp;&nbsp;',
        '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
};
window.actionEvents = {
    'click #edit' : function(e, value, row, index) {
        var quartzId = row.quartzId;
        //location.href = "view/quartz/editUI.shtml?quartzId=" + quartzId;
        var htmlStr = quartzFormBoxObj.prop("outerHTML");
        layer.open({
            type: 1,
            title: "编辑定时策略",
            area: ['85%', '100%'], //宽高
            maxmin: true,
            content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            success: function (layero, index) {
                var formBox = $("#quartzFormBox");
                formBox.find("#quartzCron").cronGen({
                    direction : 'left'
                });
                addFormValidate(formBox);

                //填充表单
                fullForm(row);
            },
            btn: ['保存', '取消', '重置'],
            yes: function (index, layero) {
                formSubmitType = 2;
                $("#QuartzForm").submit();
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
            btn3: function (index, layero) {
                //重置表单
                $("#QuartzForm")[0].reset();
            }
        });
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
                    url: 'quartz/delete.shtml',
                    data: {
                        "quartzId": row.quartzId
                    },
                    success: function (data) {
                        //location.replace(location.href);
                        quartzListRefresh();
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

function queryParams(params) {
    var temp = { limit: 10, offset: params.offset };
    return temp;
};

function getIdSelections() {
    var $userList = $('#userList');
    return $.map($userList.bootstrapTable('getSelections'), function (row) {
        return row.quartzId
    });
}

//填充表单
var fullForm = function(data){
    var kQuartz = data;
    $("#quartzId").val(kQuartz.quartzId);
    $("#quartzDescription").val(kQuartz.quartzDescription);
    $("#quartzCron").val(kQuartz.quartzCron);
};

function addFormValidate(obj) {
    var icon = "<i class='fa fa-times-circle'></i> ";
    var $formObj = obj.find("#QuartzForm");
    $formObj.validate({
        rules: {
            quartzDescription: {
                required: true,
                maxlength: 50
            },
            quartzCron: {
                required: true,
                //自定义的cron表达式格式验证
                cronValidate: true
            }
        },
        messages: {
            quartzDescription: {
                required: icon + "请输入定时策略描述",
                maxlength: icon + "策略描述不能超过50个字符"
            },
            quartzCron: {
                required: icon + "请输入定时策略表达式"
            }
        },
        submitHandler:function(form){
            if(formSubmitType === 1){   //添加
                $.post("quartz/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                    var result = JSON.parse(data);
                    if(result.status == "success"){
                        layer.msg('添加成功',{
                            time: 1500,
                            icon: 6
                        });
                        setTimeout(function(){
                            //location.href = "view/quartz/listUI.shtml";
                            layer.closeAll();
                            quartzListRefresh();
                        },1500);
                    }else {
                        layer.msg(result.message, {icon: 2});
                    }
                });
            }else if(formSubmitType === 2){ //编辑
                $.post("quartz/update.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                    var result = JSON.parse(data);
                    if(result.status == "success"){
                        layer.msg('更新成功',{
                            time: 1500,
                            icon: 6
                        });
                        setTimeout(function(){
                            layer.closeAll();
                            quartzListRefresh();
                        },1500);
                    }else {
                        layer.msg(result.message, {icon: 2});
                    }
                });
            }

        }
    });
}

/**
 * 添加定时策略按钮点击事件
 */
function addQuartzClick() {
    var htmlStr = quartzFormBoxObj.prop("outerHTML");
    layer.open({
        type: 1,
        title: "添加定时策略",
        area: ['85%', '100%'], //宽高
        maxmin: true,
        content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        success: function (layero, index) {
            var formBox = $("#quartzFormBox");
            formBox.find("#quartzCron").cronGen({
                direction : 'left'
            });
            addFormValidate(formBox);
        },
        btn: ['保存', '取消'],
        yes: function (index, layero) {
            formSubmitType = 1;
            $("#QuartzForm").submit();
        },
        btn2: function (index, layero) {
            layer.close(index);
        },
    });
}

/**
 * 刷新列表
 */
function quartzListRefresh() {
    $('#quartzList').bootstrapTable('refresh', "quartz/getList.shtml");
}

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"
});