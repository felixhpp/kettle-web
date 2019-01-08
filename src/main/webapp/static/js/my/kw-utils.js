(function (w, d, $) {
    if (!window.UtilsJS) {
        window.UtilsJS = {};
    }
    var location = window.location,
        de = d.documentElement,
        userAgent = navigator.userAgent.toLowerCase(),
        ie6 = /msie 6.0/.test(userAgent),
        opera = /opera/.test(userAgent),
        ie = /msie/.test(userAgent) && !opera,
        safari = /webkit/.test(userAgent),
        ff = /firefox/.test(userAgent);
    var tip = {
        require : '缺少参数，参数必须的',
        rule : '参数不合法'
    };
    UtilsJS = {
        name : 'Custem Javascript Library',
        version : '1.0',
        debug : true,
        namespace : function (name) {
            var parts = name.split('.');
            var current = UtilsJS;
            for (var i in parts) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
        },
        PostRequeat: function (url, data, success, dataType) {
            var options = {
                type: 'POST',
                url: url,
                data: data,
                dataType: dataType == undefined ? 'json' : dataType,
                success: success
            };
            this.AjaxRequest(options);
        },
        GetRequest: function (url, data, success, dataType) {
            var options = {
                type: 'GET',
                url: url,
                data: data,
                dataType: dataType == undefined ? 'json' : dataType,
                success: success
            };
            this.AjaxRequest(options);
        },
        AjaxRequest: function (options) {
            var opts = {
                type: 'POST',
                async: true,
                data: {},
                dataType: 'json'
            };
            $.extend(true, opts, options || {});

            var ajaxOptions = {
                url: opts.url,
                data: opts.data,
                type: opts.type,
                async: opts.async,
                dataType: opts.dataType,
                beforeSend: function() {

                },
                success: function(data) {
                    if(data.success){
                        console.log(opts.url,' ajax is successful',data);
                        opts.success && opts.success(data);

                    }else{
                        var msg = !data.message ? "请求失败！请刷新页面重试" : data.message;
                        UtilsJS.ajaxError(msg);
                    }
                },
                error: function(e){
                    console.error(opts.url,' ajax is error');
                    opts.error != undefined ? opts.error(e) : UtilsJS.commonError(e);
                },
                complete: function(XMLHttpRequest, textStatus) {
                    console.log(opts.url,' ajax is complete');
                },
                timeout: opts.timeout || 20000
            };

            if(opts.processData != undefined){
                ajaxOptions.processData = opts.processData;
            }
            if(opts.contentType != undefined){
                ajaxOptions.contentType = opts.processData;
            }

            $.ajax(ajaxOptions);
        },
        /**
         * 获取URL参数
         * @param name
         * @returns {*}
         */
        getQueryString : function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r !== null)
                return unescape(r[2]);
            return null;
        },
        ajaxError : function (message) {
            if(typeof layer === "undefined"){
                alert(message);
            } else {
                layer.msg(message, {icon: 2});
            }

        },
        commonError: function (e) {
            alert("请求失败！请刷新页面重试");
        }
    };
    UtilsJS.BSTable = function (bstableId, url, columns, options) {
        options = options == undefined ? {}: options;
        this.btInstance = null;                 //jquery和BootStrapTable绑定的对象
        this.bstableId = bstableId;
        this.url = url;
        this.method = "post";
        this.paginationType = "server";         //默认分页方式是服务器分页,可选项"client"
        this.toolbarId = bstableId + "Toolbar";
        this.columns = columns;
        this.height = options.height != undefined ? options.height : null;                      //默认表格高度665
        this.data = options.data != undefined ? options.data : {};
        this.queryParams = options.queryParams != undefined ? options.queryParams : {}; // 向后台传递的自定义参数
    };

    //封装bootstrap table
    UtilsJS.BSTable.prototype = {
        /**
         * 初始化bootstrap table
         */
        init: function () {
            var tableId = this.bstableId;

            if(!$.fn.bootstrapTable){
                throw "请检查是否引用bootstrap相关js文件。"
            }

            this.btInstance =
                $('#' + tableId).bootstrapTable({
                    contentType: "application/x-www-form-urlencoded",
                    url: this.url,              //请求地址
                    method: this.method,        //ajax方式,post还是get
                    ajaxOptions: {              //ajax请求的附带参数
                        data: this.data
                    },
                    toolbar: "#" + this.toolbarId,//顶部工具条
                    classes:'table table-hover kw-table',
                    striped: false,              //是否显示行间隔色
                    cache: false,               //是否使用缓存,默认为true
                    pagination: true,           //是否显示分页（*）
                    sortable: true,             //是否启用排序
                    sortOrder: "desc",          //排序方式
                    pageNumber: 1,                  //初始化加载第一页，默认第一页
                    pageSize: 10,               //每页的记录行数（*）
                    pageList: [10, 20, 50],    //可供选择的每页的行数（*）
                    queryParamsType: 'limit',   //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                    queryParams: function (params) {
                        return $.extend(this.queryParams, params);
                    }, // 向后台传递的自定义参数
                    sidePagination: 'server',   //分页方式：client客户端分页，server服务端分页（*）
                    search: false,              //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
                    strictSearch: true,         //设置为 true启用 全匹配搜索，否则为模糊搜索
                    showColumns: false,          //是否显示所有的列
                    showRefresh: false,          //是否显示刷新按钮
                    minimumCountColumns: 2,     //最少允许的列数
                    clickToSelect: true,        //是否启用点击选中行
                    searchOnEnterKey: true,     //设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
                    columns: this.columns,      //列数组
                    pagination: true,           //是否显示分页条
                    height: this.height,
                    icons: {
                        refresh: 'glyphicon-repeat',
                        toggle: 'glyphicon-list-alt',
                        columns: 'glyphicon-list'
                    },
                    iconSize: 'outline',
                    responseHandler:function(data){
                        if(data.success){
                            return data.data
                        }else {
                            return null;
                        }

                    },
                    onLoadSuccess: function (data) {

                    },
                    onLoadError: function (status) {
                        if(status === 500){
                            alert("系统内部出错，请联系管理员");
                        }
                    }
                });
            return this;
        },
        /**
         * 向后台传递的自定义参数
         * @param param
         */
        setQueryParams: function (param) {
            this.queryParams = param;
        },

        /**
         * 设置ajax post请求时候附带的参数
         */
        set: function (key, value) {
            if (typeof key == "object") {
                for (var i in key) {
                    if (typeof i == "function")
                        continue;
                    this.data[i] = key[i];
                }
            } else {
                this.data[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
            }
            return this;
        },

        /**
         * 设置ajax post请求时候附带的参数
         */
        setData: function (data) {
            this.data = data;
            return this;
        },

        /**
         * 清空ajax post请求参数
         */
        clear: function () {
            this.data = {};
            return this;
        },

        /**
         * 刷新 bootstrap 表格
         * Refresh the remote server data,
         * you can set {silent: true} to refresh the data silently,
         * and set {url: newUrl} to change the url.
         * To supply query params specific to this request, set {query: {foo: 'bar'}}
         */
        refresh: function (parms) {
            if (typeof parms != "undefined") {
                this.btInstance.bootstrapTable('refresh', parms);
            } else {
                this.btInstance.bootstrapTable('refresh');
            }
        }
    };

    $UJS = UtilsJS;
})(window, document, jQuery, undefined);
