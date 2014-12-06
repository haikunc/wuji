//bride code 
var ddIsBridgeReady = false;
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}
function ddGetAppEnv(callback, context_data) {
    if (! ddIsBridgeReady) {
        return false;
    }
    WebViewJavascriptBridge.callHandler('getAppEnv', {'caller' : 'ddiosjsbridge1.0'}, function(response) {
        callback(response, context_data);
    });
    return true;
}
function ddGetFavoStatus(content_id, callback, context_data) {
    if (! ddIsBridgeReady) {
        return false;
    }
    WebViewJavascriptBridge.callHandler('getFavoStatus', {'content_id': content_id}, function(response) {
        if ("YES" == response) {
            callback(content_id, true, context_data);
        } else {
            callback(content_id, false, context_data);
        }
    });
    return true;
}
function ddSetFavoStatus(content_id, is_favo, callback, context_data) {
    if (! ddIsBridgeReady) {
        return false;
    }
    var favo_status;
    if (is_favo) {
      favo_status = 'YES';
    } else {
      favo_status = 'NO';
    }
    WebViewJavascriptBridge.callHandler('setFavoStatus', {'content_id': content_id, 'favo_status': favo_status}, function(response) {
        if ("YES" == response) {
            callback(content_id, is_favo, true, context_data);
        } else {
            callback(content_id, is_favo, false, context_data);
        }
    });
    return true;
}
//This function is invoked before ready
connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {});
    ddIsBridgeReady = true;
    dobind();
    bridge.registerHandler('setHtmlFavoStatus', function(data, responseCallback) {
        try{
            if(ddSetHtmlFavoStatus && typeof(ddSetHtmlFavoStatus)=="function"){
                var responseData = ddSetHtmlFavoStatus(data);
                responseCallback(responseData);
            }
        }catch(e){
        }
    });
});
function ddComplain(content_id, callback, context_data) {
    if (! ddIsBridgeReady) {
        return false;
    }
    WebViewJavascriptBridge.callHandler('complain', {'content_id': content_id}, function(response) {
        if ("YES" == response) {
            callback(content_id, true, context_data);
        } else {
            callback(content_id, false, context_data);
        }
    });
    return true;
}

