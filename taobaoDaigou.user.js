// ==UserScript==
// @name         taobaoDaigou
// @version      0.1
// @description  淘宝代购,保留一切版权。
// @author       Wanghsinche 
// @include      http://www.amazon.co.uk/*
// @include      http://daigou.taobao.com
// @require http://libs.useso.com/js/jquery/1.9.0/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue


// ==/UserScript==
//Event is a simple class for implementing the Observer pattern:
function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach : function (listener) {//push the callback function into _listeners[];
        this._listeners.push(listener);
    },
    notify : function (args) {//pop all the callback functions and execute the functions with same args?
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);//auto pass sender and args into callback function, so the default form of callback function is function(sender,args){}
        }
    }
};
//////////////////////////////////
var afterLoaded=function(response){
	var existParttern="商品已经存在";
	var successParttern="itemPublish.htm";
	var hasPostedParttern="已经存在该商品";
	if (response.finalUrl.match(existParttern)===null) {
		//商品不存在，继续
		if (response.finalUrl.match(successParttern)===null){
			//未知类型，退出
			// alert('未知类型');
			console.log('1');
		}else{
			//已知类型
			if (response.responseText.match(hasPostedParttern)===null) {
				//可以提交
				GM_openInTab(response.finalUrl, true);
			}else{
				//已经提交
				// alert(hasPostedParttern);
							console.log('2');

			}
			
		}
	}
	else{
		//商品存在
		// alert(existParttern);
					console.log('3');

	}

};
//////////////////////////////////
var parseHtml=function(response){
	var $html=$(response.responseText);

};
//////////////////////////////////
var fetchLogin=function(i){
	var loginEvent= new Event(this);	
	var loginURL='http://daigou.taobao.com/buyer/index.htm';
	var text=["action="+encodeURIComponent('/buyer/submit_url_action'),"event_submit_do_submit_url="+encodeURIComponent('anything'),"_tb_token_="+encodeURIComponent('LUHLJE8DqGtdw64'),"itemUrl="+encodeURIComponent('http://www.amazon.com/dp/B00WBK03OU')];
	var senddata=text.join('&');
	var _this=this;
	GM_xmlhttpRequest({
		method:"POST",
		url:loginURL,
		headers: {
		    "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data:senddata,
		onload:function(response){
			afterLoaded(response);
		},
		onerror:function(response){
				// globalFetchDoneEvent.notify();//skip and next account
				// console.log("username :" + tempuser+'login failed');
				// return false;
				alert('未知错误');
		}
	});	
};

////////////////////
$('#productTitle').append('<button id="wxzBtn" class="">check</button>');
$('#wxzBtn').click(function(){
	fetchLogin();
});
