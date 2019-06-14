function Myajax(url,parem) {
    var obj;
    $.ajax({
        type: "post",
        url: url,
        async: false,//同步
        contentType: "application/json; charset=utf-8",
        data: parem,
        dataType: "json",
        success: function (data) {
            alert("Myajax:"+JSON.stringify(data))
            obj= data;
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    return obj;
}