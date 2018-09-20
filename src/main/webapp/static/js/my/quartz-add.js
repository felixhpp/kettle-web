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
    $("#QuartzForm").validate({
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
            $.post("quartz/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                var result = JSON.parse(data);
                if(result.status == "success"){
                    layer.msg('添加成功',{
                        time: 2000,
                        icon: 6
                    });
                    setTimeout(function(){
                        location.href = "view/quartz/listUI.shtml";
                    },2000);
                }else {
                    layer.msg(result.message, {icon: 2});
                }
            });
        }
    });
});

var cancel = function(){
    location.href = "view/quartz/listUI.shtml";
}