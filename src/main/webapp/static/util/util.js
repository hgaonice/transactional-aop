/*
	Copyright (C) 2018
	website:	http://onst.com
	author:	zhoujy
	description:	框架公共JS
*/
/************系统重要参数，禁止修改、删除！***************/
// 项目路径、项目名称
var $PROJECT_NAME, $CONTEXT_PATH;
// 菜单编号、按钮编号 TODO
// var menuId, buttonId;i
// 弹出框临时行数据页面赋值用
var dialogRowData;
// 提交标识
var commitSign = "";
// layer loading层index
var loadingIndex = "";
// from校验值md5
var fromMD5Data = "";
/************系统重要参数，禁止修改、删除！***************/

/**
 * 获取项目路径
 */
function getRootPath() {
	if(!isBlankObj($CONTEXT_PATH) || !isBlankObj($PROJECT_NAME)){
		return;
	}
	var curWwwPath = window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp    
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083    
	var localhostPath = curWwwPath.substring(0, pos);
	//获取带"/"的项目名，如：/uimcardprj   
	$PROJECT_NAME = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	if($PROJECT_NAME == "/view" || $PROJECT_NAME == "/report" || $PROJECT_NAME == "/static"){ //report为页面动态页面请求 view为非动态页面请求 需要过滤!
		$PROJECT_NAME = "";
	}
	$CONTEXT_PATH = localhostPath + $PROJECT_NAME;
}

getRootPath(); // 初始化项目路径

/**
 * 根据当前的url读取url里面的参数
 */
function getUrlParameterNew(url){
	var param = url.substring(url.indexOf("?")).substring(1);
	var array = param.split("&");
	var json = {};
	for(var i=0; i < array.length; i++){
		var s = array[i].split("=");
		json[s[0]] = s[1];
	}
	return json;
}

/**
 * 判断浏览器是否处于全屏模式
 * @returns {Boolean}
 */
function isFullscreenForNoScroll(){
    var explorer = window.navigator.userAgent.toLowerCase();
    if(explorer.indexOf('chrome')>0){//webkit
        if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
        	return true;
        } else {
        	return false;
        }
    }else{//IE 9+  fireFox
    	if (window.outerHeight === window.screen.height && window.outerWidth === top.window.screen.width) {
        	return true;
        } else {
        	return false;
        }
    }
}

/**
 * 根据不同浏览器进入全屏模式
 * @param element
 */
function startFullscreen(element) {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}else{
		parent.layer.msg("按F11进入全屏");
	}
//	$(".easyui-layout").layout("collapse", "west");
}

/**
 * 根据不同浏览器退出全屏模式
 */
function exitsFullscreen() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
	  document.mozCancelFullScreen();
	} else if(document.webkitExitFullscreen) {
	  document.webkitExitFullscreen();
	}else if(document.msRequestFullscreen) {
	  document.msExitRequestFullscreen();
	}else{
		parent.layer.msg("按F11退出全屏");
	}
//	$(".easyui-layout").layout("expand", "west");
}

/**
 * 让JS支持trim()方法
 * @returns {string}
 */
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 自定义字典对象
 * @constructor
 */
function Dict(){
    this.data = new Array();

    this.put = function(key,value){
        this.data[key] = value;
    };

    this.get = function(key){
        return this.data[key];
    };

    this.remove = function(key){
        this.data[key] = null;
    };

    this.isEmpty = function(){
        return this.data.length == 0;
    };

    this.size = function(){
    	alert(this.data.length +".........");
        return this.data.length;
    };
}

/**
 * 让JS支持replaceAll()方法
 */
String.prototype.replaceAll = function(s1,s2){ 
	return this.replace(new RegExp(s1,"gm"),s2); 
}

/**
 * 让Date支持format()方法
 */
Date.prototype.format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)){
		format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o){
			if(new RegExp("("+ k +")").test(format)){
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] :  ("00"+ o[k]).substr((""+ o[k]).length));
			}
		}
		return format;
	}
}
	
/**
 * 获取当前执行函数的方法名
 * @param fn
 * @returns {string | string}
 */