//===============page logic function=============
function displayfavo(isFavo, msg) {
    console.log(msg);
    if (isFavo) {
        console.log('\tfavo status true');
        {
            //$("div.like").css("background-image", 'url(/cms/diaodiao/assets/favor.png)');
            $("div.like").css("background-position", '0% 100%');
            }
    } else {
        console.log('\tfavo status false');
        {
            //$("div.like").css("background-image", 'url(/cms/diaodiao/assets/nofavor.png)');
            $("div.like").css("background-position", '0% 0%');
            }
    }
}
function setfavCallback(articleid, setFavo, isFavo, context_data) {
    if (setFavo != isFavo) {
        console.log('setfavCallback: intention != result => '+setFavo+" != "+isFavo);
    } else {
        displayfavo(isFavo, 'Reply from ddios, favo status SET ==>');
        g_favo = isFavo;
    }
};
function getfavCallback(articleid, isFavo, context_data) {
    displayfavo(isFavo, 'Reply from ddios, favo status GET ==>');
    g_favo = isFavo;
};
function setBanner() {
    //640 * 155 px 
    $('<a href="http://www.diaox2.com/"><img class="banner" src="http://c.diaox2.com/cms/diaodiao/assets/banner.png" /></a>').insertBefore("div.heading");
    $('<a href="http://www.diaox2.com/"><img class="banner" src="http://c.diaox2.com/cms/diaodiao/assets/banner.png" /></a>').insertBefore("div.ending");
    /*
    $('<img class="banner" src="http://c.diaox2.com/cms/diaodiao/assets/banner.png" usemap="#downhead" alt="banner" /><map id="downhead" name="downhead"><area shape="rect" coords="460,40,620,120" href="http://www.diaox2.com/appstore.html" alt="Download diaodiao" /></map>').insertBefore("div.heading");
    $('<img class="banner" src="http://c.diaox2.com/cms/diaodiao/assets/banner.png" usemap="#downfoot" alt="banner" /><map id="downfoot" name="downfoot"><area shape="rect" coords="460,40,620,120" href="http://www.diaox2.com/appstore.html" alt="Download diaodiao" /></map>').insertAfter("div.ending");*/
    jQuery("div.ending").css("display", "none");
};
function envCallback(env_data, context_data) {
    var flag = false;
    if(env_data == null) {
        flag = false;
    } else {
        try {
            if(typeof(env_data) != "object" || env_data.app_name != "diaodiao") {
                flag = false;
            } else {
                flag = true;
            }
        } catch(e) {
            flag = false;
        }
    }
    if(flag) {
        g_dx2 = true;
        $.cookie('DDinenv', escape('1'), {path: '/' , domain: 'diaox2.com'});
        /* add favor div */
        $('<div class="like nofav"></div>').insertAfter("div.clearfix.last");
        /* init it's status */
        var articleid = context_data;
        var result = ddGetFavoStatus(articleid, getfavCallback, "");
        if (result == true) {
            console.log("GetFavoStatus invoke succeed, waiting callback, status set.");
        } else {
            console.log("GetFavoStatus invoke failed, status remains.");
            g_fav = false;
        }
        /* add click function */
        jQuery("div.like").click(function(e) {
            result = ddSetFavoStatus(articleid, !g_favo, setfavCallback, "");
            if (result == true) {
                console.log("GetFavoStatus succeed, waiting callback.")
            } else {
                console.log("GetFavoStatus failed!")
            }
            e.stopPropagation();
        });
    } else {
        /* not in dx2 env, some app use jsBridge, should set banner */
 //       setBanner();
        g_dx2 = false;
    }
};
function dobind() {
    var articleid = $('body').attr("id");
    var result = ddGetAppEnv(envCallback, articleid); /* get if is in app, async */
    if(result == false) {
        /* no jsBridge? put ad banner */
 //       setBanner();
    } else {
        /* should wait callback to add div and click event */
        console.log("nothing..");
    }
}
function emptycallback(id, flag, data) {
    console.log(id + flag + data);
}
function complain() {
    var attr = $("#hidden_self").attr("data-src");
    var serverid = String(attr);
    ddComplain(serverid, emptycallback, {});
}
//=========页面加载
var g_favo = false;
var g_dx2 = false;
//延迟加载
jQuery(document).ready(function() {
        jQuery("img.lazy").lazy({
            combined: true,
            delay: 5000/*,
            enableThrottle: true,
            throttle: 100*/
        });
});

//cookie
(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(jQuery);}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s);}
function decode(s){return config.raw?s:decodeURIComponent(s);}
function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value));}
function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
try{s=decodeURIComponent(s.replace(pluses,' '));return config.json?JSON.parse(s):s;}catch(e){}}
function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value;}
var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setTime(+t+days*864e+5);}
return(document.cookie=[encode(key),'=',stringifyCookieValue(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=read(cookie,value);break;}
if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie;}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false;}
$.cookie(key,'',$.extend({},options,{expires:-1}));return!$.cookie(key);};}));

//CSS work out，特殊格式，图片后介绍
jQuery(document).ready(function() {
    jQuery("div.content > p:has(em)").each( function(){
        var mt = $(this).css("margin-top");
        var pat = /(\d+)/gi;
        var matches = pat.exec(mt);
        $(this).css("margin-top", -matches[1] + "px");
        //console.log(-matches[1] + "px");
    });
    var result = $.cookie("DDinenv");
    if(result == undefined) {
        if(typeof(window.DDApp) == "undefined") {
            var has = window.location.href.indexOf("#diaodiao");
            if(-1 == has) {
                setBanner();
            }
        }
    }
    //jQuery("h1").bind("click", dobind);
    //jQuery("div.no").bind("click", noclick);
    //jQuery("div.yes").bind("click", yesclick);
});

//=========new code=========
var nofeel = 50;
var yesfeel = 500;
function noclick() {
    //get number
    $(this).toggleClass("pushed");
    var tmpstr = $(this).attr("data-org");
    if (nofeel > 999)
        tmpstr += " 999+";
    else
        tmpstr += " " + nofeel;
    $(this).text(tmpstr);
}
function yesclick() {
    //get number
    $(this).toggleClass("pushed");
    var tmpstr = $(this).attr("data-org");
    if (yesfeel > 999)
        tmpstr += " 999+";
    else
        tmpstr += " " + yesfeel;
    $(this).text(tmpstr);
}



