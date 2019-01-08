var treeData;
	
$(document).ready(function () {
    UtilsJS.AjaxRequest({
        async: false,
        url: 'repository/database/getSimpleList.shtml',
        data:{},
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#jobRepositoryId").append('<option value="' + data[i].repositoryId + '">' + data[i].repositoryName + '</option>');
            }
        }
    });

    UtilsJS.AjaxRequest({
        async: false,
        url: 'quartz/getSimpleList.shtml',
        data:{},
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#jobQuartz").append('<option value="' + data[i].quartzId + '">' + data[i].quartzDescription + '</option>');
            }
        }
    });

	$("#customerQuarz").cronGen({
    	direction : 'left'
	});
});

$("#jobRepositoryId").change(function(){
	var repositoryId = $(this).val(); 
	if (repositoryId > 0){
        UtilsJS.AjaxRequest({
            async: false,
            url: 'repository/database/getJobTree.shtml',
            data:{
                repositoryId : repositoryId
            },
            success:function (data) {
                treeData = data;
            }
        });

	}else{
		treeData = null;	
	}  
});

$("#jobPath").click(function(){		
	var $jobRepositoryId = $("#jobRepositoryId").val();
	if (treeData != null){
		var index = layer.open({
			type: 1,
			title: '请选择作业',
			skin: 'layui-layer-rim',
			content: '<div id="repositoryTree"></div>'
		});
		$('#repositoryTree').jstree({
            'core': {
                'data': treeData
            },
            'plugins' : ["search"]
        }).bind('select_node.jstree', function (event, data) {  //绑定的点击事件
        	var jobNode = data.node;
        	if (jobNode.icon == "none"){
        		var jobPath = "";
        		//证明是最子节点
        		for (var i = 0; i < treeData.length; i++){
        			if (treeData[i].id == jobNode.parent){
        				jobPath = treeData[i].path;
        			}
        		}
        		for (var i = 0; i < treeData.length; i++){
        			if (treeData[i].id == jobNode.id){
        				jobPath += "/" + treeData[i].text;
        			}	
        		}
        		layer.close(index);
        		$("#jobPath").val(jobPath);
        	}
        });	
	}else if($jobRepositoryId != null && treeData == null){
		layer.msg("请等待资源库加载");
	}else if($jobRepositoryId == null){
		layer.msg("请先选择资源库");
	}
});

$("#changeQuartz").click(function(){
	$("#default").toggle();
	$("#custom").toggle();
	$("#jobQuartz").val("");
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
    $("#RepositoryJobForm").validate({
        rules: {
        	jobPath: {
        		required: true,
        	},
        	jobName: {
        		required: true,
        		maxlength: 50
        	},
        	jobLogLevel: {
        		required: true,
        	},
        	jobDescription: {
        		maxlength: 500
        	}
        },
        messages: {
        	jobPath: {
        		required: icon + "请选择作业",
        	},
        	jobName: {
        		required: icon + "请输入作业名称",
        		maxlength: icon + "作业名称不能超过50个字符"
        	},
        	jobLogLevel: {
        		required: icon + "请选择作业的日志记录级别",
        	},
        	jobDescription: {
        		maxlength: icon + "作业描述不能超过500个字符"
        	}
        },
        submitHandler:function(form){
            UtilsJS.PostRequeat("job/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                layer.msg('添加成功',{
                    time: 1500,
                    icon: 6
                });
                setTimeout(function(){
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.jobListRefresh();
                    parent.layer.close(index);
                },1500);
            });

        } 
    });
});

var cancel = function(){
	location.href = "view/job/listUI.shtml";
}