function getFName(fn){
    return (/^[\s\(]*function(?:\s+([\w$_][\w\d$_]*))?\(/).exec(fn.toString())[1] || '';
}

/**
 * 比较按钮方法名是否与函数方法名匹配
 * @param fnName 函数方法名
 * @param funcName 按钮方法名
 * @returns {boolean}
 */
function compareFNName(fnName, funcName){
    fnName = fnName.toUpperCase();
    funcName = funcName.toUpperCase();
    var regex = /\((.+?)\)/g;  // () 匹配小括号
    var param = funcName.match(regex); // 获取按钮方法的整个参数体
    funcName = (funcName.split(param))[0]; // 获取去掉参数的按钮方法名称
    console.log("当前函数方法名："+fnName+"，当前按钮方法名："+funcName);
    var bool = fnName == funcName;
    if(!bool){
    	layer.alert("非法操作！页面函数被篡改", {shade: 0.06});
	}
	return bool;
}

/**
 * 判断JS对象是否为空(字符串||数字||对象)
 * @author zhoujy
 * @param obj
 * @returns {Boolean}
 */
function isBlankObj(obj){
	if(typeof(obj) == "boolean"){ // 布尔类型判断
		return false;
	}
	if(typeof(obj) == "number"){ // 处理数字为0时的判断
		return false;
	}
	if(isJSON(obj) && isEmptyObject(obj)){ // TODO 判断Json是否空
		return true;
	}
	if(obj == "" || obj == undefined || obj == null){
		return true;
	}
	if (typeof(obj) == "string" && obj.replace(/(^\s*)|(\s*$)/g, "").length == 0){ // 过滤空格，制表符，换页符
		return true;
	}
	return false;
}

/**
 * 判断对象是否是JSON数组
 * @param obj
 * @returns {Boolean}
 */
function isJSONArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 判断是否是JSON对象
 * @param obj
 * @returns {boolean}
 */
function isJSON(obj){
    return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object   object]" && !obj.length;
}

/**
 * 判断JSON对象是否为空
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

/**
 * JS将毫秒数时间格式化
 * @param time
 * @param format
 * @returns
 */
function formatTime(time, format){
	if(isBlankObj(time)){
		return "";
	}
	
	var newDate = new Date(time);
	newDate.getFullYear(); //获取完整的年份(4位,1970-????)
	newDate.getMonth(); //获取当前月份(0-11,0代表1月)
	newDate.getDate(); //获取当前日(1-31)
	newDate.getDay(); //获取当前星期X(0-6,0代表星期天)
	newDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
	newDate.getHours(); //获取当前小时数(0-23)
	newDate.getMinutes(); //获取当前分钟数(0-59)
	newDate.getSeconds(); //获取当前秒数(0-59)
	newDate.getMilliseconds(); //获取当前毫秒数(0-999)
	newDate.toLocaleDateString(); //获取当前日期
	var mytime = newDate.toLocaleTimeString(); //获取当前时间
	newDate.toLocaleString( ); //获取日期与时间
	
	var times = "";
	if(!isBlankObj(format)){
		if(format == "null"){ // 后台未指定日期格式则返回毫秒数
            return time;
        }else if(format == "yyyy-MM-dd"){
			times = newDate.getFullYear()+'-'+("0"+(newDate.getMonth()+1)).slice(-2)+'-'+("0"+newDate.getDate()).slice(-2); // 拼写出的日期2015-3-27;
		}else if(format == "yyyy/MM/dd"){
			times = newDate.getFullYear()+'/'+("0"+(newDate.getMonth()+1)).slice(-2)+'/'+("0"+newDate.getDate()).slice(-2); // 拼写出的日期2015-3-27;
		}else if(format == "yyyy/MM/dd HH:mm:ss"){
            times = newDate.getFullYear()+'/'+("0"+(newDate.getMonth()+1)).slice(-2)+'/'+("0"+newDate.getDate()).slice(-2) +"&nbsp;"+("0"+newDate.getHours()).slice(-2)+":"+("0"+newDate.getMinutes()).slice(-2)+":"+("0"+newDate.getSeconds()).slice(-2); // 拼写出的日期2015-3-27 23:59:58;
        }else{ // 默认格式 yyyy-MM-dd HH:mm:ss
			times = newDate.getFullYear()+'-'+("0"+(newDate.getMonth()+1)).slice(-2)+'-'+("0"+newDate.getDate()).slice(-2) +"&nbsp;"+("0"+newDate.getHours()).slice(-2)+":"+("0"+newDate.getMinutes()).slice(-2)+":"+("0"+newDate.getSeconds()).slice(-2); // 拼写出的日期2015-3-27 23:59:58;
		}
	}else{ // 默认格式 yyyy-MM-dd HH:mm:ss
		times = newDate.getFullYear()+'-'+("0"+(newDate.getMonth()+1)).slice(-2)+'-'+("0"+newDate.getDate()).slice(-2) +"&nbsp;"+("0"+newDate.getHours()).slice(-2)+":"+("0"+newDate.getMinutes()).slice(-2)+":"+("0"+newDate.getSeconds()).slice(-2); // 拼写出的日期2015-3-27 23:59:58;
	}
	return times.replaceAll("&nbsp;", " ");
}

/**
 * 获取当前日期时分秒
 * @returns
 */
function getTime() {
	t_div = document.getElementById("showtime");
	var now = new Date();
	var day;
	if (now.getDay() == 0) day = " 星期日";
	if (now.getDay() == 1) day = " 星期一";
	if (now.getDay() == 2) day = " 星期二";
	if (now.getDay() == 3) day = " 星期三";
	if (now.getDay() == 4) day = " 星期四";
	if (now.getDay() == 5) day = " 星期五";
	if (now.getDay() == 6) day = " 星期六";
	t_div.innerHTML = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日&nbsp;" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒&nbsp;" + day;
	setTimeout("getTime()", 1000);
}

/**
 * 限制输入框长度兼容中文字符方法1
 * @param obj
 * @param limit
 */
function limit(obj, limit) {
	var newvalue = obj.value.replace(/[^\x00-\xff]/g, "**");
	var realLength = newvalue.length;
//	/alert("字符长度 "+realLength);
	//当填写的字节数小于设置的字节数
	if (realLength * 1 <= limit * 1){
		return;
	}
	
	var limitDate = newvalue.substr(0, limit);
	var count = 0;
	var limitvalue = "";
	for (var i = 0; i < limitDate.length; i++) {
		var flat = limitDate.substr(i, 1);
		if (flat == "*") {
			count++;
		}
	} 
	var size = 0;
	//校验点是否为“×”
	var istar = newvalue.substr(limit * 1 - 1, 1);

	//if 基点是×; 判断在基点内有×为偶数还是奇数
	if (count % 2 == 0) {
		//当为偶数时
		size = count / 2 + (limit * 1 - count);
		limitvalue = obj.value.substr(0, size);
	} else {
		//当为奇数时 
		size = (count - 1) / 2 + (limit * 1 - count);
		limitvalue = obj.value.substr(0, size);
	}
	//alert("最大输入" + limit + "个字节（相当于"+limit /2+"个汉字）！");
	obj.value = limitvalue;
	layer.msg("字符长度超出限制",{time:500});
	return;
}

//限制输入框长度兼容中文字符方法2
//function limit1(obj, limit) {
//    if (obj.value.replace(/[^ -~]/g, "**").length > limit){
//		var str = obj.value;
//		var result = [];
//		for (var i = 0; i < limit; i++) {
//			var char = str[i]
//			if (/[^ -~]/.test(char))
//				limit--;
//			result.push(char);
//		}
//        obj.value = result.join("");
//	}
//}

/**
 * 获取字符串字节数
 * @param str
 * @returns
 */
function getByteLength(str){
	if(str != "" && str != undefined){
		return str.replace(/[^\x00-\xff]/g, "**").length;
	}else{
		return 0;
	}
}

/**
 * 字符串转byte数组
 * @param str
 * @returns {Array}
 */
function string2Bytes(str) {  
	  var ch, st, re = [];  
	  for (var i = 0; i < str.length; i++ ) {
	    ch = str.charCodeAt(i);  // get char   
	    st = [];                 // set up "stack"  
	    do {  
	      st.push( ch & 0xFF );  // push byte to stack  
	      ch = ch >> 8;          // shift value down by 1 byte  
	    }    
	    while ( ch );  
	    // add stack contents to result  
	    // done because chars have "wrong" endianness  
	    re = re.concat( st.reverse() );  
	  }  
	  // return an array of bytes  
	  return re;  
}  

/**
 * 修改easyui-datagrid表格高度
 * @returns
 */
function domResize(){
	$("#dg").datagrid("resize",{
		height: $(window).height() - 18
	});
	$("#dg").datagrid("resize",{
		height: $(window).height() - 18
	});
}

/**
 * 修改easyui-datagrid表格高度(tree)
 * @returns
 */
function domresizeTree(){
    $("#dg").datagrid("resize",{
        height: $("#layout-center").height()
    });
}

/**
 * 获取数据表格标题数据并过滤checkbox和隐藏列
 * @param datagridId
 * @returns {Array}
 */
function getDatagridFields(datagridId){
	var datagridTitle = new Array();
	var fields = $("#" + datagridId).datagrid("getColumnFields");
    for (var i = 0; i < fields.length; i++) {
        var option = $("#" + datagridId).datagrid("getColumnOption", fields[i]);
        if (option.field == "checkItem" || option.hidden == true) { //过滤checkbox和隐藏列
            continue;
        }else{
        	datagridTitle.push(option);
        }
    }
    return datagridTitle;
}

//从身份证号中获取生日
//function getBirthday(idcardNo) {
//	if(idcardNo.length == 15 || idcardNo.length == 18){
//		var left = idcardNo.length-12;
//		var right = idcardNo.length-4;
//		var birthday = idcardNo.slice(left,right);
//		if(birthday.length == 8){
//			return birthday;
//		}
//	}else{
//		return "";
//	}
//}

//从身份证号中获取性别
//function getSex(idcardNo) {
//	var sex, temp;
//	if(idcardNo.length == 15){
//		sex = idcardNo.substring(14,15);
//	}else if(idcardNo.length == 18){
//		sex = idcardNo.substring(16,17);
//	}
//	temp = sex%2;
//	if(temp == 0){
//		sex = "女";
//	}else{
//		sex = "男";
//	}
//	return sex;
//}

/**
 * 判断from表单是否改变
 * @param formData
 * @returns {Boolean}
 */
function formDataCompare(formData){
	if(formData != top.fromMD5Data){
		return true;
	}
	return false;
}

/**
 * easyui取消所有行选中
 * @param rowid 行id
 * @param rows 行数组
 * @decription 使用前提 字段必须定义：isSys
 */
function rowsUnselect(rowid, rows){
	for(var key in rows){
		if(rows[key].isSys == "1"){
			$("#"+rowid+"").datagrid("unselectRow", $("#"+rowid+"").datagrid("getRowIndex", rows[key])); // 根据行号取消不符合的行选中
		}
	}
	top.commitSign = 1; //提交标识锁定
}

/**
 * 初始化表单
 * @returns
 */
function initFormData(){
	top.fromMD5Data = hex_md5($("#customForm").serialize());
}

/**
 * 显示loading层
 * @returns
 */
function showLoading() {
	parent.loadingIndex = layer.load(1, {shade: [0.06, "black"]}, {time: 10*1000});
}

/**
 * 隐藏loading层
 * @returns
 */
function hideLoading() {
	layer.close(parent.loadingIndex);
}

/**
 * 循环遍历字典数据
 * @param value
 * @param obj
 * @returns
 */
function forEachDict(value, obj) {
    for(var i = 0; i < obj.length; i++){
        if(obj[i].code == value){
            return obj[i].name;
        }
    }
    // 循环完未发现字典匹配，则返回原值
    return value;
}

/**
 * 加载searchbox
 * @param block
 * @param refcode
 * @param replaceVal
 * @param conditions
 * @param resourceFilter
 */
function addSearchbox(block, refcode, replaceVal, conditions, resourceFilter){
	var fields = $("#dg").datagrid("getColumnFields"); // 获取datagrid所有字段
	for(var i=0; i<fields.length; i++){
		var b = false;
		for(var j=0; j<block.length; j++){
			if(fields[i] == block[j]){ //过滤掉不适合searchbox查询的字段
				b = true;
		    }
		}
		if(b){
			continue;
		}
		var opts = $("#dg").datagrid("getColumnOption", fields[i]);
		var muit = "<div name='"+  fields[i] +"'>"+ opts.title +"</div>";
		$("#mm").html($("#mm").html()+muit);
   	}
	reloadSearchbox(refcode, replaceVal, conditions, resourceFilter);
}

/**
 * layui打开新tab
 * @param url
 * @param title
 */
function layerJump(url, title){
    if(isBlankObj(url)){
        top.layer.alert("操作失败，页面URL不能为空！", {shade: 0.06});
        return;
    }
    if(isBlankObj(title)){
        top.layer.alert("操作失败，页面标题不能为空！", {shade: 0.06});
        return;
    }
    top.layui.index.openTabsPage(url, title);
}

/**
 * 加载searchbox搜索函数
 * @param refcode
 * @param replaceVal
 * @param conditions
 * @param resourceFilter
 */
function reloadSearchbox(refcode, replaceVal, conditions, resourceFilter){
	refcode == undefined ? "" : refcode;
	replaceVal == undefined ? "" : replaceVal;
	conditions == undefined ? "" : conditions;
	resourceFilter == undefined ? "" : resourceFilter;
	$("#sb").searchbox({
   		menu: "#mm",
		searcher: function(value, key){ // 搜索触发方法
			var page = $("#dg").datagrid("getPager").data("pagination").options.pageNumber;
        	var rows = $("#dg").datagrid("getPager").data("pagination").options.pageSize;
        	$("#dg").datagrid("load",{
    			page: page,
    			rows: rows,
    			searchKey: key,
    			searchValue: value,
    			refcode: refcode,
    			replaceVal: replaceVal,
    			conditions: conditions,
    			resourceFilter: resourceFilter
    		});
		}
    });
}

/**
 * 加载高级查询层
 * @param index
 * @param searchAreaId
 * @param item
 */
function showAdvanceSearch(index, searchAreaId, item){
	var body = layer.getChildFrame("body", index); //获取layer子窗口body
	if(isBlankObj(top.$("#"+searchAreaId).html())){
		$(top.document.body).append("<div style='display:none'><div id="+searchAreaId+"></div></div>");
		if(item == undefined){
			body.contents().find("#searchAreaChild").html($("#advanceSearch").children().clone()); //将父窗口搜索层传递给子窗口
			body.contents().find("#searchAreaId").val(searchAreaId); //将父窗口搜索层ID传递给子窗口
		}else{
			body.contents().find("#searchAreaChild").html($("#advanceSearch_item").children().clone()); //将父窗口搜索层传递给子窗口
			body.contents().find("#searchAreaId_item").val(searchAreaId); //将父窗口搜索层ID传递给子窗口
		}
	}else{
		body.contents().find("#searchAreaChild").html(top.$("#"+searchAreaId).children().clone()); //将父窗口搜索层传递给子窗口
		if(item == undefined){
			body.contents().find("#searchAreaId").val(searchAreaId); //将父窗口搜索层ID传递给子窗口
		}else{
			body.contents().find("#searchAreaId_item").val(searchAreaId); //将父窗口搜索层ID传递给子窗口
		}
	}
}

/**
 * 高级查询复制
 * @param searchAreaId
 * @returns
 */
function advanceSearchGetValue(searchAreaId){
	//type=text, 同时如果checkbox,radio,select>option的值有变化, 也绑定一下, 这里忽略button
	$("input,select option").each(function(){
		$(this).attr("value",$(this).val());
	});

	//type=checkbox,type=radio 选中状态
	$("input[type='checkbox'],input[type='radio']").each(function(){
		if($(this).attr("checked"))
			$(this).attr("checked", true);
		else
			$(this).removeAttr("checked");
	});
	
	//select选中状态
	$("select option").each(function(){
		if($(this).attr("selected")){
			$(this).attr("selected", true);
		}else{
			$(this).removeAttr("selected");
		}
	});
	
	//textarea
	$("textarea").each(function(){
		$(this).html($(this).val());
	});
	
	return $("#"+searchAreaId).html();
}

/**
 * ztree异步加载请求成功后的数据过滤函数
 * @param treeId
 * @param parentNode
 * @param childNodes
 * @returns
 */
function ztreeFilter(treeId, parentNode, childNodes) {
	//alert(JSON.stringify(childNodes));
    if (!childNodes){
    	return null;
    }
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes.treeNodes;
}

//判断行是否选中
//function isChecked(parentId, parentIndex, dialogRowData){
//	var b = false;
//    var allRows = $('#ddv-'+parentId+"-"+parentIndex).datagrid('getChecked');
//    $.each(allRows,function(i,n){
//	    if(dialogRowData.id==n.id){
//	        b = true;
//	    }
//    })
//    return b;
//}

/**
 * 通用弹出框
 * @param url 请求URL
 * @param title 标题
 * @param idi 当前输入框编号ID
 * @param namei 当前输入框名称ID
 */
function showDialog(url, title, dialogRowIds, dialogRowIdsMapped, width, height) {
	top.commitSign = 0; //提交标识还原
	if(isBlankObj(url)){
		layer.msg("未传递url参数，请检查！", {shade: 0.06});
		return;
	}
    if(isBlankObj(dialogRowIds)){
        layer.msg("未传递赋值ID参数，请检查！", {shade: 0.06});
        return;
    }
	if(isBlankObj(title)){
		width = "弹出框";
	}
	if(isBlankObj(width)){
		width = "720px";
	}
	if(isBlankObj(height)){
		height = "480px";
	}
	parent.layer.open({
        title: title,
        type: 2,
        shade: 0.06, // 透明度
        area: [width, height],
        fixed: false, // 鼠标滚动时，层是否固定在可视区域
        maxmin: false, // 放大缩小按钮
        content: url,
        success: function(layero, index){ // 层弹出成功后回调参数：当前层DOM&当前层索引
        	//键盘按键监听
			$(document).on("keydown", function(e){
				if (e.keyCode == 13){ // 禁用回车事件 以免层重复弹出
					return false;
				}
				if (e.keyCode == 27){ //ESC退出
					parent.layer.close(index);
				}
			})
			// var body = layer.getChildFrame('body', index);
        },
        end:function(){ // 层销毁后回调
        	if(top.commitSign == 1){
                var dialogIdArray = dialogRowIds.split(",");
                var dialogIdArrayMapped = dialogRowIdsMapped.split(",");
				for (var i = 0; i < dialogIdArray.length; i++ ) {
                    $("#"+dialogIdArray[i].trim()).val(top.dialogRowData[dialogIdArrayMapped[i].trim()]);
                    // 触发change事件，使input中的onchange生效
                    $("#"+dialogIdArray[i].trim()).change();
				}
        	}
        	validator(); // 回调表单校验方法
        }
    });
}

// 清空弹出框数据
function emptyDialog(){
    top.dialogRowData = "";
    top.commitSign = 1; //提交标识锁定
    parent.layer.close(parent.layer.getFrameIndex(window.name));
}

/**
 * 增加input元素校验
 * @param id 元素ID
 * @param rules 元素校验规则
 * @param showDIV 是否显示元素所在层
 */
function addValidate(id, rules, errmsg, showDIV){
	if(showDIV){
		$("#"+id+"DIV").show();
	}
	$("#"+id).attr("disabled", false); // 取消禁用
	$("#"+id).attr("valid", rules); // 增加非空校验
	$("#"+id).attr("errmsg", errmsg); // 增加非空校验
	$("#"+id+"Red").html("&nbsp;*"); // 增加红*
}

/**
 * 移除input元素校验
 * @param id 元素ID
 * @param isEmptyVal 是否清空元素当前值
 * @param hideDIV 是否隐藏元素所在层
 */
function removeValidate(id, isEmptyVal, hideDIV){
	if(hideDIV){
		$("#"+id+"DIV").hide();
	}
	if(isEmptyVal){
		$("#"+id).val("");
//		$("#"+id).attr("disabled", true);
	}
	$("#"+id).removeAttr("valid"); // 移除非空校验
	$("#"+id).removeAttr("errmsg"); // 移除错误提示信息
	$("#"+id).removeClass("layui-form-danger"); // 移除错误显示class
	$("#"+id+"Red").html(""); // 移除红*
}

//select清空
function selectClear(id){
	$("#"+id).find("option").remove();
}

function jsonArrayTrans(param){
	for (var i = 0; i < param.length; i++) {
		
	}
}

/**
 * 
 * ajax请求封装
 * @param url 请求URL
 * @param param
 * @param showTips 是否启用成功提示 默认true 提示成功消息
 * @param sync 是否启用同步请求 默认false 为异步请求
 * @param paramType 参数类型 默认json
 * @returns
 */
function ajaxPost(url, param, showTips, sync, paramType){
	try{
		var obj = [];
		if(isBlankObj(url)){
			hideLoading();
			layer.alert("未传递URL参数，请检查！", {shade: 0.06});
			return;
		}
		if(isBlankObj(param)){
			param = {"iparamX": ""};
		}
		if(!(typeof(showTips) == "boolean")){ // 非boolean类型值
			showTips = true;
		}
		if(showTips){
			showLoading();
		}
		if(!(typeof(sync) == "boolean")){
			sync = false;
		}
		if(isBlankObj(paramType)){
			paramType = "json";
		}
		// obj转arr
//		if(!isJSONArray(param)){ // 是JSON数组
//			var paramArr = [];
//			for (var i = 0; i < param.length; i++) {
//				var parami = param[i];
//				if(param[i] == undefined){
//					parami = "";
//				}
////				var str = ((JSON.stringify(parami)).replaceAll("\"","\'")).trim();
////				if(str.indexOf("{") != 0 && str.indexOf("[") != 0 && str.charAt(0) == "'"){ //对非JSON对象同时仅对字符串非数字数据处理
////					str = str.substring(1, str.length-1);
////				}
//				var newJson = "{\"name\":\"" + i + "\"," + "\"value\":\"" + str + "\"}";
//				paramArr.push(JSON.parse(newJson));
//			}
//			
//			param = paramArr;
//		}
		// 将菜单和按钮加入 TODO
		if(!isBlankObj($("#moduleIds").val())){
//			var moduleIds = "{\"name\":\"moduleIds\"," + "\"value\":\"" + $("#moduleIds").val() + "\"}";
			//添加新的属性并赋值
			param["moduleIds"] = $("#moduleIds").val();
//			param.push(JSON.parse(moduleIds));
		}
//		if(!isBlankObj(top.buttonId)){
//			var menuJson = "{\"name\":\"menuId\"," + "\"value\":\"" + top.menuId + "\"}";
//			var buttonJson = "{\"name\":\"buttonId\"," + "\"value\":\"" + top.buttonId + "\"}";
//			param.push(JSON.parse(menuJson));
//			param.push(JSON.parse(buttonJson));
//		}
		if(showTips){ // 查询的提交不修改标识
			top.commitSign = 1; //提交标识锁定
		}
		$.ajax({
			type : "POST",
			data : param,
			async: sync,
			url : $PROJECT_NAME + url,
			dataType : paramType,
			success : function(result) {
				hideLoading();
				obj = result;
				if(result.msg != undefined){
					layer.alert("操作失败！"+result.msg, {shade: 0.06});
					if(showTips){ // 查询的提交不修改标识
						top.commitSign = 0; //提交标识还原
					}
				}else{
					if(showTips){
						parent.layer.msg("操作成功！"); // 此处parent仅限弹框保存页面使用，非弹出层的表单页面不能使用默认成功提示
						$("#moduleIds").val("");
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
                hideLoading();
				sessionTimeoutHandle(XMLHttpRequest, textStatus, errorThrown);
			}
		});
	}catch(err){
		if(err == "InternalError: too much recursion"){
			err = "参数包含JSON数组，请先转换字符串";
		}
		hideLoading();
		layer.alert("操作失败！</br>请求路径："+url+"</br>请求参数："+JSON.stringify(param)+"</br>错误信息：<span style='color:red;'>" + err + "</span>", {shade: 0.06});
	}
    return obj;
}

/**
 * 打印客户端ajax请求封装
 * @param url 请求URL
 * @param param
 * @param showTips 是否启用成功提示 默认true 提示成功消息
 * @param sync 是否启用同步请求 默认false 为异步请求
 * @param paramType 参数类型 默认json
 * @returns
 */
function ajaxPrint(url, param, showTips, sync, paramType){
	try{
//		var obj = [];
		if(isBlankObj(url)){
			hideLoading();
			layer.alert("未传递URL参数，请检查！", {shade: 0.06});
			return;
		}
		if(isBlankObj(param)){
//			param = {"iparamX": ""};
		}
		if(!(typeof(showTips) == "boolean")){ // 非boolean类型值
			showTips = true;
		}
		if(showTips){
			showLoading();
		}
		if(!(typeof(sync) == "boolean")){
			sync = false;
		}
		if(isBlankObj(paramType)){
			paramType = "json";
		}
		if(showTips){ // 查询的提交不修改标识
//			top.commitSign = 1; //提交标识锁定
		}
		$.ajax({
			type: "POST",
		    url: url, 
		    data: JSON.stringify(param),
			async: sync,
			dataType : paramType,
		    contentType: "application/json",
		    success: function (result) {
		    	hideLoading();
		    	if(result.success != true){
					layer.alert("操作失败！"+result.message, {shade: 0.06});
					if(showTips){ // 查询的提交不修改标识
//						top.commitSign = 0; //提交标识还原
					}
				}else if(result.success == true){
					if(showTips){
						parent.layer.msg("操作成功！"); // 此处parent仅限弹框保存页面使用，非弹出层的表单页面不能使用默认成功提示
					}
				}else{
					layer.alert("未知响应参数："+JSON.stringify(result), {shade: 0.06});
				}
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
                hideLoading();
				sessionTimeoutHandle(XMLHttpRequest, textStatus, errorThrown);
			}
		});
	}catch(err){
		if(err == "InternalError: too much recursion"){
			err = "参数包含JSON数组，请先转换字符串";
		}
		hideLoading();
		layer.alert("操作失败！</br>请求路径："+url+"</br>请求参数："+JSON.stringify(param)+"</br>错误信息：<span style='color:red;'>" + err + "</span>", {shade: 0.06});
	}
//    return obj;
}

/**
 * session出错处理
 */
function sessionTimeoutHandle(XMLHttpRequest, textStatus, errorThrown){
	top.hideLoading();
	var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
	if(sessionstatus == "timeout"){
		top.layer.alert("会话超时，请重新登录！", {icon: 0, closeBtn: 0, title:"提示"},
			function(index){
				window.open($CONTEXT_PATH + '/', '_top');
	        }
		)
	}else if (sessionstatus == "illegal"){
		top.layer.alert("非法请求，请先登录！", {icon: 2, closeBtn: 0, title:"警告"},
			function(index){
				window.open($CONTEXT_PATH + '/', '_top');
	        }
		)
	}else{
		layer.alert("操作失败！错误码（"+XMLHttpRequest.status+"）", {shade: 0.06});
	}
}

/**
 * 点击菜单跳转
 */
function mainGoto(url, title){
    var flag = $("#easyui_tabs").tabs("exists", title);
    //绑定tab右键触发函数
    tabCloseEven();
    if (!flag) {
        //在tab中添加选项卡  
        $("#easyui_tabs").tabs("addIframeTab",{
            tab:{
                title: title,
                closable: true
            },
            iframe:{src: url}
        });
    } else {
        $("#easyui_tabs").tabs("select", title);
    }
}

/**
 * excel导出请求
 * @param fileName 下载的文件名称（默认不传取query的名称）
 * @param queryId 查询编号id
 * @param conditions 查询条件
 * @param columnTitle 列标题集合
 * @param replaceVal 需要动态替换的数据
 * @param dynamicData 动态表单数据
 * @param pageType 导出页面类型，区分新旧页面列取值不同问题
 * @returns
 */
function exportExcelExecute(fileName, queryId, conditions, columnTitle, replaceVal, dynamicData, pageType){
//	layer.msg("正在导出数据，请稍候...");
	if(isBlankObj($("#hiddenDiv_").html())){
		var html ="<div id='hiddenDiv_' style='display:none'><form id='hiddenForm_' method='POST' action='"+$PROJECT_NAME+"/exportExcel.jhtml'><input type='text' id='fileName_' name='fileName'/><input type='text' id='queryId_' name='queryId'/><input type='text' id='conditionsData_' name='conditionsData'/><input type='text' id='columnTitle_' name='columnTitle'/><input type='text' id='dynamicData_' name='dynamicData'/><input type='text' id='replaceVal_' name='replaceVal'/><input type='text' id='pageType_' name='pageType'/></form></div>";
		$("body").append(html);
	}
	$("#fileName_").val(fileName);
	$("#queryId_").val(queryId);
    $("#conditionsData_").val(conditions);
    $("#columnTitle_").val(columnTitle);
    $("#replaceVal_").val(replaceVal);
    $("#dynamicData_").val(dynamicData);
    $("#pageType_").val(pageType);
    $("#hiddenForm_").submit();
}

/**
 * dorado解析数据列拼接成列标题集合
 * @param oracleColumn
 * @returns {Array}
 */
function getColumnTitle(oracleColumn){
	var arr= new Array();
	for(var i=0;i<oracleColumn.length;i++){
		var json ={};
		for(var name in oracleColumn[i]){
			if(name=="name"){
				var value=oracleColumn[i][name];
				var value =value.replace(/[A-Z]/g,function(v){
					return "_"+v.toLowerCase()
				});
				value=value.replace(/^_.+/g,function(v){
					return v.substring(1);
				});
				json[name]=value.toUpperCase();
			}else
				json[name]=oracleColumn[i][name];
		}
		arr.push(json);
	}
	console.log(arr);
	return arr;
}

/**
 * 根据字段标签查询字典明细
 * @param labels 字典标签
 */
function getDict(labels){
    if(isBlankObj(labels)){
        layer.alert("操作失败，字典标签不能为空！");
    }

    //查询字典
    var result = ajaxPost("/getDictByLabel.jhtml", {"dict_label": labels}, false);
    if(isBlankObj(result.msg)){
        var dictArray = labels.split("~");
        for(var i=0; i < dictArray.length; i++){
            if (self != top) {
                window[dictArray[i]] = result[dictArray[i]];
			}else{
                alert("页面不在iframe中，方法暂未实现！");
			}
        }
    }
}

/**
 * 切换行政区划下拉框
 * @param levels
 */
function changeRegion(levels){
    if(isBlankObj(levels)){
        return;
    }
    var PROVINCE, CITY, AREA, STREET;
    if(levels == 1){ //查询生成省数据
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 2}, false);
        if(isBlankObj(result.msg)){
            PROVINCE = result.data;
        }
        if(!isBlankObj(PROVINCE)){
            for(var i = 0; i < PROVINCE.length; i++){
                $("#provinceSelect").append("<option value='"+PROVINCE[i].id+"' title="+PROVINCE[i].name+">"+PROVINCE[i].name+"</option>");
            }
        }
    }else if(levels == 2){ //查询生成市数据
        $("#citySelect").empty(); // 清空之前加载的数据
        $("#citySelect").append("<option value='' title='' selected>未选择</option>");
        $("#areaSelect").empty(); // 清空之前加载的数据
        $("#areaSelect").append("<option value='' title='' selected>未选择</option>");
        $("#streetSelect").empty(); // 清空之前加载的数据
        $("#streetSelect").append("<option value='' title='' selected>未选择</option>");
        var parentId = $("#provinceSelect").val();
        if(isBlankObj(parentId)){
            layer.msg("获取省数据失败，请检查下拉框id是否正确！");
            return;
        }
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 3, "parentId": parentId}, false);
        if(isBlankObj(result.msg)){
            CITY = result.data;
        }
        if(!isBlankObj(CITY)){
            for(var i = 0; i < CITY.length; i++){
                $("#citySelect").append("<option value='"+CITY[i].id+"' title="+CITY[i].name+">"+CITY[i].name+"</option>");
            }
        }
    }else if(levels == 3){ //查询生成区数据
        $("#areaSelect").empty(); // 清空之前加载的数据
        $("#areaSelect").append("<option value='' title='' selected>未选择</option>");
        $("#streetSelect").empty(); // 清空之前加载的数据
        $("#streetSelect").append("<option value='' title='' selected>未选择</option>");
        var parentId = $("#citySelect").val();
        if(isBlankObj(parentId)){
            layer.msg("获取省数据失败，请检查下拉框id是否正确！");
            return;
        }
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 4, "parentId": parentId}, false);
        if(isBlankObj(result.msg)){
            AREA = result.data;
        }
        $("#areaSelect").empty(); // 清空之前加载的数据
        $("#areaSelect").append("<option value='' title='' selected>未选择</option>");
        if(!isBlankObj(AREA)){
            for(var i = 0; i < AREA.length; i++){
                $("#areaSelect").append("<option value='"+AREA[i].id+"' title="+AREA[i].name+">"+AREA[i].name+"</option>");
            }
        }
    }else if(levels == 4){ //查询生成街道数据
        $("#streetSelect").empty(); // 清空之前加载的数据
        $("#streetSelect").append("<option value='' title='' selected>未选择</option>");
        var parentId = $("#areaSelect").val();
        if(isBlankObj(parentId)){
            layer.msg("获取省数据失败，请检查下拉框id是否正确！");
            return;
        }
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 5, "parentId": parentId}, false);
        if(isBlankObj(result.msg)){
            STREET = result.data;
        }
        $("#streetSelect").empty(); // 清空之前加载的数据
        $("#streetSelect").append("<option value='' title='' selected>未选择</option>");
        if(!isBlankObj(STREET)){
            for(var i = 0; i < STREET.length; i++){
                $("#streetSelect").append("<option value='"+STREET[i].id+"' title="+STREET[i].name+">"+STREET[i].name+"</option>");
            }
        }
    }else{
    	layer.msg("levels参数异常！");
        return;
    }
}

