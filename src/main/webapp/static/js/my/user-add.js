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
    $("#UserForm").validate({
        rules: {
            uAccount: {
                required: true,
                maxlength: 15
            },
            uEmail: {
                required: true,
                maxlength: 50
            },
            uNickname: {
                maxlength: 50
            },
            uPassword: {
                required: true,
                maxlength:16
            },
            uPhone: {
                maxlength:13
            }
        },
        messages: {
            uAccount: {
                required: icon + "请输入用户账号",
                maxlength: icon + "用户账号不能超过15个字符"
            },
            uEmail: {
                required: icon + "请输入常用邮箱",
                maxlength: icon + "常用邮箱不能超过50个字符"
            },
            uNickname: {
                maxlength: icon + "昵称不能超过50个字符"
            },
            uPassword: {
                required: icon + "请输入用户密码",
                maxlength: icon + "用户密码不能超过16个字符"
            },
            uPhone: {
                maxlength: icon + "电话号码不能超过13个字符"
            }
        },
        submitHandler:function(form){
            $.post("user/insert.shtml", decodeURIComponent($(form).serialize(),true), function(data){
                var result = JSON.parse(data);
                if(result.status == "success"){
                    layer.msg('添加成功',{
                        time: 2000,
                        icon: 6
                    });
                    setTimeout(function(){
                        location.href = "view/user/listUI.shtml";
                    },2000);
                }else {
                    layer.msg(result.message, {icon: 2});
                }
            });
        }
    });
});

var cancel = function(){
    location.href = "view/user/listUI.shtml";
}