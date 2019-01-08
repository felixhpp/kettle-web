$(function () {
    var formSubmitType = 0; //1：添加， 2：更新
    var repositoryTable;
    var repositoryFormHtmlObj = function () {
        var curHtml = '    <div id="addRepositoryBox" class="ibox-content">\n' +
            '        <form id="RepositoryForm" class="form-horizontal m-t" novalidate="novalidate">\n' +
            '                <input type="hidden" name="repositoryId" id="repositoryId" value="0">\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库名称：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="repositoryName" name="repositoryName" type="text" placeholder="请输入资源库名称" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">登录资源库用户名：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="repositoryUsername" name="repositoryUsername" type="text" placeholder="请输入登录资源库用户名" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">登录资源库密码：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="repositoryPassword" name="repositoryPassword" type="password" placeholder="请输入登录资源库密码" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库类型：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <select id="repositoryType" name="repositoryType" class="form-control"></select>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库访问模式 ：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <select id="databaseAccess" name="databaseAccess" class="form-control"></select>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库主机名或者IP地址：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="databaseHost" name="databaseHost" type="text" placeholder="请输入资源库数据库主机名或者IP地址" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库端口号：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="databasePort" name="databasePort" type="text" placeholder="请输入资源库数据库端口号" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库名称：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="databaseName" name="databaseName" type="text" placeholder="请输入资源库数据库名称" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库登录账号：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="databaseUsername" name="databaseUsername" type="text" placeholder="请输入资源库数据库登录账号" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <label class="col-sm-3 control-label">资源库数据库登录密码：</label>\n' +
            '                <div class="col-sm-7">\n' +
            '                    <input id="databasePassword" name="databasePassword" type="password" placeholder="请输入资源库数据库登录密码" class="form-control" aria-required="true"></div>\n' +
            '            </div>\n' +
            '            <div class="form-group">\n' +
            '                <div class="col-sm-9 col-sm-offset-3">\n' +
            '                    <button class="btn btn-w-m btn-primary" type="button" onclick="testConnection()">\n' +
            '                        <i class="fa fa-check" aria-hidden="true"></i>&nbsp;测试连接</button>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </form>\n' +
            '    </div>';
        var curObj = $(curHtml);

        bindSelectOptopns(curObj);

        return curObj;
    }();
    window.actionEvents = {
        'click #edit' : function(e, value, row, index) {
            var repositoryId = row.repositoryId;
            //location.href = "view/repository/editUI.shtml?repositoryId=" + repositoryId;
            var htmlStr = repositoryFormHtmlObj.prop("outerHTML");

            layer.open({
                type: 1,
                title: "编辑数据库资源库",
                area: ['85%', '100%'], //宽高
                maxmin: true,
                content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                success: function (layero, index) {
                    var formBox = $("#addRepositoryBox");
                    addFormValidate(formBox);
                    //填充表单
                    fullForm(row);
                },
                btn: ['保存', '取消', '重置'],
                yes: function (index, layero) {
                    formSubmitType = 2;
                    $("#RepositoryForm").submit();
                },
                btn2: function (index, layero) {
                    layer.close(index);
                },
                btn3: function (index, layero) {
                    //重置表单
                    $("#RepositoryForm")[0].reset();
                },
            });

        },
        'click #delete' : function(e, value, row, index) {
            layer.confirm('确定删除该单位？', {
                    btn: ['确定', '取消']
                },
                function(index){
                    layer.close(index);
                    UtilsJS.AjaxRequest({
                        url: 'repository/database/delete.shtml',
                        data:{
                            "repositoryId": row.repositoryId
                        },
                        success:function (data) {
                            layer.msg('删除成功',{
                                time: 1500,
                                icon: 6
                            });
                            setTimeout(function(){
                                repositoryListRefresh();
                            },1500);
                        }
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
            {title: '资源库编号', field: 'repositoryId', align: 'center', valign: 'middle',width:'50px'},
            {title: '资源库名称', field: 'repositoryName', align: 'center', valign: 'middle', formatter: repositoryNameFormatter, sortable: false},
            {title: '资源库主机名或IP地址', field: 'databaseHost', align: 'center', valign: 'middle', sortable: false},
            {title: '资源库数据库名称', field: 'databaseName', align: 'center', valign: 'middle', sortable: false},
            {title: '资源库更新时间', field: 'editTime', align: 'center', valign: 'middle', sortable: false},
            {title: '操作', align: 'center', valign: 'middle', formatter: actionFormatter,events:actionEvents}
        ];
   };

    function repositoryNameFormatter(value, row, index){
        if (value.length > 15){
            var newValue = value.substring(0, 14);
            return newValue + "……";
        } else {
            return value;
        }
    };


    function actionFormatter(value, row, index) {
        return ['<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;编辑</a>',
            '&nbsp;&nbsp;',
            '<a class="btn btn-danger btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'].join('');
    };

    //填充表单
    function fullForm(data){
        var kRepository = data;
        $("#repositoryId").val(kRepository.repositoryId);
        $("#repositoryName").val(kRepository.repositoryName);
        $("#repositoryUsername").val(kRepository.repositoryUsername);
        $("#repositoryPassword").val(kRepository.repositoryPassword);
        $("#repositoryType").find("option[value=" + kRepository.repositoryType + "]").prop("selected",true);
        $("#databaseAccess").find("option[value=" + kRepository.databaseAccess + "]").prop("selected",true);
        $("#databaseHost").val(kRepository.databaseHost);
        $("#databasePort").val(kRepository.databasePort);
        $("#databaseName").val(kRepository.databaseName);
        $("#databaseUsername").val(kRepository.databaseUsername);
        $("#databasePassword").val(kRepository.databasePassword);
    };

    repositoryTable = new UtilsJS.BSTable("repositoryList", "repository/database/getList.shtml", defaultColunms());
    repositoryTable.init();

    /**
     * 添加资源库按钮点击事件
     */
    function addRepositoryClick() {
        var htmlStr = repositoryFormHtmlObj.prop("outerHTML");
        var index = layer.open({
            type: 1,
            title: "添加数据库资源库",
            area: ['85%', '100%'], //宽高
            maxmin: true,
            content:htmlStr,  //注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            success: function (layero, index) {
                var formBox = $("#addRepositoryBox");
                addFormValidate(formBox);
            },
            btn: ['保存', '取消'],
            yes: function (index, layero) {
                formSubmitType = 1;
                $("#RepositoryForm").submit();
            },
            btn2: function (index, layero) {
                layer.close(index);
            },
        });
    };
    /**
     * 刷新列表
     */
    function repositoryListRefresh() {
        repositoryTable.refresh();
    };


    $("#addRepositoryBtn").click(function () {
        addRepositoryClick();
    });

    $("#refreshBtn").click(function () {
        repositoryListRefresh();
    });
    function addFormValidate(obj) {
        var icon = "<i class='fa fa-times-circle'></i> ";
        var formObj = obj.find("#RepositoryForm");
        formObj.validate({
            rules: {
                repositoryName: {
                    required: true,
                    maxlength: 50
                },
                repositoryUsername: {
                    required: true,
                    maxlength: 50
                },
                repositoryPassword: {
                    required: true,
                    maxlength: 50
                },
                repositoryType: {
                    required: true
                },
                databaseAccess: {
                    required: true
                },
                databaseHost: {
                    required: true,
                    maxlength: 50
                },
                databasePort: {
                    required: true,
                    maxlength: 10
                },
                databaseName: {
                    required: true,
                    maxlength: 20
                },
                databaseUsername: {
                    required: true,
                    maxlength: 50
                },
                databasePassword: {
                    required: true,
                    maxlength: 50
                }
            },
            messages: {
                repositoryName: {
                    required: icon + "请输入资源库名称",
                    maxlength: icon + "资源库名称不能超过50个字符"
                },
                repositoryUsername: {
                    required: icon + "请输入登录资源库用户名",
                    maxlength: icon + "登录资源库用户名不能超过50个字符"
                },
                repositoryPassword: {
                    required: icon + "请输入登录资源库密码",
                    maxlength: icon + "登录资源库密码不能超过50个字符"
                },
                repositoryType: {
                    required: icon + "请选择资源库类型"
                },
                databaseAccess: {
                    required: icon + "请选择资源库数据库访问模式"
                },
                databaseHost: {
                    required: icon + "请输入资源库数据库主机名或者IP地址",
                    maxlength: icon + "作业描述不能超过50个字符"
                },
                databasePort: {
                    required: icon + "请输入资源库数据库端口号",
                    maxlength: icon + "资源库数据库端口号不能超过10个字符"
                },
                databaseName: {
                    required: icon + "请输入资源库数据库名称",
                    maxlength: icon + "资源库数据库名称不能超过20个字符"
                },
                databaseUsername: {
                    required: icon + "请输入资源库数据库登录账号",
                    maxlength: icon + "资源库数据库登录账号不能超过50个字符"
                },
                databasePassword: {
                    required: icon + "请输入资源库数据库登录密码",
                    maxlength: icon + "资源库数据库登录密码不能超过50个字符"
                }
            },
            submitHandler:function(form){
                //做判断
                if (testConnection()){
                    if(formSubmitType === 1){   //添加
                        UtilsJS.PostRequeat("repository/database/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                            layer.msg('添加成功',{
                                time: 1500,
                                icon: 6
                            });
                            setTimeout(function(){
                                layer.closeAll();
                                repositoryListRefresh();
                            },1500);
                        });

                    }else if(formSubmitType === 2){ //更新
                        UtilsJS.PostRequeat("repository/database/update.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                            layer.msg('更新成功',{
                                time: 1500,
                                icon: 6
                            });
                            setTimeout(function(){
                                layer.closeAll();
                                repositoryListRefresh();
                            },1500);
                        });

                    }

                }
            }
        });
    }

    /**
     * 自定义表单验证规则
     */
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
});