/**
 * 切换行政区划修改回显(全部)
 */
function changeRegionAllUpdate(province, city, area, street) {
    var PROVINCE, CITY, AREA, STREET;
    if(!isBlankObj(province)){
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 2}, false);
        if (isBlankObj(result.msg)) {
            PROVINCE = result.data;
        }
        if (!isBlankObj(PROVINCE)) {
            for (var i = 0; i < PROVINCE.length; i++) {
                $("#provinceSelect").append("<option value='" + PROVINCE[i].id + "' title=" + PROVINCE[i].name + ">" + PROVINCE[i].name + "</option>");
            }
            $("#provinceSelect").find("option[value = '" + province + "']").attr("selected", "selected");
        }
    }
    if(!isBlankObj(city)){
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 3, "parentId": province}, false);
        if (isBlankObj(result.msg)) {
            CITY = result.data;
        }
        if (!isBlankObj(CITY)) {
            for (var i = 0; i < CITY.length; i++) {
                $("#citySelect").append("<option value='" + CITY[i].id + "' title=" + CITY[i].name + ">" + CITY[i].name + "</option>");
            }
            $("#citySelect").find("option[value = '" + city + "']").attr("selected", "selected");
        }
    }
    if(!isBlankObj(area)){
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 4, "parentId": city}, false);
        if (isBlankObj(result.msg)) {
            AREA = result.data;
        }
        $("#areaSelect").empty(); // 清空之前加载的数据
        $("#areaSelect").append("<option value='' title='' selected>未选择</option>");
        if (!isBlankObj(AREA)) {
            for (var i = 0; i < AREA.length; i++) {
                $("#areaSelect").append("<option value='" + AREA[i].id + "' title=" + AREA[i].name + ">" + AREA[i].name + "</option>");
            }
            $("#areaSelect").find("option[value = '" + area + "']").attr("selected", "selected");
        }
    }
    if(!isBlankObj(street)){
        var result = ajaxPost("/baseRegionGetData.jhtml", {"levels": 5, "parentId": area}, false);
        if (isBlankObj(result.msg)) {
            STREET = result.data;
        }
        $("#streetSelect").empty(); // 清空之前加载的数据
        $("#streetSelect").append("<option value='' title='' selected>未选择</option>");
        if (!isBlankObj(STREET)) {
            for (var i = 0; i < STREET.length; i++) {
                $("#streetSelect").append("<option value='" + STREET[i].id + "' title=" + STREET[i].name + ">" + STREET[i].name + "</option>");
            }
            $("#streetSelect").find("option[value = '" + street + "']").attr("selected", "selected");
        }
    }
}

