//定义XMLHttpRequest对象实例
var http_request = false;
/*************************************************************************
* 方法说明：可复用的http请求发送函数
* 参数说明：
*　　method：请求方式(GET/POST)
*　　url：目标URL
*　　content：用POST方式发出请求时想传给服务器的数据，
*　　　　　　　　　数据以查询字串的方式列出，如：name=value&anothername=othervalue。
*　　　　　　若用GET方式：请传null
*　　responseType：响应内容的格式(text/xml)
*　　callback：要回调的函数
*************************************************************************/
function sendRequest(method, url, content, responseType, callback) {
    http_request = false;
    //开始初始化XMLHttpRequest对象
    if (window.XMLHttpRequest) { //Mozilla 浏览器
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {//设置MiME类别
            http_request.overrideMimeType("text/xml");
        }
    } else {
        if (window.ActiveXObject) { // IE浏览器
            try {
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                }
            }
        }
    }
    if (!http_request) { // 异常,创建对象实例失败
        top.layer.alert("不能创建XMLHttpRequest对象实例.");
        returnfalse;
    }
    if (responseType.toLowerCase() == "text") {
        http_request.onreadystatechange = callback;
    } else {
        if (responseType.toLowerCase() == "xml") {
            http_request.onreadystatechange = callback;
        }else {
        	top.layer.alert("响应类别参数错误。");
            return false;
        }
    }
 
    // 确定发送请求的方式和URL以及是否异步执行下段代码
    if (method.toLowerCase() == "get") {
        http_request.open(method, url, true);
    } else {
        if (method.toLowerCase() == "post") {
            http_request.open(method, url, true);
            http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else {
    		top.layer.alert("http请求类别参数错误。");
            return false;
        }
    }
 
    //开始发起浏览请求
    http_request.send(content);
}
/*************************************************************************
*
*　方法说明：回调函数(处理返回信息的函数)模板
*
*************************************************************************/
function processResponse() {
     // 请求已完成
    if (http_request.readyState == 4) {
        // 信息已经成功返回，开始处理信息
        if (http_request.status == 200) {
            //返回的是文本格式信息
        	top.layer.alert(http_request.responseText);
            //返回的XML格式文档就用alert(http_request.responseXML);
        } else { //页面不正常
        	top.layer.alert("您所请求的页面有异常。");
        }
    }
}


/*******************************************************************
-----------------------------异步调用示例-----------------------------
function getWorkInfo(){
var jsonData;
var url = "/getMyWorkInfoData.jhtml?time=" + Math.random();
//要提交到服务器的数据
var param = "";
//调用异常请求提交的函数
sendRequest("POST", url, param, "TEXT", getWorkInfoCallback);
}

//ajax回调函数
function getWorkInfoCallback(){
if (http_request.readyState == 4) {
    // 信息已经成功返回，开始处理信息
    if (http_request.status == 200) {
    	var result = JSON.parse(http_request.responseText);
    	if(result.msg == undefined){
			jsonData = JSON.parse(result.message);
		}else{
			layer.msg(result.message, {shade: 0.06});
			return;
		}
		$("#workInfo").children().remove();
		for(var i = 0;i < jsonData.length; i++){
			var html ="<li>"+jsonData[i].msg+",<a href=\"javascript:parent.gotoOpenCheckWindow('"+jsonData[i].caption+"','"+jsonData[i].path+"');\">请点击此处此处进行审核</a></li>";
			$("#workInfo").append(html);
		}
    } else { //页面不正常
        //"您所请求的页面有异常"
		alert("您所请求的页面有异常");
    }
}
}
*********************************************************************/