function bindSelectOptopns(obj) {
    UtilsJS.AjaxRequest({
        async: true,
        url: 'repository/database/getType.shtml',
        data:{},
        success:function (data) {
            var repositoryList = data.data;
            obj.find("#repositoryType").append('<option value="">请选择资源库类型</option>');

            for (var i=0; i<repositoryList.length; i++){
                obj.find("#repositoryType").append('<option value="' + repositoryList[i].repositoryTypeCode + '">' + repositoryList[i].repositoryTypeDes + '</option>');
            }
        }
    });

    UtilsJS.AjaxRequest({
        async: true,
        url: 'repository/database/getAccess.shtml',
        data:{},
        success:function (data) {
            var databaseAccessList = data.data;
            var databaseAccessObj = obj.find("#databaseAccess");
            databaseAccessObj.children().remove();
            databaseAccessObj.append('<option value="">请选择资源库数据库访问模式</option>');
            for (var i=0; i<databaseAccessList.length; i++){
                databaseAccessObj.append('<option value="' + databaseAccessList[i] + '">' + databaseAccessList[i] + '</option>');
            }
        }
    });

}




function getIdSelections() {
    var $repositoryList = $('#repositoryList');
    return $.map($repositoryList.bootstrapTable('getSelections'), function (row) {
        return row.repositoryId
    });
}

/**
 * 测试连接
 * @returns {boolean}
 */
var testConnection = function (){
    var kRepository = new FormData(document.getElementById("RepositoryForm"));
    var returnType = false;
    UtilsJS.AjaxRequest({
        async: false,
        url: 'repository/database/ckeck.shtml',
        data:kRepository,
        processData:false,
        contentType:false,
        success:function (data) {
            returnType = true;
            layer.msg("连接成功", {icon: 6});
        },
        error: function () {
            layer.msg("连接失败，请检查参数重试。", {icon: 5});
        },
    });
    // $.ajax({
    //     type: 'POST',
    //     async: false,
    //     url: 'repository/database/ckeck.shtml',
    //     data: kRepository,
    //     processData:false,
    //     contentType:false,
    //     success: function (data) {
    //         if (data.status == "success" && data.data == "success"){
    //             returnType = true;
    //             layer.msg("连接成功", {icon: 6});
    //         }else {
    //             layer.msg("连接失败，请检查参数重试", {icon: 5});
    //         }
    //     },
    //     error: function () {
    //         layer.msg("连接失败，请检查参数重试。" + data.data, {icon: 5});
    //     },
    //     dataType: 'json'
    // });
    return returnType;
};