/**
 * viewerjs查看图片
 * @param viewType 01 地址查看 02 base64查看
 */
function showViewerjs(ulId, data, viewType){
	// 临时拼接生成viewerjs层内容
	$("#"+ulId).empty();
    if(isBlankObj(data)){
    	return;
    }
    for(var i = 0; i < data.length; i++){
    	if(viewType === "01"){ // 直接访问图片地址
            $("#"+ulId).append("<li><img data-original="+data[i]+" src="+data[i]+" alt="+data[i]+"></li>");
        }else if(viewType === "02"){ // 使用base64解码图片
    		if(isBlankObj(data[i])){
                layer.msg("图片地址获取失败！");
                return;
			}
			var picArr = data[i].split("~");
    		var srcs = "data:image/" + picArr[0] + ";base64," + picArr[2];
            $("#"+ulId).append("<li><img data-original="+srcs+" src="+srcs+" alt="+picArr[1]+ "." + picArr[0] + " ></li>");
        }else if(viewType === "03"){ // 使用图片id查看图片
			if(isBlankObj(data[i])){
				layer.msg("图片ID不能为空！");
				return;
			}
            var picArr = data[i].split("~");
            var src = $CONTEXT_PATH + "/baseCertificateShowImages.jhtml?id=" + picArr[2];
            $("#"+ulId).append("<li><img data-original="+src+" src="+src+" alt="+picArr[1]+ "." + picArr[0] + " ></li>");
		}else{
			layer.msg("错误的图片查看类型[" + viewType + "]！");
			return;
		}
    }

 	// viewerjs展示
    var viewerjs = new Viewer(document.getElementById(ulId), {url: "data-original", hidden: function() {
    	viewerjs.destroy();
    }});
    viewerjs.show();
}

