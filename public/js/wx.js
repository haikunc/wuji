//need > 290px picture
function shareFriend() {
    WeixinJSBridge.invoke("sendAppMessage", {
        appid: appid,
        img_url: imgUrl,
        img_width: "188",
        img_height: "188",
        link: lineLink,
        desc: descContent,
        title: shareTitle
    },
    function(e) {})
}
function shareTimeline() {
    WeixinJSBridge.invoke("shareTimeline", {
        img_url: imgUrl,
        img_width: "188",
        img_height: "188",
        link: lineLink,
        desc: descContent,
        title: shareTitle
    },
    function(e) {})
}
function shareWeibo() {
    WeixinJSBridge.invoke("shareWeibo", {
        img_url: imgUrl,
        content: shareTitle + " " + descContent,
        url: lineLink
    },
    function(e) {})
}
function isWeixin() {
    var e = navigator.userAgent.toLowerCase();
    if (e.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
}
function isIos() {
    return navigator.userAgent.match(/iphone|ipod|ios|ipad/i)
}
function pageInit() {
    checkInstallable();
    checkMobile()
}
function checkInstallable() {
    var e = "none";
    if (!isIos() && !isWeixin()) {
        e = "block";
        var t = document.styleSheets[0];
        var n = t.cssRules ? t.cssRules: t.rules;
        for (i = 0; i < n.length; i++) {
            if (n[i].selectorText == ".installable") {
                n[i].style["display"] = e;
                break
            }
        }
    }
}
function checkMobile() {
    if (isMobile()) {
        displayType = "none";
        var e = document.styleSheets[0];
        var t = e.cssRules ? e.cssRules: e.rules;
        for (i = 0; i < t.length; i++) {
            if (t[i].selectorText == ".hideMobile") {
                t[i].style["display"] = displayType;
                break
            }
        }
        //document.getElementById("jiathisDiv").style.cssText = "font: 20px; width: 212px; margin: 10px auto;"
    }
    if (isWechat()) {
        document.getElementById("killme").style.cssText = "display:block"
        //document.getElementById("iOS_link").href = 'javascript:alert("请用safari浏览器打开下载，参考页面顶端")'
    }
}
function isMobile() {
    return navigator.userAgent.match(/android|iphone|ipod|blackberry|meego|symbianos|windowsphone|ucbrowser/i)
}
function isWechat() {
    return navigator.userAgent.match(/MicroMessenger/i)
}
//var HOME_PATH = HOME_PATH || "{:SITE_URL}";
var imgUrl = $("div.total").attr("data-thumb");
//var lineLink = '{:U("live/Index/mlive",array("id"=>$id))}';
var lineLink = $("div.total").attr("data-self");
var shareTitle = $("h1").text();
var descContent = shareTitle;
var appid = 'wx9641c0ec6d8d6837';

window.addEventListener("load", pageInit, false);
document.addEventListener("WeixinJSBridgeReady", function() {
    WeixinJSBridge.on("menu:share:appmessage",
    function(e) {
        shareFriend()
    });
    WeixinJSBridge.on("menu:share:timeline",
    function(e) {
        shareTimeline()
    });
    WeixinJSBridge.on("menu:share:weibo",
    function(e) {
        shareWeibo()
    })
}, false);


