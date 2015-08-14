try {
var _xnext_included;
if (!_xnext_included && !window.location.href.match(/fb_xd_fragment/g)) {
_xnext_included = true;

if(!document.body) {
    throw "The tag <body> is missing";
}

function xInjectJs(src) {
	if (window.ecwid_script_defer) {
		var script = document.createElement("script");
		script.setAttribute("src", src);
		script.charset = "utf-8";
		script.setAttribute("type", "text/javascript");
		document.body.appendChild(script);
	} else document.write("<script src='"+src+"' type='text/javascript' charset='utf-8'></script>");
}

// Hi! Do you love reading JavaScript code? We too! 
// Ecwid has a plenty of different APIs and we welcome all developers to 
// create addons and services (free or paid ones) for Ecwid merchants. Such 
// addons and apps will be promoted on our site. 
// More about our APIs: http://api.ecwid.com

var ecwidContextPath = "";
var addExtension = function(cons,ext) {
	if (cons.addExtension) cons.addExtension(ext);
	else cons(ext);
};
var ep = function() {
	  this.extensions = [];
	  this.consumers = [];
	  var that = this;
	  this.registerConsumer = function(cons) {
	    that.consumers.push(cons);
	    for (var i=0; i<that.extensions.length; i++) addExtension(cons, that.extensions[i]);
	  };
	  this.addExtension = this.add = function(ext) {
	    that.extensions.push(ext);
	    for (var i=0; i<that.consumers.length; i++) addExtension(that.consumers[i],ext);
	  };
      this.clear = function() {
        that.extensions = [];
      };
	};
var proxyChain = function() {return {Chain:new ep};};
window.Ecwid = {
	MessageBundles:(window.Ecwid && window.Ecwid.MessageBundles) ? window.Ecwid.MessageBundles : {},
	ExtensionPoint:ep,
	ProductBrowser : {Links:new ep,
			CategoryView:proxyChain()
			},
	Controller : proxyChain(),
	ShoppingCartController : proxyChain(),
	ProductModel : proxyChain(),
	CategoriesModel : proxyChain(),
	CategoryModel : proxyChain(),
	AppContainer : proxyChain(),
	Profile : proxyChain(),
	CustomerCredentialsModel : proxyChain(),
	LocationHashModel : proxyChain(),
	OnAPILoaded: new ep,
	OnPageLoad: new ep,
	OnSetProfile: new ep,
	OnPageLoaded: new ep,
	OnConfigLoaded: new ep,
    OnCartChanged: new ep,
    OnProductOptionsChanged: new ep
	};
	
window.Ecwid.postFBWithParam = function(fb, endpoint, params, callback) {
	if (!(params instanceof Object) && typeof params === 'object') {
		params = (function(source) {
			if (null == source || "object" != typeof source) return source;
			var target = {}; 
			for (var attr in source) {
				if (source.hasOwnProperty(attr)) target[attr] = source[attr];
			}
			return target;
		})(params);
	}
	fb.api(endpoint, 'POST', params, callback);
}

xInjectJs("https://d3fi9i0jj23cau.cloudfront.net/gz/19.2-230-gaf285f3/functions.js");
window.Ecwid.MessageBundles['ru.cdev.xnext.client']={};
window.Ecwid.MessageBundles['ru.cdev.gwt.client']={};

if (window.top != window && document.referrer) {
	var hash_position = document.referrer.lastIndexOf('#!/');
	if (hash_position == -1) {
		// compatibility with old hashes
		// TODO: remove it 
		hash_position = document.referrer.lastIndexOf('#ecwid:');
	}
	if (hash_position != -1) {
		var hash = document.referrer.substr(hash_position);
		var loc = window.location.href;
		if (loc.indexOf('#') == -1) window.location.replace(loc + hash);
		else {
			if (loc.substr(loc.indexOf('#')) != hash) window.location.replace(loc.substr(0, loc.indexOf('#')) + hash);
		}
	}
	if (typeof ecwid_history_token != 'undefined') {
		var loc = window.location.href;		
		if(hash_position != -1)
			window.location.replace(loc.substr(0, loc.indexOf('#')) + ecwid_history_token);
		else
			window.location.replace(loc + '#' + ecwid_history_token);
	}		
}

if(!window.ecwid_nocssrewrite) {
    var html_id = null;
    var html_tag = document.getElementsByTagName("html");
    if(html_tag && html_tag.length) {
        html_tag = html_tag[0];
        if(!html_tag.id) html_tag.id = "ecwid_html";
        html_id = html_tag.id;
    }

    var body_id = null;
    var body_tag = document.getElementsByTagName("body");
    if(body_tag && body_tag.length) {
        body_tag = body_tag[0];
        if(!body_tag.id) body_tag.id = "ecwid_body";
        body_id = body_tag.id;
    }

    if(html_id || body_id) {
        css_selectors_prefix = "";
        if(html_id) {
            css_selectors_prefix += "html%23"+html_id;
        }
        if(html_id && body_id) css_selectors_prefix += "%20";
        if(body_id) {
            css_selectors_prefix += "body%23"+body_id;
        }
    }
}

window.ecwid_assets_url="https://d3fi9i0jj23cau.cloudfront.net/gz/19.2-230-gaf285f3/";
window.ecwid_script_base="https://d3fi9i0jj23cau.cloudfront.net/gz/19.2-230-gaf285f3/";
window.ecwid_url="https://app.ecwid.com/";



if (!window.amazon_image_domain) {
	window.amazon_image_domain = "https://dpbfm6h358sh7.cloudfront.net";
}

var ecwid_onBodyDoneTimerId,ecwid_bodyDone;
function ecwid_no_fb_iframe() {
	return !window.location.href.match(/fb_xd_fragment/g);
}
function ecwid_onBodyDone() {
    if (!ecwid_bodyDone && ecwid_no_fb_iframe() && !window.ecwid_dynamic_widgets || window.ecwid_dynamic_widgets) {
    	ecwid_bodyDone = true;
    	window.ecwid_script_defer = true;

		var cssUrlAddition = (document.documentMode==7?'&IE8-like-IE7':'')+(window.css_selectors_prefix? '&id-selector='+window.css_selectors_prefix:'')+((function() {return 'ontouchstart' in window || !!(window.DocumentTouch && document instanceof DocumentTouch);})()?'&hover=disable':'');

		// ========================= NOCACHE BEGIN =========================
		ru_cdev_xnext_frontend_Main=function(){var db='',ab=' top: -1000px;',Ab='" for "gwt:onLoadErrorFn"',yb='" for "gwt:onPropertyErrorFn"',jb='");',Bb='#',kc='.cache.js',Db='/',Jb='//',bc='429CE796375409C050705DECED6DC22C',cc='8FD47B8403CFF1E782579B3F0AC97E70',dc='9A5C7638BF0BA64B8D152DF004E9ADD5',jc=':',sb='::',xc=':moduleBase',cb='<!doctype html>',eb='<html><head><\/head><body><\/body><\/html>',vb='=',Cb='?',ec='B4E33C141FC25972D764C7EB41CD6E94',fc='B5B9B8859A8DFC438C8D4EB96035702D',gc='BBD415BB0AB2D319729AA188A520D6EC',xb='Bad handler "',hc='CCC8259D4C97381AE910EBBCC8C1986B',bb='CSS1Compat',hb='Chrome',gb='DOMContentLoaded',X='DUMMY',ic='ECB53BC20DCA0B26187C021A0E38F2B1',qc='https://d21tbovnt7w6kc.cloudfront.net/css?ownerid=5236037&h=952983840&lang=en&secure'+cssUrlAddition,wc='Ignoring non-whitelisted Dev Mode URL: ',vc='__gwtDevModeHook:ru.cdev.xnext.frontend.Main',uc='_gwt_dummy_',Mb='android',Ib='base',Gb='baseUrl',S='begin',Y='body',R='bootstrap',Fb='clear.cache.gif',ub='content',Nb='desktop',rc='end',ib='eval("',tc='file:',Zb='gecko',$b='gecko1_8',T='gwt.codesvr.ru.cdev.xnext.frontend.Main=',U='gwt.codesvr=',zb='gwt:onLoadErrorFn',wb='gwt:onPropertyErrorFn',tb='gwt:property',ob='head',oc='href',sc='http:',Vb='ie10',Yb='ie6',Xb='ie8',Wb='ie9',Z='iframe',Eb='img',Pb='ipad',Ob='iphone',Qb='ipod',lb='javascript',$='javascript:""',lc='link',pc='loadExternalRefs',pb='meta',Kb='mgwt.os',nb='moduleRequested',mb='moduleStartup',Ub='msie',qb='name',Sb='opera',_='position:absolute; width:0; height:0; border:none; left: -1000px;',mc='rel',V='ru.cdev.xnext.frontend.Main',ac='ru.cdev.xnext.frontend.Main.devmode.js',Hb='ru.cdev.xnext.frontend.Main.nocache.js',rb='ru.cdev.xnext.frontend.Main::',Lb='safari',kb='script',_b='selectingPermutation',W='startup',nc='stylesheet',fb='undefined',Rb='user.agent',Tb='webkit';var o;var p=window;var q=document;s(R,S);function r(){var a=p.location.search;return a.indexOf(T)!=-1||a.indexOf(U)!=-1}
function s(a,b){if(p.__gwtStatsEvent){p.__gwtStatsEvent({moduleName:V,sessionId:p.__gwtStatsSessionId,subSystem:W,evtGroup:a,millis:(new Date).getTime(),type:b})}}
ru_cdev_xnext_frontend_Main.__sendStats=s;ru_cdev_xnext_frontend_Main.__moduleName=V;ru_cdev_xnext_frontend_Main.__errFn=null;ru_cdev_xnext_frontend_Main.__moduleBase=X;ru_cdev_xnext_frontend_Main.__softPermutationId=0;ru_cdev_xnext_frontend_Main.__computePropValue=null;ru_cdev_xnext_frontend_Main.__getPropMap=null;ru_cdev_xnext_frontend_Main.__gwtInstallCode=function(){};ru_cdev_xnext_frontend_Main.__gwtStartLoadingFragment=function(){return null};var t=function(){return false};var u=function(){return null};__propertyErrorFunction=null;var v=p.__gwt_activeModules=p.__gwt_activeModules||{};v[V]={moduleName:V};var w;function A(){C();return w}
function B(){C();return w.getElementsByTagName(Y)[0]}
function C(){if(w){return}var a=q.createElement(Z);a.src=$;a.id=V;a.style.cssText=_+ab;a.tabIndex=-1;q.body.appendChild(a);w=a.contentDocument;if(!w){w=a.contentWindow.document}w.open();var b=document.compatMode==bb?cb:db;w.write(b+eb);w.close()}
function D(k){function l(a){function b(){if(typeof q.readyState==fb){return typeof q.body!=fb&&q.body!=null}return /loaded|complete/.test(q.readyState)}
var c=b();if(c){a();return}function d(){if(!c){c=true;a();if(q.removeEventListener){q.removeEventListener(gb,d,false)}if(e){clearInterval(e)}}}
if(q.addEventListener){q.addEventListener(gb,d,false)}var e=setInterval(function(){if(b()){d()}},50)}
function m(c){function d(a,b){a.removeChild(b)}
var e=B();var f=A();var g;if(navigator.userAgent.indexOf(hb)>-1&&(window.JSON&&window.JSON.stringify)){var h=f.createDocumentFragment();h.appendChild(f.createTextNode(ib));for(var i=0;i<c.length;i++){var j=window.JSON.stringify(c[i]);h.appendChild(f.createTextNode(j.substring(1,j.length-1)))}h.appendChild(f.createTextNode(jb));g=f.createElement(kb);g.language=lb;g.appendChild(h);e.appendChild(g);d(e,g)}else{for(var i=0;i<c.length;i++){g=f.createElement(kb);g.language=lb;g.text=c[i];e.appendChild(g);d(e,g)}}}
ru_cdev_xnext_frontend_Main.onScriptDownloaded=function(a){l(function(){m(a)})};s(mb,nb);var n=q.createElement(kb);n.src=k;q.getElementsByTagName(ob)[0].appendChild(n)}
ru_cdev_xnext_frontend_Main.__startLoadingFragment=function(a){return H(a)};ru_cdev_xnext_frontend_Main.__installRunAsyncCode=function(a){var b=B();var c=A().createElement(kb);c.language=lb;c.text=a;b.appendChild(c);b.removeChild(c)};function F(){var c={};var d;var e;var f=q.getElementsByTagName(pb);for(var g=0,h=f.length;g<h;++g){var i=f[g],j=i.getAttribute(qb),k;if(j){j=j.replace(rb,db);if(j.indexOf(sb)>=0){continue}if(j==tb){k=i.getAttribute(ub);if(k){var l,m=k.indexOf(vb);if(m>=0){j=k.substring(0,m);l=k.substring(m+1)}else{j=k;l=db}c[j]=l}}else if(j==wb){k=i.getAttribute(ub);if(k){try{d=eval(k)}catch(a){alert(xb+k+yb)}}}else if(j==zb){k=i.getAttribute(ub);if(k){try{e=eval(k)}catch(a){alert(xb+k+Ab)}}}}}u=function(a){var b=c[a];return b==null?null:b};__propertyErrorFunction=d;ru_cdev_xnext_frontend_Main.__errFn=e}
function G(){if(window.ecwid_script_base){o=window.ecwid_script_base;return o}function e(a){var b=a.lastIndexOf(Bb);if(b==-1){b=a.length}var c=a.indexOf(Cb);if(c==-1){c=a.length}var d=a.lastIndexOf(Db,Math.min(c,b));return d>=0?a.substring(0,d+1):db}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=q.createElement(Eb);b.src=a+Fb;a=e(b.src)}return a}
function g(){var a=u(Gb);if(a!=null){return a}return db}
function h(){var a=q.getElementsByTagName(kb);for(var b=0;b<a.length;++b){if(a[b].src.indexOf(Hb)!=-1){return e(a[b].src)}}return db}
function i(){var a=q.getElementsByTagName(Ib);if(a.length>0){return a[a.length-1].href}return db}
function j(){var a=q.location;return a.href==a.protocol+Jb+a.host+a.pathname+a.search+a.hash}
var k=g();if(k==db){k=h()}if(k==db){k=i()}if(k==db&&j()){k=e(q.location.href)}k=f(k);return k}
function H(a){if(a.match(/^\//)){return a}if(a.match(/^[a-zA-Z]+:\/\//)){return a}return ru_cdev_xnext_frontend_Main.__moduleBase+a}
function I(){var f=[];var g=0;function h(a,b){var c=f;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
var i=[];var j=[];function k(a){var b=j[a](),c=i[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(__propertyErrorFunc){__propertyErrorFunc(a,d,b)}throw null}
j[Kb]=function(){{var b=function(){var a=window.navigator.userAgent.toLowerCase();if(a.indexOf(Lb)==-1&&a.indexOf(Mb)!=-1){return Nb}if(a.indexOf(Mb)!=-1||(a.indexOf(Ob)!=-1||(a.indexOf(Pb)!=-1||a.indexOf(Qb)!=-1))){return Ob}return Nb}();return b}};i[Kb]={desktop:0,iphone:1};j[Rb]=function(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Sb)!=-1}())return Sb;if(function(){return b.indexOf(Tb)!=-1}())return Lb;if(function(){return b.indexOf(Ub)!=-1&&q.documentMode>=10}())return Vb;if(function(){return b.indexOf(Ub)!=-1&&q.documentMode>=9}())return Wb;if(function(){return b.indexOf(Ub)!=-1&&q.documentMode>=8}())return Xb;if(function(){var a=/msie ([0-9]+)\.([0-9]+)/.exec(b);if(a&&a.length==3)return c(a)>=6000}())return Yb;if(function(){return b.indexOf(Zb)!=-1}())return $b;return Lb};i[Rb]={gecko1_8:0,ie10:1,ie6:2,ie8:3,ie9:4,opera:5,safari:6};t=function(a,b){return b in i[a]};ru_cdev_xnext_frontend_Main.__getPropMap=function(){var a={};for(var b in i){if(i.hasOwnProperty(b)){a[b]=k(b)}}return a};ru_cdev_xnext_frontend_Main.__computePropValue=k;p.__gwt_activeModules[V].bindings=ru_cdev_xnext_frontend_Main.__getPropMap;s(R,_b);if(r()){return H(ac)}var l;try{h([Nb,Sb],bc);h([Nb,Xb],cc);h([Nb,Lb],dc);h([Nb,Yb],ec);h([Nb,Wb],fc);h([Ob,Lb],gc);h([Nb,$b],hc);h([Nb,Vb],ic);l=f[k(Kb)][k(Rb)];var m=l.indexOf(jc);if(m!=-1){g=parseInt(l.substring(m+1),10);l=l.substring(0,m)}}catch(a){}ru_cdev_xnext_frontend_Main.__softPermutationId=g;return H(l+kc)}
function J(){if(!p.__gwt_stylesLoaded){p.__gwt_stylesLoaded={}}function c(a){if(!__gwt_stylesLoaded[a]){var b=q.createElement(lc);b.setAttribute(mc,nc);b.setAttribute(oc,H(a));q.getElementsByTagName(ob)[0].appendChild(b);__gwt_stylesLoaded[a]=true}}
s(pc,S);c(qc);s(pc,rc)}
F();ru_cdev_xnext_frontend_Main.__moduleBase=G();v[V].moduleBase=ru_cdev_xnext_frontend_Main.__moduleBase;var K=I();if(p){var L=!!(p.location.protocol==sc||p.location.protocol==tc);p.__gwt_activeModules[V].canRedirect=L;function M(){var b=uc;try{p.sessionStorage.setItem(b,b);p.sessionStorage.removeItem(b);return true}catch(a){return false}}
if(L&&M()){var N=vc;var O=p.sessionStorage[N];if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.*$/.test(O)){if(O&&(window.console&&console.log)){console.log(wc+O)}O=db}if(O&&!p[N]){p[N]=true;p[N+xc]=G();var P=q.createElement(kb);P.src=O;var Q=q.getElementsByTagName(ob)[0];Q.insertBefore(P,Q.firstElementChild||Q.children[0]);return false}}}J();s(R,rc);D(K);return true}
ru_cdev_xnext_frontend_Main.succeeded=ru_cdev_xnext_frontend_Main();
		// ========================= NOCACHE END ===========================

		if (document.removeEventListener) {
			document.removeEventListener("DOMContentLoaded", ecwid_onBodyDone, false);
		}
		if (ecwid_onBodyDoneTimerId) {
			clearInterval(ecwid_onBodyDoneTimerId);
		}
    }
}

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", function() {
		ecwid_onBodyDone();
	}, false);
}

