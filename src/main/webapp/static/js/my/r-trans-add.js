var treeData;
	
$(document).ready(function () {
    UtilsJS.AjaxRequest({
        async: false,
        url: 'repository/database/getSimpleList.shtml',
        data:{},
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#transRepositoryId").append('<option value="' + data[i].repositoryId + '">' + data[i].repositoryName + '</option>');
            }
        }
    });
    UtilsJS.AjaxRequest({
        async: false,
        url: 'quartz/getSimpleList.shtml',
        data:{},
        success:function (data) {
            for (var i=0; i<data.length; i++){
                $("#transQuartz").append('<option value="' + data[i].quartzId + '">' + data[i].quartzDescription + '</option>');
            }
        }
    });

	$("#customerQuarz").cronGen({
    	direction : 'left'
	});
});

$("#transRepositoryId").change(function(){
	var repositoryId = $(this).val(); 
	if (repositoryId > 0){
        UtilsJS.AjaxRequest({
            async: false,
            url: 'repository/database/getTransTree.shtml',
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

$("#transPath").click(function(){	
	var $transRepositoryId = $("#transRepositoryId").val();
	if (treeData != null){
		var index = layer.open({
			type: 1,
			title: '请选择转换',
			skin: 'layui-layer-rim',
			content: '<div id="repositoryTree"></div>'
		});
		$('#repositoryTree').jstree({
            'core': {
                'data': treeData
            },
            'plugins' : ["search"]
        }).bind('select_node.jstree', function (event, data) {  //绑定的点击事件
        	var transNode = data.node;
        	if (transNode.icon == "none"){
        		var transPath = "";
        		//证明是最子节点
        		for (var i = 0; i < treeData.length; i++){
        			if (treeData[i].id == transNode.parent){
        				transPath = treeData[i].path;
        			}
        		}
        		for (var i = 0; i < treeData.length; i++){
        			if (treeData[i].id == transNode.id){
        				transPath += "/" + treeData[i].text;
        			}	
        		}
        		layer.close(index);
        		$("#transPath").val(transPath);
        	}
        });	
	}else if($transRepositoryId != null && treeData == null){
		layer.msg("请等待资源库加载");
	}else if($transRepositoryId == null){
		layer.msg("请先选择资源库");
	}	
});

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
        	transPath: {
        		required: true,
        	},
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
        	transPath: {
        		required: icon + "请选择转换",
        	},
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
            UtilsJS.PostRequeat("trans/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                layer.msg('添加成功',{
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
