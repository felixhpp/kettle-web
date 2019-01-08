$(document).ready(function () {
    UtilsJS.AjaxRequest({
        url: 'repository/database/getSimpleList.shtml',
        data: {},
        async: false,
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#transRepositoryId").append('<option value="' + data[i].repositoryId + '">' + data[i].repositoryName + '</option>');
            }
        }
    });

    UtilsJS.AjaxRequest({
        url: 'quartz/getSimpleList.shtml',
        data: {},
        async: false,
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#transQuartz").append('<option value="' + data[i].quartzId + '">' + data[i].quartzDescription + '</option>');
            }
        }
    });

	$("#customerQuarz").cronGen({
    	direction : 'left'
	});
	reset();
});

var reset = function(){
	var transId = $("#transId").val();

    UtilsJS.AjaxRequest({
        url: 'trans/getTrans.shtml',
        data: {
            transId : transId
        },
        async: false,
        success:function (data) {
            var Trans = data.data;
            $("#transRepositoryId").find("option[value=" + Trans.transRepositoryId + "]").prop("selected",true);
            $("#transPath").val(Trans.transPath);
            $("#transName").val(Trans.transName);
            $("#transQuartz").find("option[value=" + Trans.transQuartz + "]").prop("selected",true);
            $("#transLogLevel").find("option[value=" + Trans.transLogLevel + "]").prop("selected",true);
            $("#transDescription").val(Trans.transDescription);
        }
    });
}

$("#changeQuartz").click(function(){
	$("#default").toggle();
	$("#custom").toggle();
	$("#transQuartz").val("");
	$("#customerQuarz").val("");
});
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
$().ready(function () {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#RepositoryTransForm").validate({
        rules: {
        	transName: {
        		required: true,
        		maxlength: 50
        	},
        	transLogLevel: {
        		required: true,
        	},
        	transDescription: {
        		maxlength: 500
        	}
        },
        messages: {
        	transName: {
        		required: icon + "请输入转换名称",
        		maxlength: icon + "转换名称不能超过50个字符"
        	},
        	jobLogLevel: {
        		required: icon + "请选择转换的日志记录级别",
        	},
        	transDescription: {
        		maxlength: icon + "转换描述不能超过500个字符"
        	}
        },
        submitHandler:function(form){
            UtilsJS.PostRequeat("trans/update.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                layer.msg('更新成功',{
                    time: 1500,
                    icon: 6
                });
                setTimeout(function(){
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.transListRefresh();
                    parent.layer.close(index);
                },1500);
            });
        } 
    });
});

var cancel = function(){
	location.href = "view/trans/listUI.shtml";
}