// Fallback. If onBodyDone() gets fired twice, it's not a big deal.
var ecwid_onBodyDoneTimerId = setInterval(function() {
	if (/loaded|complete/.test(document.readyState)) {
		ecwid_onBodyDone();
	}
}, 50);

window.xnext_ownerId=5236037;
window.Ecwid.demo=false;
window.Ecwid.cssUrl="https://d21tbovnt7w6kc.cloudfront.net/css?ownerid=5236037&h=952983840&lang=en&secure";
window.Ecwid.acceptLanguage=["en"];

		var gaScriptSrc = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';

	if (window.ecwid_script_defer) {
		var gaScript = document.createElement("script");
		gaScript.setAttribute("src", gaScriptSrc);
		gaScript.charset = "utf-8";
		gaScript.setAttribute("type", "text/javascript");
		document.body.appendChild(gaScript);
	} else {
		document.write(unescape("%3Cscript src='"+gaScriptSrc+"' type='text/javascript'%3E%3C/script%3E"));
	}

function xAddWidget(widgetType, arg) {

	arg = Array.prototype.slice.call(arg); // Cast Argument object into array

	var idPrefix = "id=";
	var id;
	var stylePrefix = "style=";
	var style = "";
	for (var i=0; i<arg.length; i++) {
		if (arg[i].substr(0,stylePrefix.length) == stylePrefix) {
			var str = arg[i].substr(stylePrefix.length);
			str = str.replace(/^ +\'?/,"").replace(/\'? +$/,"");
			if (str.substring(0,1)=="'") str = str.substring(1);
			if (str.substring(str.length-1)=="'") str = str.substring(0, str.length-1);
			style += str;
		}
		if (arg[i].substr(0, idPrefix.length) == idPrefix) {
			id = arg[i].substr(idPrefix.length);
		}
	}

	var hashParams = window.location.hash.match(/.*\/(.*)$/);
	if (hashParams && hashParams.length > 1) {
		hashParams = hashParams[1].split('&');
		for (i = 0; i < hashParams.length; i++) {
			var hashParam = hashParams[i];
			var paramPrefix = '_x' + widgetType + '_';
			if (hashParam.indexOf(paramPrefix) != 0) {
				continue;
			}
			hashParam = hashParam.split('=');
			if (hashParam.length != 2) {
				continue;
			}
			var paramName = hashParam[0].replace(paramPrefix, '');
			var paramValue = decodeURIComponent(hashParam[1]);
			var replaceIndex = arg.length;
			for (var j = 0; j < arg.length; j++) {
				if (arg[j].indexOf(paramName + '=') == 0) {
					replaceIndex = j;
					break;
				}
			}
			arg[replaceIndex] = paramName + '=' + paramValue;
		}
	}

	if(id && document.getElementById(id)) {
		var e = document.getElementById(id);
		while(e.hasChildNodes()) e.removeChild(e.firstChild);
		e.setAttribute("style", style);
		try { e.style.cssText = style; } catch(e) { } // IE
	} else {
		i=1;
		do {
			id = widgetType+"-"+i++;
		} while (document.getElementById(id));
		var html = "<div id='"+id+"'";
		if(style) {
			html += " style='"+style+"'";
		}
		html += "></div>";
		document.write(html);
	}
	var l = 0;
	if (!window._xnext_initialization_scripts) {
		window._xnext_initialization_scripts = [];
	} else {
		l = window._xnext_initialization_scripts.length;
	}
	window._xnext_initialization_scripts[l] = {widgetType:widgetType, id:id, arg:arg};
    window.ecwid_dynamic_widgets && ecwid_onBodyDone();
}

function xProductBrowser() {
	ecwid_loader();
    window.ecwid_dynamic_widgets && Ecwid.destroy();
	xAddWidget("ProductBrowser", arguments);
}
function ecwid_loader() {
	if (!window.ecwid_loader_shown && ecwid_no_fb_iframe()) {
		if (!window.ecwid_use_custom_loading_indicator && !window.ecwid_script_defer) {
			document.write("<table id='ecwid_loading_indicator' cellpadding='0' cellspacing='0' style='width:100%;background-color:transparent;'><tr><td style='padding:30px;text-align:center'><img src='https://d3fi9i0jj23cau.cloudfront.net/gz/19.2-230-gaf285f3/icons/loadingAnimation.gif'/></td></tr></table>");
		}
		window.ecwid_loader_shown = true;
	}
}
function xAddToBag() {
    xAddWidget("AddToBag", arguments);
}
function xProductThumbnail() {
    xAddWidget("ProductThumbnail", arguments);
}
function xLoginForm() {
	xAddWidget("LoginForm", arguments);
}
function xMinicart() {
	xAddWidget("Minicart", arguments);
}
function xCategories() {
	ecwid_loader();
	xAddWidget("Categories", arguments);
}
function xVCategories() {
	xAddWidget("VCategories", arguments);
}
function xSearchPanel() {
	xAddWidget("SearchPanel", arguments);
}
function xGadget() {
	xAddWidget("Gadget", arguments);
}
	
function xSingleProduct() {
	xAddWidget("SingleProduct", arguments)
}	
function xAffiliate(id) { Ecwid.affiliateId = id; }

if (typeof xInitialized == 'function') xInitialized();

if (!(window.ecwid_no_body_height && window.ecwid_no_body_height == true)) {
if (/MSIE .+Win/.test(navigator.userAgent)) {
  var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
} else {
  var clientHeight = window.innerHeight-20;
}
document.body.style.minHeight = clientHeight+"px";
}
}


} catch (e) {
    function xReportError(msg) {
    	var html = "<table style='width:100%'><tr><td align='center'><div style='background-color:white;text-align:left;width: 300px;border: 5px #8080ff solid; padding: 20px'><img style='border:none;float:left;margin:0 20px 5px 0' src='http://my.ecwid.com/icons/msg_error.gif'>"+msg+"</div></td></tr></table>";
    	if (window.ecwid_script_defer) {
    	    var element = document.createElement("div");
    	    element.innerHTML = html;
    	    document.body.appendChild(element);
    	} else document.write(html);
    }

	var commonError = "The store cannot be loaded in your browser because of some JavaScript errors, sorry.<br/>" +
			"If you open this site using a mobile device, you can visit our <a href='http://loja.descontom.com'>mobile store</a> " +
			"which is designed specially for them and doesn't use JavaScript.<br/><br/>" +
			"Below here's the exact error occurred. Please report it to the <a href='http://www.ecwid.com/bt'>issue tracker</a>.<br/><br/>";

	var bodyTagError = "This document doesn't contain the required " +
			"<a href='http://www.htmldog.com/reference/htmltags/body/'>&lt;body&gt; and &lt;/body&gt;</a> "+
            "tags. Thus your Ecwid store cannot be loaded. " +
            "Please add these tags and refresh the page. This message will disappear and you will see your store.";

	var isWindowsMobile2005 = /(msie 4).*(windows ce)/i.test(navigator.userAgent);

    if (!document.body && !isWindowsMobile2005)  {
        xReportError(bodyTagError);
	} else {
		xReportError(commonError + e.message);
	}

	throw e;
}
