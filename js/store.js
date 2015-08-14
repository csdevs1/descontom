
var viewport = (document.compatMode === "CSS1Compat") ? document.documentElement : document.body;
var nav_cache = new Array();
var title_cache = new Array();
var is_mobile = mobilecheck();
var scroll_started = false;
var is_touch = ("ontouchstart" in document.documentElement);

// test for touch events support
if (!is_touch)
    document.getElementsByTagName("body")[0].className += ' no-touch';

// test for css3 transition support
if (!detectCSSFeature("transition"))
    document.getElementsByTagName("body")[0].className += ' no-transition';

// test for media queries support
if (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined") {
    document.getElementsByTagName("body")[0].className += ' no-media-queries';
}

// Internet Explorer 9-
var isIElte9 = document.all && !window.atob;
if (isIElte9)
    document.getElementsByTagName("body")[0].className += ' ie-lte-9';

var loading_timeoutID;
var is_loading_on = false;
var delay_loading_hide = 0;
var minicart_width;

if (!isIElte9) {
	window.ecwid_use_custom_loading_indicator = true;
	window.ecwid_external_loading_indicator = {
		show: function(delay_loading_show) {
			if (typeof loading_timeoutID === "undefined") {
				delay_loading_show = 0;
			}
			loading_timeoutID = setTimeout(function(){
				showLoading();
			}, delay_loading_show);
		},
		hide: function() {
				clearTimeout(loading_timeoutID);
				setTimeout(function(){
					hideLoading();
				}, delay_loading_hide);
		}
	}
}

if (getRequestParam("noscroll") == "true") {
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

if (typeof(Ecwid) == 'object') {
	Ecwid.OnAPILoaded.add(function() {
		Ecwid.OnPageLoaded.add(function(page) {

			var body = document.getElementsByTagName("body")[0];
			classie.add(body, 'ecwid-starter-site');

			if (!classie.has(document.getElementsByTagName("body")[0], 'ecwid-loaded')) {

				addHelper();
				var pb_obj = getElementsByClassName('ecwid-productBrowser')[0];

				// Get background-color
				var bgColor = getStyle( pb_obj, 'background-color');
				if (bgColor == 'transparent' || bgColor == 'rgba(0, 0, 0, 0)')
					bgColor = '#fff';

				// Get link color
				var linkColor = getStyle( pb_obj.getElementsByTagName('a')[0], 'color');

				// Get text color
				var color = getStyle(getElementsByClassName('ecwid-productBrowser-head')[0], 'color');

				// Get bgcolor for selected category
				var csel_obj = document.querySelector('.ecwid-helper .ecwid-AccentedButton');
				var csel_rgb = tinycolor(getStyle(csel_obj, 'background-color')).toRgb();
				var colorBag = tinycolor({r: csel_rgb.r, g: csel_rgb.g, b: csel_rgb.b}).toRgbString();
				var bgColorSelectedCategory = tinycolor({r: csel_rgb.r, g: csel_rgb.g, b: csel_rgb.b, a:0.7}).toRgbString();

				// Get product border 
				var pb_obj = getElementsByClassName('ecwid-minicart-label-text')[0];
				var pb_rgb = tinycolor(getStyle(pb_obj, 'color')).toRgb();
				var borderColorMouseover = tinycolor({r: pb_rgb.r, g: pb_rgb.g, b: pb_rgb.b, a:0.5}).toRgbString();

				// Get Search icon color
				var colorSearch = tinycolor({r: csel_rgb.r, g: csel_rgb.g, b: csel_rgb.b, a: 0.5}).toRgbString();

				// Get border color
				var b_objs = getElementsByClassName('ecwid-productBrowser-cart-itemsTable-cell');
				var b_obj = getElementsByClassName('ecwid-productBrowser-cart-itemsTable-cell')[b_objs.length-1];
				var b_rgb = tinycolor(getStyle(b_obj, 'border-bottom-color')).toRgb();
				var borderColor = tinycolor({r: b_rgb.r, g: b_rgb.g, b: b_rgb.b}).toRgbString();

				var borderColor60 = tinycolor({r: b_rgb.r, g: b_rgb.g, b: b_rgb.b, a: 0.6}).toRgbString();
				var boxShadowLoader = tinycolor({r: b_rgb.r, g: b_rgb.g, b: b_rgb.b, a: 0.15}).toRgbString();

				var tc = tinycolor.darken(bgColor, 7);
				var bgColorStore = tc.toString('hex');

				// Get store title color
				var cap_obj = getElementsByClassName('ecwid-minicart-caption')[0];
				var titleColor = tinycolor(getStyle(cap_obj, 'color')).toString('hex');

				// Get 'Open bag' link color
				var bag_obj = getElementsByClassName('ecwid-minicart-link')[0];
				var bagLinkColor = getStyle( bag_obj.getElementsByTagName('span')[0], 'color');

				// Get bag caption width
				var caption_obj = getElementsByClassName('ecwid-minicart-caption')[0];
				var caption = caption_obj.childNodes[0].nodeValue;

				var new_span = document.createElement('span');
				new_span.className = 'ecwid-minicart-caption-text';
				new_span.innerHTML = caption;

				caption_obj.removeChild(caption_obj.childNodes[0]);
				caption_obj.appendChild(new_span);

				// Move the minicart counter to the caption
				var minicart_clickArea = getElementsByClassName('ecwid-minicart-clickArea')[0];
				var parent_counter = minicart_clickArea.parentNode.parentNode;
				caption_obj.appendChild(parent_counter);
				var minicart_counter = getElementsByClassName('ecwid-minicart-counter')[0];
				var minicart_counter_parent = minicart_counter.parentNode;
				var clickarea_obj_parent = minicart_clickArea.parentNode;
				caption_obj.insertBefore(clickarea_obj_parent, new_span);

				// Set placehoder @input search
				var input_obj = getElementsByClassName('ecwid-SearchPanel-field')[0];
				input_obj.setAttribute('placeholder', 'Product Search');
				inputPlaceholder(input_obj, '#999');

				// Add icon search
				var btn_obj = getElementsByClassName('ecwid-SearchPanel-button')[0];
				btn_obj.innerHTML = '<span class="ecwid-icons-search"></span>';

				// build Categories menu 
				if (data.categories.length > 0) {
					document.getElementById('menu').innerHTML = buildNav(data.categories, false);
					document.getElementById('menu-more').innerHTML = '<ul class="nav"><li class="right parent">' +
					'<a href="#">' + msg('StarterSite.more', "{1} more").replace('{1}', '<span class="more-count"></span>') + '</a>' +
					buildNav(data.categories, true) +
					'</li></ul>';

					if (!isIElte9) {
						document.getElementById('push-menu').innerHTML = buildPushMenu(data.categories, null);
						new pushMenu( document.getElementById( 'push-menu' ), document.getElementById( 'push-menu-trigger' ) );
					}
				} 
				else
					classie.add(body, 'no-categories');

				// Compose css
				var css = 'body { background-color: '+ bgColorStore +'; }\n' +
				'html#ecwid_html body#ecwid_body .ecwid .ecwid-productBrowser { background-color: '+ bgColor +'; }\n' +
				'html#ecwid_html body#ecwid_body .ecwid .ecwid-productBrowser-categoryPath a, html#ecwid_html body#ecwid_body .cwid .ecwid-productBrowser-categoryPath a:active, html#ecwid_html body#ecwid_body .ecwid .ecwid-productBrowser-categoryPath a:visited, html#ecwid_html body#ecwid_body .ecwid a, html#ecwid_html body#ecwid_body .ecwid a:active, html#ecwid_html body#ecwid_body .ecwid a:visited { color: '+ linkColor +'; }\n' +
				'.header-outer, .footer-outer { opacity: 1; color: '+ color +'; background-color: '+ bgColor +'; }\n' +
				'.site-title a { color: '+ titleColor +'; }\n' +
				'footer a { color: '+ linkColor +'; }\n' +
				'.header-outer { border-bottom-color: '+ borderColor +'; border-bottom-color: '+ borderColor60 +'; }\n' +
				'.footer-outer { border-top-color: '+ borderColor +'; border-top-color: '+ borderColor60 +'; }\n' +
				'.site-search:before { border-left-color: ' + borderColor + ' }\n' +
				'.ecwid-SearchPanel .ecwid-SearchPanel-button { color: ' + colorSearch + ' }\n' +
				'html#ecwid_html body#ecwid_body .ecwid div.ecwid-minicart { background: '+ bgColorStore +'; }\n' +
				'html#ecwid_html body#ecwid_body .ecwid div.ecwid-minicart-clickArea { color: '+ colorBag +'; }\n' +
				'html#ecwid_html body#ecwid_body .ecwid div.ecwid-minicart-counter { color: '+ bagLinkColor +'; }\n' +
			 	'html#ecwid_html body#ecwid_body .ecwid div.ecwid-minicart-clickArea { opacity: 1; }\n' +
				'.push-menu-trigger { color: '+ colorSearch +'; }\n' +
				'.mp-level { background: '+ bgColor +'; }\n' +
				' html#ecwid_html body#ecwid_body .push-menu > .mp-level.mp-level-open > h2, .mp-back { color: '+ linkColor +'; background: ' + bgColorStore + '}\n' +
				'.push-menu ul { background: ' + bgColor + '}\n' +
				'.push-menu ul li > a,  .mp-current { color: '+ linkColor +'; }\n' +
				'.push-menu li > a:hover, .mp-current a:hover { color: #fff; background: '+ bgColorSelectedCategory +'; }\n' +
				'.ecwid-loaded .navigation { background-color: '+ bgColor +'; }\n' +
				'.ecwid-loaded .nav a { color: '+ linkColor +'; }\n' +
				'.ecwid-loaded .nav .active > a, .ecwid-loaded .nav .hover > a, .no-touch .nav > a:hover, .no-touch .nav li:hover > a, .nav > a.hover, .nav li.hover > a { color: #fff; }\n' +
				'.ecwid-loaded .nav .active > a, .ecwid-loaded .nav .hover > a, .no-touch .nav li:hover > a, .nav li.hover > a { background: '+ bgColorSelectedCategory +'; }\n' +
				'.ecwid-loaded .nav .parent > div { background: '+ bgColor +'; border-color: '+ borderColor60 +'; }\n'+
				'.ecwid-ready .spinner-container svg { fill: '+ bagLinkColor +'; }\n' +
				'.ecwid-ready .loading-inner { background-color: '+ bgColor +'; }\n' +
				'.ecwid-ready .ecwid-loading { background-color: ' + borderColor60 + '}\n' +
				'@media only screen and (max-width: 599px) { .ecwid-loaded { background: ' + bgColor + '; } }';

				// Add custom css to head
				head = document.getElementsByTagName('head')[0],
				style = document.createElement('style');
				style.type = 'text/css';
				if (style.styleSheet) {
					style.styleSheet.cssText = css;
				} else {
					style.appendChild(document.createTextNode(css));
				}
				head.appendChild(style);

				// Show the page content
				classie.add(body, 'ecwid-loaded');

				initComponents();

				setTimeout(function(){
					classie.add(body, 'ecwid-ready');
				}, 600);

			}

			Ecwid.OnCartChanged.add(function(cart){
				if (cart === null) {
					return;
				}
				var el = getElementsByClassName('ecwid-minicart-clickArea')[0];
				if (cart.productsQuantity > 0)
					classie.add( el, 'ecwid-minicart-not-empty' );
				else
					classie.remove( el, 'ecwid-minicart-not-empty' );

				storeMinicart._calc();
				storeMinicart.update();
			});
		});
});
}

window.addEventListener('resize', function(){
	updateHeader();
	setNavigation();
}, false);

window.addEventListener('scroll', function(){
	updateHeader();
}, false);


function initComponents() {
	storeTitle = new storeTitle( getElementsByClassName('site-title')[0] );
	storeSearch = new storeSearch( getElementsByClassName('ecwid-SearchPanel')[0] );
	storeMinicart = new storeMinicart( getElementsByClassName('minicart')[0] );
	initNavigation();
	updateHeader();
}

function updateHeader() {

	if(typeof storeTitle.setWidth !== 'function') return;

	var modes = ['minicart-long', 'minicart-short', 'minicart-hide', 'title-short'];
	var header  = getElementsByClassName('header-inner')[0];
	var max = parseInt(getStyle(header, 'width'), 10); 
	var spacer = 10;
	var storeTitleWidth = (max < 600) ? 70 : storeTitle.width;
	var sum = storeTitleWidth + storeSearch.width + storeMinicart.s_width;

	for (var i = 0; i < modes.length; i++) {
		// check mode
		switch(modes[i]) {
			case 'minicart-long':
				sum = storeTitleWidth + storeSearch.width + storeMinicart.l_width + spacer;
				break;
			case 'minicart-short':
				sum = storeTitleWidth + storeSearch.width + storeMinicart.s_width + spacer;
				break;
			case 'minicart-hide':
				sum = (storeSearch.mode == 'expanded') ? storeTitle.width + storeSearch.width : storeTitleWidth + storeSearch.width + storeMinicart.s_width + spacer;
				break;
			case 'title-short':
				sum = max;
				break;
		}
		// apply mode
		if (sum <= max) {
			switch(modes[i]) {
				case 'minicart-long':
					storeMinicart.mode = 'long';
					storeTitle.setWidth('auto');
					break;
				case 'minicart-short':
					storeMinicart.mode = 'short';
					storeTitle.setWidth('auto');
					break;
				case 'minicart-hide':
					storeMinicart.mode = (storeSearch.mode == 'expanded') ? 'hide' : 'short';
					if (max > 579) {
						if (storeSearch.mode == 'expanded') {
							storeTitle.setWidth(max - storeSearch.width - spacer);
						}
						else {
							storeTitle.setWidth(max - storeSearch.width - storeMinicart.s_width - spacer);
						}
					}
					else {
						storeTitle.setWidth('auto');
					}
					break;
				case 'title-short':
					storeMinicart.mode = (storeSearch.mode == 'expanded' && ( max < 400 )) ? 'hide' : 'short';
					if (max < 600) {
						storeTitle.setWidth('auto');
					}
					else {
						if (max > 579) {
							if (storeSearch.mode == 'expanded') {
								storeMinicart.mode = 'hide';
								storeTitle.setWidth(max - storeSearch.width - spacer);
							}
							else {
								storeTitle.setWidth(max - storeSearch.width - storeMinicart.s_width - spacer);
							}
						}
						else 
							storeTitle.setWidth('auto');
					}
					break;
			}
		
			break;
		}
	}

	storeTitle.update();
	storeSearch.update();
	storeMinicart.update();
}

function storeTitle(el) {
	this.el = el;
	this._init();
	this.update();
}

storeTitle.prototype = {
	_init : function() {

		// Allowed font sizes
		this.fontSizes = [ '30', '24', '18', '14' ];
		
		// Store Name
		var o = getElementsByClassName('company-name')[0];
		this.storeName = (o && o.firstChild) ? encodeURIComponent(o.firstChild.nodeValue) : null;
		
		// Cache of sizes
		this.cache = [];

		// Current width
		this.width = 0;

		if (this.storeName) {
			// Font-family
			this.fontFamily = getStyle(o, 'font-family');
		
			// Max width
			var w = getStyle(o.parentNode.parentNode, 'max-width');
			this.maxWidth = (w) ? parseInt(w, 10) : 0;

			this.width = getStyle(o, 'width');
		}
		else {
			var logo = getElementsByClassName('site-logo')[0];
			if (logo) {
				var logoWidth = getStyle(logo, 'width');
				this.width = (logoWidth) ? parseInt(logoWidth, 10) : 0;
			}
		}
		
		if (this.width === 0) // no store name or logo
			classie.add(getElementsByClassName('header-outer')[0], 'no-title');

	},
	update : function() {
		self = this;
		var w;

		if (this.storeName) {

			var s = this.fontSizes[ this.fontSizes.length - 1 ];
			for (var i in this.fontSizes) {

				if (!this.cache[i]) {
					this.cache[i] = calcSize(this.storeName, 'white-space: nowrap; font-family: ' + this.fontFamily + '; font-size:' + this.fontSizes[i] + 'px');
				}

				var v = parseInt(getStyle(viewport, 'width'), 10) - (parseInt(getStyle(this.el, 'padding-left'), 10)) - (parseInt(getStyle(this.el, 'padding-right'), 10));
				if (classie.has(this.el, 'site-title-fixed'))
					w = parseInt(getStyle(this.el, 'width'), 10);
				else
					w = ( v > 580 ) ? this.maxWidth : v;

				var c = calcSize(this.storeName, 'width: ' + w + 'px; font-family: ' + this.fontFamily + '; font-size:' + this.fontSizes[i] + 'px');
				var l = (this.fontSizes[i] == 18) ? 2 : 1;

				if ((c.height / this.cache[i].height).toFixed() <= l && this.fontSizes[i] >= s ) {

						s = this.fontSizes[i];
						break;
				}
			}

			this.width = getOuterWidth('site-title');
			var a = this.el.getElementsByTagName('a')[0];
			a.style.fontSize = s + 'px';
		}
	},
	setWidth : function(w) {
		if (this.storeName) {
			var self = this;
			if (parseInt(w, 10)) {
				self.el.style.width = w + 'px';
				classie.add(self.el, 'site-title-fixed');
			}
			else {
				self.el.style.width = '';
				classie.remove(self.el, 'site-title-fixed');
			}
		}
	}
} 

function storeMinicart(el) {	
	this.el = el;
	this._init();
	this._calc();
	this.update();
}

storeMinicart.prototype = {
	_init : function() {
		// Mode: long / short / hide
		this.mode = 'long'; 
		// Current width
		this.width;
		// Width in long mode
		this.l_width;
		// Width in short mode
		this.s_width;

	},
	_calc : function () {
		var self = this;
		var v = parseInt(getStyle(viewport, 'width'), 10);

		this.l_width = getOuterWidth('minicart');
		this.s_width = getOuterWidth('minicart', 'minicart-short');

 		switch(this.mode) {
 			case 'long' :
				this.width = this.l_width;
				break;
			case 'short' :
				this.width = this.s_width;
			case 'hide' :
				this.width = 0;
				break;
		}

	},
	update : function () {
		var self = this;
		var v = parseInt(getStyle(viewport, 'width'), 10);

 		if (!this.mode)
 			this.mode = (v < 760) ? 'short' : 'long';

 		switch(this.mode) {
 			case 'long' :
 				setTimeout(function(){
					classie.remove( self.el, 'minicart-short' );
					classie.remove( self.el, 'hide' );
					var minicart_label = getElementsByClassName('ecwid-minicart-label')[0];
					minicart_label.style.display = '';
				}, 0);
				break;

			case 'short' :
				setTimeout(function(){
					classie.remove( self.el, 'hide' );
					classie.add( self.el, 'minicart-short' );
				}, 200);
				break;

			case 'hide':
				classie.add(self.el, 'hide' );
				break;
		 }

		if (this.mode == 'long') {

			classie.remove(self.el, 'hide' );
			classie.remove(self.el, 'minicart-short' );

 			var v = parseInt(getStyle(viewport, 'width'), 10);
		 	v-= (v < 980) ? 20 : 0;

		 	self.el.width = parseInt(self.el.offsetWidth, 10);
		 	var p = parseInt(getStyle(self.el.parentNode, 'width'), 10);
		 	var l = p/2 + v/2 - self.el.width;
		 	self.el.style.left = (isNaN(l)) ? '0' : l + 'px';
		 }
		 else {
		 	self.el.style.marginRight = '10px';
		 }

	}

}

/*
* Get width + margin
*/
function getOuterWidth(classBase, classExt) {
	var s, p, v, w;
	var el = getElementsByClassName(classBase)[0];
	var node = el.cloneNode(true);
	node.className = '';
	node.style.position = 'absolute';
	node.style.left = '-9999px';
	node.style.right = 'auto';
	node.style.top = '-9999px';
	node.style.bottom = 'auto';
	node.style.transition = 'none';
	classie.add(node, classBase);
	if (classExt)
		classie.add(node, classExt);

	p = getElementsByClassName('header-inner')[0];
	p.appendChild(node);

	w = parseInt(node.clientWidth, 10);
	s = ['padding-left', 'padding-right', 'margin-left', 'margin-right'];
	for(var i in s) {
		v = getStyle(node, s[i]);
		if (!isNaN(v))
			w+= parseInt(v, 10);
	}
	p.removeChild(node);

	return w;
}

function setNavigation() {
	var nav_parent = getElementsByClassName('nav-main')[0];
	var nav_parent_width = parseInt( getStyle(nav_parent, 'width'), 10);
	var nav = getElementsByClassName('nav')[0];
    if (!nav) return;
	var is_viewport_mobile = (viewport.offsetWidth < 600) ? true : false;
	var nav_width = 0;
	var nav_start_hide = 0;
	var nav_counter = 0;
	var more_counter = 0;
	var is_more_menu = false;
	var sm_padding = 10;
	nav.style.display = '';

	var nav_more = getElementsByClassName('nav-more')[0];
	nav_more.style.display = '';
	var nav_more_width = parseInt(getStyle(nav_more, 'width'), 10);

	// calculate available space
	for (var i in nav.childNodes) {
		if (nav.childNodes[i].tagName == 'LI') {
			nav.childNodes[i].style.display = "block";
			if (!nav_cache[i])
				nav_cache[i] = parseInt(getStyle(nav.childNodes[i], 'width'), 10);
			nav_width += nav_cache[i];
			nav_counter++;
		}
	}

	if (nav_width >= nav_parent_width) {
		nav_parent_width -= nav_more_width;
		is_more_menu = true;
	}

	// adjust main menu
	nav_width = 0;
	for (var i in nav.childNodes) {
		if (nav.childNodes[i].tagName == 'LI') {
			nav_width += nav_cache[i];
			if (i > 0 && nav_width > nav_parent_width) {
				nav.childNodes[i].style.display = "none";
				if (!nav_start_hide)
					nav_start_hide = i;
			}
			else {
				nav.childNodes[i].style.display = "block";
			}
		}
	}

  	// adjust more menu
	if (!is_viewport_mobile) {

		if (nav_start_hide > 0) {
			nav.style.display = 'table-cell';
			nav_more.style.display = 'table-cell';
			more_counter = nav_counter - nav_start_hide;
		}
		var more_count = getElementsByClassName('more-count')[0];
		more_count.innerHTML = more_counter;

		var nav_more = getElementsByClassName('nav-more')[0]
		nav_more.style.display = (more_counter > 0) ? 'table-cell' : 'none';

		nav_more_children = nav_more.getElementsByTagName('LI')[0].getElementsByTagName('UL')[0].childNodes;
		for(i = 0; i < nav_more_children.length; i++) { 
			if (nav_more_children[i].tagName == 'LI')
				nav_more_children[i].style.display = (i < nav_start_hide) ? 'none' : 'block';
		}
	}
	else {
		nav_more.style.display = 'none';
	}

}

function initNavigation() {
	var navs = getElementsByClassName('nav');
	for (var k=0; k<navs.length; k++) {
		var elmns = navs[k].getElementsByTagName("LI");
		for (var i=0; i<elmns.length; i++) {
			elmns[i].addEventListener('mouseenter', function( ev ){ openDropDown( ev, this ); }, false);
			elmns[i].addEventListener('mouseleave', function( ev ){ closeDropDown( ev, this ); }, false);
			elmns[i].addEventListener('touchend', function( ev ){ openDropDown( ev, this ); }, false);
			elmns[i].addEventListener('click', function( ev ){ hideDropDown(); }, false);
		}
	}

	var handleMove = function (ev) {
		scroll_started = true;
	}
	document.addEventListener('touchmove', handleMove, false);

    var handleEnd = function (ev) {

      	var nav = getParentByClass(ev.target, 'nav');
      	if (!nav && !scroll_started) {
                removeHover(); // close dropdown if body is clicked
        }
		scroll_started = false;
	}
    document.addEventListener('touchend', handleEnd, false);

	var handleMove = function( ev ) {
	var body = document.getElementsByTagName("body")[0];
		if (!is_touch && !classie.has(body, 'no-touch')) {
			classie.add(body, 'no-touch');
		}
	}
	document.addEventListener('mousemove', handleMove, false);

	setNavigation();
}

function openDropDown(ev, el) {
	if (ev.type == 'touchend') {
		var submenu = el.getElementsByTagName('UL')[0];
		var parent = el.parentNode;
		if (nav) {	
			if (!classie.has(el, 'hover') && (submenu !== undefined)) {
				removeHover(parent);
				ev.stopPropagation();
				ev.preventDefault();
				classie.add(el, 'hover');
			}
			else {
				if (!scroll_started) {
					ev.stopPropagation();
					ev.preventDefault();
					removeHover(parent);
					classie.add(el, 'hover');
					setTimeout(function(){
						removeHover();
					}, 200);
					window.location = el.childNodes[0].getAttribute('href');
				}
				return;
			}
			scroll_started = false;
		}
	}

	var liWidth = 'auto';
	var itemWidth = parseInt(getStyle(el, 'width'), 10);
	var submenu = el.getElementsByTagName('UL')[0];
	var submenuDiv = el.getElementsByTagName('DIV')[0];
	var viewportWidth = parseInt(getStyle(viewport, 'width'), 10);
	var navContainer = document.querySelector('.navigation').getBoundingClientRect();

	if (submenu) {

		var submenuWidth = parseInt(getStyle(submenu, 'width'), 10) + 10;
		var itemPos = getPos(el);
		var submenuPos = getPos(submenuDiv);
		var spaceRight = navContainer.right - submenuPos.x - 20;
		var spaceLeft =  itemPos.x - navContainer.left - 10;

		submenuDiv.style.whiteSpace = 'normal';

		if (spaceRight < submenuWidth && spaceRight < spaceLeft) {

			if (spaceLeft < submenuWidth) {
				submenuDiv.style.left = '-' + spaceLeft + 'px';
				submenuDiv.style.width = spaceLeft - 10 + 'px';
			}
			else {
				submenuDiv.style.left = '-' + submenuWidth + 'px';
			}
		}
		else {
			if (spaceRight < submenuWidth) {
				submenuDiv.style.width = spaceRight + 'px';
			}
			else {
				submenuDiv.style.width = submenuWidth + 'px';
			}
		}

        var submenuFontSize = getStyle(submenuDiv, 'font-size');
        var menu_items = submenu.childNodes;
        for(var j = 0; j < menu_items.length; j++)
            if (menu_items[j].tagName == 'LI') {
               lSize = calcSize(menu_items[j].innerHTML.replace(new RegExp("\\s+", "g"), "<br/>"), 'font-size: ' + submenuFontSize);
                menu_items[j].style.wordBreak = (lSize.width > spaceRight) ? 'break-all' : 'normal';
            }
	}

}

function closeDropDown(ev, el) {
	if (is_mobile) {
		classie.remove(el, 'hover');
	}
	var submenuDiv = el.getElementsByTagName('DIV')[0];
	if (submenuDiv) {
		submenuDiv.style.whiteSpace = '';
		submenuDiv.style.width = '';
		submenuDiv.style.left = '';
	}
}

function hideDropDown() {
	var body = document.getElementsByTagName("body")[0];
	if (classie.has(body, 'no-touch')) {
		classie.remove(body, 'no-touch');
	}
}

/*
* Remove hover class from node
*/
function removeHover(node) {
	if (typeof node === 'undefined' || node.className === 'nav') {
		node = document;
	}
	var items = node.getElementsByTagName('li');
    for (var i=0; i<items.length; i++) {
		classie.remove(items[i], 'hover');
		closeDropDown(null, items[i]);
    }
}

/*
* Does the node have a class
*/
function hasClass(node, className) {
    if (node.className) {
        return node.className.match(
            new RegExp('(\\s|^)' + className + '(\\s|$)'));
    } else {
        return false;
    }
};

/*
* Returns first ancestor of required class or a null
*/
function getParentByClass(node, className) {
    if (arguments.length === 2) {
        if (node.parentNode && node.nodeName !== "BODY")
            return getParentByClass(node.parentNode, className, 1);
        else
            return null;
    }
    // Recursive calls
    if (node !== null && node !== undefined) {
        if (hasClass(node, className)) {
            return node;
        } else {
            if (node.parentNode && node.nodeName !== "BODY")
                return getParentByClass(node.parentNode, className, 1);
            else
                return null;
        }
    } else {
        return null;
    }
};

/*
* Return width & height element by style
*/
function calcSize(pText, pStyle) {
    var obj = document.createElement('div');
    document.body.appendChild(obj);
    if (pStyle)
        obj.setAttribute('style', pStyle);
    obj.style.position = "absolute";
    obj.style.left = -1000;
    obj.style.top = -1000;

    obj.innerHTML = pText;

    var r = {
        width: obj.clientWidth,
        height: obj.clientHeight
    };

    document.body.removeChild(obj);
    obj = null;

    return r;
}

/*
* Get coordinates
*/
function getPos(o) {
	var z=o, x=0,y=0, c;
	while(z && !isNaN(z.offsetLeft) && !isNaN(z.offsetTop)) {
		c = isNaN(window.globalStorage)?0:window.getComputedStyle(z,null);
		x += z.offsetLeft-z.scrollLeft+(c?parseInt(c.getPropertyValue('border-left-width'),10):0);
		y += z.offsetTop-z.scrollTop+(c?parseInt(c.getPropertyValue('border-top-width'),10):0);
		z = z.offsetParent;
	}
	return {x:o.X=x,y:o.Y=y};
}

/*
* Get CSS style
*/
function getStyle(oElm, strCssRule){
	var strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
	}
	else if(oElm.currentStyle){
		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];
	}
	return strValue;
}

/*
* Insert after
*/
function insertAfter(newElement,targetElement) {
	//target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    //if the parents lastchild is the targetElement...
    if(parent.lastchild == targetElement) {
        //add the newElement after the target element.
        parent.appendChild(newElement);
	} else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

/*
* Returns first ancestor of required class or a null
*/
function getParentByClass(node, className) {
    if (arguments.length === 2) {
        if (node.parentNode && node.nodeName !== "BODY")
            return getParentByClass(node.parentNode, className, 1);
        else
            return null;
    }
    // Recursive calls
    if (node !== null && node !== undefined) {
        if (hasClass(node, className)) {
            return node;
        } else {
            if (node.parentNode && node.nodeName !== "BODY")
                return getParentByClass(node.parentNode, className, 1);
            else
                return null;
        }
    } else {
        return null;
    }
};

/*
* Get Element By ClassName
*/
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};


/*
* Add placeholder attribute to input
*/
function inputPlaceholder(input, color) {

    if (!input) return null;

    // Do nothing if placeholder supported by the browser (Webkit, Firefox 3.7)
    if (input.placeholder && 'placeholder' in document.createElement(input.tagName)) return input;

    color = color || '#AAA';
    var default_color = input.style.color;
    var placeholder = input.getAttribute('placeholder');

    if (input.value === '' || input.value == placeholder) {
            input.value = placeholder;
            input.style.color = color;
            input.setAttribute('data-placeholder-visible', 'true');
    }

    var add_event = 'addEventListener';

    input[add_event]('focus', function(){
     input.style.color = default_color;
     if (input.getAttribute('data-placeholder-visible')) {
             input.setAttribute('data-placeholder-visible', '');
             input.value = '';
     }
    }, false);

    input[add_event]('blur', function(){
            if (input.value === '') {
                    input.setAttribute('data-placeholder-visible', 'true');
                    input.value = placeholder;
                    input.style.color = color;
            } else {
                    input.style.color = default_color;
                    input.setAttribute('data-placeholder-visible', '');
            }
    }, false);

    input.form && input.form[add_event]('submit', function(){
            if (input.getAttribute('data-placeholder-visible')) {
                    input.value = '';
            }
    }, false);

    return input;
}

;( function( window ) {
	'use strict';

	// EventListener | @jon_neal | //github.com/jonathantneal/EventListener
	!window.addEventListener && window.Element && (function () {
	   function addToPrototype(name, method) {
		  Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
	   }

	   var registry = [];

	   addToPrototype("addEventListener", function (type, listener) {
		  var target = this;

		  registry.unshift({
			 __listener: function (event) {
				event.currentTarget = target;
				event.pageX = event.clientX + document.documentElement.scrollLeft;
				event.pageY = event.clientY + document.documentElement.scrollTop;
				event.preventDefault = function () { event.returnValue = false };
				event.relatedTarget = event.fromElement || null;
				event.stopPropagation = function () { event.cancelBubble = true };
				event.relatedTarget = event.fromElement || null;
				event.target = event.srcElement || target;
				event.timeStamp = +new Date;

				listener.call(target, event);
			 },
			 listener: listener,
			 target: target,
			 type: type
		  });

		  this.attachEvent("on" + type, registry[0].__listener);
	   });

	   addToPrototype("removeEventListener", function (type, listener) {
		  for (var index = 0, length = registry.length; index < length; ++index) {
			 if (registry[index].target == this && registry[index].type == type && registry[index].listener == listener) {
				return this.detachEvent("on" + type, registry.splice(index, 1)[0].__listener);
			 }
		  }
	   });

	   addToPrototype("dispatchEvent", function (eventObject) {
		  try {
			 return this.fireEvent("on" + eventObject.type, eventObject);
		  } catch (error) {
			 for (var index = 0, length = registry.length; index < length; ++index) {
				if (registry[index].target == this && registry[index].type == eventObject.type) {
				   registry[index].call(this, eventObject);
				}
			 }
		  }
	   });
	})();

	// http://www.jonathantneal.com/blog/polyfills-and-prototypes/
	!String.prototype.trim && (String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	});

	function storeSearch( el, options ) {
		this.el = el;
		this.container = getElementsByClassName( 'site-search' )[0];
		this.wrapper = getElementsByClassName( 'search-wrapper' )[0];
		this.inputEl = getElementsByClassName( 'ecwid-SearchPanel-field' )[0];
		this._init();
	}

	storeSearch.prototype = {
		_init : function() {

			// Mode : collapsed / expanded
			this.mode = 'collapsed'
			// Current width
			this.width = 0;
			// Expanded width 
			this.l_width;
			// Collapsed width
			this.s_width;

			this._initEvents();
			this._calc();
			this.update();
		},

		_initEvents : function() {
			var self = this,
			initSearchFn = function( ev ) {

				ev.stopPropagation();
				self.inputEl.value = self.inputEl.value.trim();

				if( !classie.has( self.el, 'ecwid-SearchPanel-open' ) ) {
					ev.preventDefault();
					self.open();
				}
				else if( classie.has( this.el, 'ecwid-SearchPanel-open' ) && /^\s*$/.test( self.inputEl.value ) ) {
					ev.preventDefault();
					self.close();
				}
			}

			this.container.addEventListener('click', initSearchFn);
			this.container.addEventListener('touchstart', initSearchFn);

			this.el.addEventListener( 'click', initSearchFn );
			this.el.addEventListener( 'touchstart', initSearchFn );
			this.inputEl.addEventListener( 'click', function( ev ) { ev.stopPropagation(); });
			this.inputEl.addEventListener( 'touchstart', function( ev ) { ev.stopPropagation(); } );

		},
		_calc : function () {
			var self = this;
			// Collapsed width
			if (!this.l_width) {
				this.l_width = getOuterWidth('site-search', 'site-search-expanded');
			}
			// Expanded width
			if (!this.s_width)
				this.s_width = getOuterWidth('site-search', '');	

			switch(this.mode) {
 				case 'expanded' :
					this.width = this.l_width;
					break;
				case 'collapsed' :
					this.width = this.s_width;
					break;
			}

		},
		open : function() {

			var self = this;

			classie.add( this.container, 'site-search-expanded' );

			if( !mobilecheck() ) {
				this.inputEl.focus();
			}

			this.mode = 'expanded';
			this._calc();
			this.update();
			updateHeader();

			// close the search input if body is clicked
			var bodyFn = function( ev ) {
				ev = ev || window.event;
				if ((ev.type == 'click' && ev.target.className != 'search-wrapper') || (ev.type == 'resize' && !mobilecheck())) {
					self.close();
					this.removeEventListener( 'click', bodyFn );
					this.removeEventListener( 'touchstart', bodyFn );
				}
			};

			document.addEventListener( 'click', bodyFn );
			document.addEventListener( 'touchstart', bodyFn );
			window.addEventListener( 'resize', bodyFn );

		},
		close : function() {
			var self = this;
			self.inputEl.blur();
			classie.remove( this.el.parentNode.parentNode, 'site-search-expanded' );

			self.mode = 'collapsed';
			self._calc();
			self.update();
			updateHeader();
		},
		update: function() {
			var self = this;
			self._calc();

			setTimeout(function(){

				var s = getElementsByClassName('site-search')[0];
				var v = parseInt(getStyle(viewport, 'width'), 10);
				storeMinicart._calc();

				if (v < 901 && v > 599) {

					if ((v - storeTitle.width - storeMinicart.width - self.l_width) < 0 ) {
						s.style.position = 'absolute';
						if (storeMinicart.mode == 'hide') {
							s.style.left = 'auto';
							s.style.right = '0';					
						}
						else {
							var minicartWidth = (storeMinicart.mode == 'long') ? storeMinicart.l_width : storeMinicart.s_width;
							s.style.left = v - minicartWidth - self.s_width - 10 + 'px';
							s.style.right = 'auto';
						}
					}
					else {
						s.style.cssFloat = 'right';
						s.style.left = 'auto';
						s.style.position = (storeMinicart.mode == 'long') ? 'relative' : 'static';
						s.style.right = (v < 760) ? '3px' : storeMinicart.l_width + 10 + 'px';
					}
				}
				else {
					s.style.position = 'static';
					s.style.cssFloat = 'left';
					s.style.left = 'auto';	
					s.style.right = 'auto';
				}

			}, 0);

		}

	}

	// add to global namespace
	window.storeSearch = storeSearch;

} )( window );

// http://stackoverflow.com/a/11381730/989439
function mobilecheck() {
	var check = false;
	(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

// show Loading indicator 
function showLoading(){
	if (!is_loading_on) {
		var loading = getElementsByClassName('ecwid-loading')[0];
		classie.add( loading, 'loading-start' );
		is_loading_on = true;
	}
}

// hide Loading indicator
function hideLoading(){
	if (is_loading_on) {
		var loading = getElementsByClassName('ecwid-loading')[0];
		classie.add( loading, 'loading-stop' );
		setTimeout(function(){
			classie.remove( loading, 'loading-start');
			classie.remove( loading, 'loading-stop');
			is_loading_on = false;
		}, 600);
	}
};

function buildNav(data, isSub) {
    var html = (isSub)?'<div>':''; // wrap with div if true
    html += (data)? ( (isSub)?'<ul>':'<ul class="nav">' ) : '';
    for(var item in data){
        html += '<li';
        if(typeof(data[item].sub) === 'object'){ // an array will return 'object'
        	var css = '';
			var isParent= (data[item].sub)?true:false;
			if (isParent)
        		css += 'parent ';
        	if (data[item].classname)
        		css += data[item].classname;
        	if (css)
        		html += ' class="'+ css +'"';
			html += '>';
                html += '<a href="' + data[item].link + '">' + data[item].name + '</a>';

            html += buildNav(data[item].sub, isParent); // submenu found: calling recursively same method
        } else {
            html += data[item].id; // no submenu
        }
        html += '</li>';
    }
    html += (data)?'</ul>':'';
    html += (isSub)?'</div>':'';
    return html;
}

function buildPushMenu(data, parent) {
	var html = '<div data-level=' + ((parent) ? (parent.dataLevel + 1) : 1) + ' class="mp-level';
	html += ((parent) ? '' : ' mp-level-open') + '">';
	html += (parent) ? '<a class="mp-back" >' + msg('StarterSite.back', "Back") + '</a>' : '';
    if (parent) {
        html += '<a class="mp-current" href="' + parent.link + '">' + parent.name + '</a>';
    } else {
        html += '<a class="mp-current" href="#!/c/0">' + msg('CategoryPathPanel.store', 'Store') + '</a>';
    }
	html += '<ul>';

	for (var item in data) {
		html += '<li';
		if (typeof(data[item].sub) === 'object'){
			var css = '';
			var isParent = (data[item].sub)?true:false;
			if (isParent)
				css += 'parent ';
			if (data[item].classname)
				css += data[item].classname;
			if (css)
				html += ' class="'+ css +'"';
			html += '>';
			html += '<a href="' + data[item].link + '">' + data[item].name + '</a>';
			if (data[item].sub) { // create submenu
				html += buildPushMenu(data[item].sub, data[item]);
			}
		} else {
			html += data[item].id; // no submenu
		}
	}

	html += '</ul></div>';
	return html;
}

function addHelper() {
	var helper = document.createElement('div');
	helper.setAttribute('class', 'ecwid-helper');
	helper.innerHTML = '<table><tr><td class="ecwid-productBrowser-cart-itemsTable-cell"></td></tr></table>\n' +
		'<span class="gwt-InlineLabel"></span>\n' +
		'<div class="ecwid-categoriesMenuBar"><table><tr><td class="gwt-MenuItem-selected"><span class="ecwid-categories-category"></span></td></tr></table></div>\n' +
		'<button class="ecwid-AccentedButton"></button>\n' +
		'<span class="ecwid-minicart-label-text"></span>\n';
    document.body.appendChild(helper);
}

function detectCSSFeature(featurename){
    var feature = false,
    domPrefixes = 'Webkit Moz ms O'.split(' '),
    elm = document.createElement('div'),
    featurenameCapital = null;

    featurename = featurename.toLowerCase();

    if( elm.style[featurename] ) { feature = true; }

    if( feature === false ) {
        featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
              feature = true;
              break;
            }
        }
    }
    return feature;
}

function msg(label, defaultValue) {
    var messageBundles = (window.Ecwid && window.Ecwid.MessageBundles) ? window.Ecwid.MessageBundles : {};
    var bundle = messageBundles['ru.cdev.xnext.client'] ? messageBundles['ru.cdev.xnext.client'] : {};
    return bundle[label] || defaultValue;
}

// Push menu

;( function( window ) {
	
	'use strict';

	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function hasParent( e, id ) {
		if (!e) return false;
		var el = e.target||e.srcElement||e||false;
		while (el && el.id != id) {
			el = el.parentNode||false;
		}
		return (el!==false);
	}

	// returns the depth of the element "e" relative to element with id=id
	// for this calculation only parents with classname = waypoint are considered
	function getLevelDepth( e, id, waypoint, cnt ) {
		cnt = cnt || 0;
		if ( e.id.indexOf( id ) >= 0 ) return cnt;
		if( classie.has( e, waypoint ) ) {
			++cnt;
		}
		return e.parentNode && getLevelDepth( e.parentNode, id, waypoint, cnt );
	}


	// returns the closest element to 'e' that has class "classname"
	function closest( e, classname ) {
		if( classie.has( e, classname ) ) {
			return e;
		}
		return e.parentNode && closest( e.parentNode, classname );
	}

	function pushMenu( el, trigger, options ) {	
		this.el = el;
		this.trigger = trigger;
		this.options = extend( this.defaults, options );
		// support 3d transforms
		this.support = has3d();
		this._init();
	}

	pushMenu.prototype = {
		defaults : {
			// space between each overlaped level
			levelSpacing : 40,
			// classname for the element (if any) that when clicked closes the current level
			backClass : 'mp-back',
			// support 3d transforms
			has3d : has3d()
		},
		_init : function() {
			// if menu is open or not
			this.open = false;
			// level depth
			this.level = 0;
			// the moving wrapper
			this.wrapper = document.getElementById( 'menu-pusher' );
			// the mp-level elements
			this.levels = Array.prototype.slice.call( this.el.querySelectorAll( 'div.mp-level' ) );
			// save the depth of each of these mp-level elements
			var self = this;
			this.levels.forEach( function( el, i ) { el.setAttribute( 'data-level', getLevelDepth( el, self.el.id, 'mp-level' ) ); } );
			// the menu items
			this.menuItems = Array.prototype.slice.call( this.el.querySelectorAll( 'li' ) );
			// these will serve as hooks to move back to the previous level
			this.levelBack = Array.prototype.slice.call( this.el.querySelectorAll( '.' + this.options.backClass ) );
			// event type (if mobile use touch events)
			this.eventtype = mobilecheck() ? 'touchend' : 'click';
			// initialize / bind the necessary events
			this._initEvents();
			// scroll state
			this.scroll_started = false;
		},
		_initEvents : function() {
			var self = this;

			// hide by default
			classie.add(this.wrapper, 'hide');

			// the menu should close if clicking somewhere on the body
			var bodyClickFn = function( ev, el ) {
				ev.preventDefault();
				self._resetMenu();
				el.removeEventListener( self.eventtype, bodyClickFn );
				self.scroll_started = false;
			};

			// open (or close) the menu
			this.trigger.addEventListener( this.eventtype, function( ev ) {
				ev.stopPropagation();
				ev.preventDefault();

				if( self.open && !self.scroll_started) {
					self._resetMenu();
				}
				else {
					self._openMenu();
					// the menu should close if clicking somewhere on the body (excluding clicks on the menu)
					document.addEventListener( self.eventtype, function( ev ) {
						if( self.open && !hasParent( ev.target, self.el.id ) ) {
							bodyClickFn( ev, this );
						}
					});
					document.addEventListener( 'touchstart', function( ev ) {
						self.scroll_started = false;
					});
					document.addEventListener( 'touchmove', function( ev ) {
						self.scroll_started = true;
					});
				}
			});


			// opening a sub level menu
			this.menuItems.forEach( function( el, i ) {
				// check if it has a sub level
				var subLevel = el.querySelector( 'div.mp-level' );
				if( subLevel ) {
					el.querySelector( 'a' ).addEventListener( self.eventtype, function( ev ) {
						ev.preventDefault();
						var level = closest( el, 'mp-level' ).getAttribute( 'data-level' );
						if( self.level <= level && !self.scroll_started) {
							ev.stopPropagation();
							classie.add( closest( el, 'mp-level' ), 'mp-level-overlay' );
							self._openMenu( subLevel );
							document.body.scrollTop = document.documentElement.scrollTop = 0;
						}
					} );
				}
			} );

			// closing the sub levels:
			// by clicking on the visible part of the level element
			this.levels.forEach( function( el, i ) {
				el.addEventListener( self.eventtype, function( ev ) {
					if (ev.target.tagName.toLowerCase() === 'a') {
						ev.preventDefault();
						ev.stopPropagation();
						var level = el.getAttribute( 'data-level' );
						if( self.level > level) {
							self.level = level;
							self._resetMenu();
						}
						if (self.level == level && !self.scroll_started) {
							window.location = ev.target;
							bodyClickFn( ev, this );
						}
					}
				} );
			} );

			// by clicking on a specific element
			this.levelBack.forEach( function( el, i ) {
				el.addEventListener( self.eventtype, function( ev ) {
					ev.preventDefault();
					var level = closest( el, 'mp-level' ).getAttribute( 'data-level' );
					if( self.level <= level ) {
						ev.stopPropagation();
						self.level = closest( el, 'mp-level' ).getAttribute( 'data-level' ) - 1;
						self.level === 0 ? self._resetMenu() : self._closeMenu();
					}
				} );
			} );	
		},
		_openMenu : function( subLevel ) {
			// increment level depth
			++this.level;
			
			classie.remove( this.wrapper, 'hide' );

			// move the main wrapper
			var levelFactor = ( this.level - 1 ) * this.options.levelSpacing,
				translateVal = this.el.offsetWidth;

			if (this.options.has3d)
				this._setTransform( 'translate3d(' + translateVal + 'px,0,0)' );
			else
				this._setTransform2D( 'translate(' + translateVal + 'px,0)' ); // IE9

			if( subLevel ) {
				// reset transform for sublevel
				if (this.options.has3d)
					this._setTransform( '', subLevel );
				else
					this._setTransform2D( '', subLevel ); // IE9

				// need to reset the translate value for the level menus that have the same level depth and are not open
				for( var i = 0, len = this.levels.length; i < len; ++i ) {
					var levelEl = this.levels[i];
					if( levelEl != subLevel && !classie.has( levelEl, 'mp-level-open' ) ) {
						if (this.options.has3d) 
							this._setTransform( 'translate3d(-100%,0,0) translate3d(' + -1*levelFactor + 'px,0,0)', levelEl );
						else
							this._setTransform2D( 'translate(-100%,0)', levelEl );
					}
				}
			}
			// add class mp-pushed to main wrapper if opening the first time
			if( this.level === 1 ) {
				classie.add( this.wrapper, 'mp-pushed' );
				this.open = true;
				var shadow = getElementsByClassName('mask')[0];
				shadow.style.display = 'block';
			}
			// add class mp-level-open to the opening level element
			classie.add( subLevel || this.levels[0], 'mp-level-open' );
		},
		// close the menu
		_resetMenu : function() {
			if (this.options.has3d)
				this._setTransform('translate3d(0,0,0)');
			else
				this._setTransform2D('translate(0,0)');

			this.level = 0;
			// remove class mp-pushed from main wrapper
			var wrapper = this.wrapper;
			classie.remove( wrapper, 'mp-pushed' );
			setTimeout(function(){
				classie.add(wrapper, 'hide')
			}, 400);

			var shadow = getElementsByClassName('mask')[0];
			shadow.style.display = 'none';
			this._toggleLevels();
			this.open = false;
			pageScrollTop();
		},
		// close sub menus
		_closeMenu : function() {
			var translateVal = this.el.offsetWidth;
			if (this.options.has3d)
				this._setTransform( 'translate3d(' + translateVal + 'px,0,0)' );
			else
				this._setTransform2D( 'translate(' + translateVal + 'px,0)' );
			this._toggleLevels();
		},
		// translate the el
		_setTransform : function( val, el ) {
			el = el || this.wrapper;
			el.style.WebkitTransform = val;
			el.style.MozTransform = val;
			el.style.transform = val;
		},
		// IE9 -ms-transfrom: translate
		_setTransform2D : function( val, el ) {
			el = el || this.wrapper;
			el.style.msTransform = val;
		},
		// removes classes mp-level-open from closing levels
		_toggleLevels : function() {
			for( var i = 0, len = this.levels.length; i < len; ++i ) {
				var levelEl = this.levels[i];
				if( levelEl.getAttribute( 'data-level' ) >= this.level + 1 ) {
					classie.remove( levelEl, 'mp-level-open' );
					classie.remove( levelEl, 'mp-level-overlay' );
				}
				else if( Number( levelEl.getAttribute( 'data-level' ) ) == this.level ) {
					classie.remove( levelEl, 'mp-level-overlay' );
				}
			}
		}
	}

	// add to global namespace
	window.pushMenu = pushMenu;

} )( window );


// check support for css 3d transforms 
function has3d(){
	var el = document.createElement('p'),
	has3d,
	transforms = {
		'webkitTransform':'-webkit-transform',
		'OTransform':'-o-transform',
		'msTransform':'-ms-transform',
		'MozTransform':'-moz-transform',
		'transform':'transform'
	};

	// Add it to the body to get the computed style
	document.body.insertBefore(el, null);

	for(var t in transforms){
		if( el.style[t] !== undefined ){
			el.style[t] = 'translate3d(1px,1px,1px)';
			has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
		}
	}

	document.body.removeChild(el);
	return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
}

// scroll page to top
function pageScrollTop() {
	return document.documentElement.scrollTop ? document.documentElement.scrollTop : (document.body.scrollTop ? document.body.scrollTop : 0);
}


// classie - class helper functions
// from bonzo https://github.com/ded/bonzo
(function(window){function classReg(className){return new RegExp("(^|\\s+)"+className+"(\\s+|$)")}var hasClass,addClass,removeClass;if("classList" in document.documentElement){hasClass=function(elem,c){return elem.classList.contains(c)};addClass=function(elem,c){elem.classList.add(c)};removeClass=function(elem,c){elem.classList.remove(c)}}else{hasClass=function(elem,c){return classReg(c).test(elem.className)};addClass=function(elem,c){if(!hasClass(elem,c)){elem.className=elem.className+" "+c}};removeClass=function(elem,c){elem.className=elem.className.replace(classReg(c)," ")}}function toggleClass(elem,c){var fn=hasClass(elem,c)?removeClass:addClass;fn(elem,c)}var classie={hasClass:hasClass,addClass:addClass,removeClass:removeClass,toggleClass:toggleClass,has:hasClass,add:addClass,remove:removeClass,toggle:toggleClass};if(typeof define==="function"&&define.amd){define(classie)}else{window.classie=classie}})(window);

// TinyColor v0.9.17
// https://github.com/bgrins/TinyColor
// 2014-02-28, Brian Grinstead, MIT License
!function(){function inputToRGB(color){var rgb={r:0,g:0,b:0},a=1,ok=!1,format=!1;return"string"==typeof color&&(color=stringInputToObject(color)),"object"==typeof color&&(color.hasOwnProperty("r")&&color.hasOwnProperty("g")&&color.hasOwnProperty("b")?(rgb=rgbToRgb(color.r,color.g,color.b),ok=!0,format="%"===String(color.r).substr(-1)?"prgb":"rgb"):color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("v")?(color.s=convertToPercentage(color.s),color.v=convertToPercentage(color.v),rgb=hsvToRgb(color.h,color.s,color.v),ok=!0,format="hsv"):color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("l")&&(color.s=convertToPercentage(color.s),color.l=convertToPercentage(color.l),rgb=hslToRgb(color.h,color.s,color.l),ok=!0,format="hsl"),color.hasOwnProperty("a")&&(a=color.a)),a=boundAlpha(a),{ok:ok,format:color.format||format,r:mathMin(255,mathMax(rgb.r,0)),g:mathMin(255,mathMax(rgb.g,0)),b:mathMin(255,mathMax(rgb.b,0)),a:a}}function rgbToRgb(r,g,b){return{r:255*bound01(r,255),g:255*bound01(g,255),b:255*bound01(b,255)}}function rgbToHsl(r,g,b){r=bound01(r,255),g=bound01(g,255),b=bound01(b,255);var h,s,max=mathMax(r,g,b),min=mathMin(r,g,b),l=(max+min)/2;if(max==min)h=s=0;else{var d=max-min;switch(s=l>.5?d/(2-max-min):d/(max+min),max){case r:h=(g-b)/d+(b>g?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h/=6}return{h:h,s:s,l:l}}function hslToRgb(h,s,l){function hue2rgb(p,q,t){return 0>t&&(t+=1),t>1&&(t-=1),1/6>t?p+6*(q-p)*t:.5>t?q:2/3>t?p+6*(q-p)*(2/3-t):p}var r,g,b;if(h=bound01(h,360),s=bound01(s,100),l=bound01(l,100),0===s)r=g=b=l;else{var q=.5>l?l*(1+s):l+s-l*s,p=2*l-q;r=hue2rgb(p,q,h+1/3),g=hue2rgb(p,q,h),b=hue2rgb(p,q,h-1/3)}return{r:255*r,g:255*g,b:255*b}}function rgbToHsv(r,g,b){r=bound01(r,255),g=bound01(g,255),b=bound01(b,255);var h,s,max=mathMax(r,g,b),min=mathMin(r,g,b),v=max,d=max-min;if(s=0===max?0:d/max,max==min)h=0;else{switch(max){case r:h=(g-b)/d+(b>g?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h/=6}return{h:h,s:s,v:v}}function hsvToRgb(h,s,v){h=6*bound01(h,360),s=bound01(s,100),v=bound01(v,100);var i=math.floor(h),f=h-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s),mod=i%6,r=[v,q,p,p,t,v][mod],g=[t,v,v,q,p,p][mod],b=[p,p,t,v,v,q][mod];return{r:255*r,g:255*g,b:255*b}}function rgbToHex(r,g,b,allow3Char){var hex=[pad2(mathRound(r).toString(16)),pad2(mathRound(g).toString(16)),pad2(mathRound(b).toString(16))];return allow3Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)?hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0):hex.join("")}function rgbaToHex(r,g,b,a){var hex=[pad2(convertDecimalToHex(a)),pad2(mathRound(r).toString(16)),pad2(mathRound(g).toString(16)),pad2(mathRound(b).toString(16))];return hex.join("")}function flip(o){var flipped={};for(var i in o)o.hasOwnProperty(i)&&(flipped[o[i]]=i);return flipped}function boundAlpha(a){return a=parseFloat(a),(isNaN(a)||0>a||a>1)&&(a=1),a}function bound01(n,max){isOnePointZero(n)&&(n="100%");var processPercent=isPercentage(n);return n=mathMin(max,mathMax(0,parseFloat(n))),processPercent&&(n=parseInt(n*max,10)/100),math.abs(n-max)<1e-6?1:n%max/parseFloat(max)}function clamp01(val){return mathMin(1,mathMax(0,val))}function parseIntFromHex(val){return parseInt(val,16)}function isOnePointZero(n){return"string"==typeof n&&-1!=n.indexOf(".")&&1===parseFloat(n)}function isPercentage(n){return"string"==typeof n&&-1!=n.indexOf("%")}function pad2(c){return 1==c.length?"0"+c:""+c}function convertToPercentage(n){return 1>=n&&(n=100*n+"%"),n}function convertDecimalToHex(d){return Math.round(255*parseFloat(d)).toString(16)}function convertHexToDecimal(h){return parseIntFromHex(h)/255}function stringInputToObject(color){color=color.replace(trimLeft,"").replace(trimRight,"").toLowerCase();var named=!1;if(names[color])color=names[color],named=!0;else if("transparent"==color)return{r:0,g:0,b:0,a:0,format:"name"};var match;return(match=matchers.rgb.exec(color))?{r:match[1],g:match[2],b:match[3]}:(match=matchers.rgba.exec(color))?{r:match[1],g:match[2],b:match[3],a:match[4]}:(match=matchers.hsl.exec(color))?{h:match[1],s:match[2],l:match[3]}:(match=matchers.hsla.exec(color))?{h:match[1],s:match[2],l:match[3],a:match[4]}:(match=matchers.hsv.exec(color))?{h:match[1],s:match[2],v:match[3]}:(match=matchers.hex8.exec(color))?{a:convertHexToDecimal(match[1]),r:parseIntFromHex(match[2]),g:parseIntFromHex(match[3]),b:parseIntFromHex(match[4]),format:named?"name":"hex8"}:(match=matchers.hex6.exec(color))?{r:parseIntFromHex(match[1]),g:parseIntFromHex(match[2]),b:parseIntFromHex(match[3]),format:named?"name":"hex"}:(match=matchers.hex3.exec(color))?{r:parseIntFromHex(match[1]+""+match[1]),g:parseIntFromHex(match[2]+""+match[2]),b:parseIntFromHex(match[3]+""+match[3]),format:named?"name":"hex"}:!1}var trimLeft=/^[\s,#]+/,trimRight=/\s+$/,tinyCounter=0,math=Math,mathRound=math.round,mathMin=math.min,mathMax=math.max,mathRandom=math.random,tinycolor=function tinycolor(color,opts){if(color=color?color:"",opts=opts||{},color instanceof tinycolor)return color;if(!(this instanceof tinycolor))return new tinycolor(color,opts);var rgb=inputToRGB(color);this._r=rgb.r,this._g=rgb.g,this._b=rgb.b,this._a=rgb.a,this._roundA=mathRound(100*this._a)/100,this._format=opts.format||rgb.format,this._gradientType=opts.gradientType,this._r<1&&(this._r=mathRound(this._r)),this._g<1&&(this._g=mathRound(this._g)),this._b<1&&(this._b=mathRound(this._b)),this._ok=rgb.ok,this._tc_id=tinyCounter++};tinycolor.prototype={getAlpha:function(){return this._a},setAlpha:function(value){this._a=boundAlpha(value),this._roundA=mathRound(100*this._a)/100},toHsv:function(){var hsv=rgbToHsv(this._r,this._g,this._b);return{h:360*hsv.h,s:hsv.s,v:hsv.v,a:this._a}},toHsvString:function(){var hsv=rgbToHsv(this._r,this._g,this._b),h=mathRound(360*hsv.h),s=mathRound(100*hsv.s),v=mathRound(100*hsv.v);return 1==this._a?"hsv("+h+", "+s+"%, "+v+"%)":"hsva("+h+", "+s+"%, "+v+"%, "+this._roundA+")"},toHsl:function(){var hsl=rgbToHsl(this._r,this._g,this._b);return{h:360*hsl.h,s:hsl.s,l:hsl.l,a:this._a}},toHslString:function(){var hsl=rgbToHsl(this._r,this._g,this._b),h=mathRound(360*hsl.h),s=mathRound(100*hsl.s),l=mathRound(100*hsl.l);return 1==this._a?"hsl("+h+", "+s+"%, "+l+"%)":"hsla("+h+", "+s+"%, "+l+"%, "+this._roundA+")"},toHex:function(allow3Char){return rgbToHex(this._r,this._g,this._b,allow3Char)},toHexString:function(allow3Char){return"#"+this.toHex(allow3Char)},toHex8:function(){return rgbaToHex(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:mathRound(this._r),g:mathRound(this._g),b:mathRound(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+")":"rgba("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:mathRound(100*bound01(this._r,255))+"%",g:mathRound(100*bound01(this._g,255))+"%",b:mathRound(100*bound01(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+mathRound(100*bound01(this._r,255))+"%, "+mathRound(100*bound01(this._g,255))+"%, "+mathRound(100*bound01(this._b,255))+"%)":"rgba("+mathRound(100*bound01(this._r,255))+"%, "+mathRound(100*bound01(this._g,255))+"%, "+mathRound(100*bound01(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:hexNames[rgbToHex(this._r,this._g,this._b,!0)]||!1},toFilter:function(secondColor){var hex8String="#"+rgbaToHex(this._r,this._g,this._b,this._a),secondHex8String=hex8String,gradientType=this._gradientType?"GradientType = 1, ":"";if(secondColor){var s=tinycolor(secondColor);secondHex8String=s.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")"},toString:function(format){var formatSet=!!format;format=format||this._format;var formattedString=!1,hasAlphaAndFormatNotSet=!formatSet&&this._a<1&&this._a>0,formatWithAlpha=hasAlphaAndFormatNotSet&&("hex"===format||"hex6"===format||"hex3"===format||"name"===format);return formatWithAlpha?this.toRgbString():("rgb"===format&&(formattedString=this.toRgbString()),"prgb"===format&&(formattedString=this.toPercentageRgbString()),("hex"===format||"hex6"===format)&&(formattedString=this.toHexString()),"hex3"===format&&(formattedString=this.toHexString(!0)),"hex8"===format&&(formattedString=this.toHex8String()),"name"===format&&(formattedString=this.toName()),"hsl"===format&&(formattedString=this.toHslString()),"hsv"===format&&(formattedString=this.toHsvString()),formattedString||this.toHexString())}},tinycolor.fromRatio=function(color,opts){if("object"==typeof color){var newColor={};for(var i in color)color.hasOwnProperty(i)&&(newColor[i]="a"===i?color[i]:convertToPercentage(color[i]));color=newColor}return tinycolor(color,opts)},tinycolor.equals=function(color1,color2){return color1&&color2?tinycolor(color1).toRgbString()==tinycolor(color2).toRgbString():!1},tinycolor.random=function(){return tinycolor.fromRatio({r:mathRandom(),g:mathRandom(),b:mathRandom()})},tinycolor.desaturate=function(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.s-=amount/100,hsl.s=clamp01(hsl.s),tinycolor(hsl)},tinycolor.saturate=function(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.s+=amount/100,hsl.s=clamp01(hsl.s),tinycolor(hsl)},tinycolor.greyscale=function(color){return tinycolor.desaturate(color,100)},tinycolor.lighten=function(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.l+=amount/100,hsl.l=clamp01(hsl.l),tinycolor(hsl)},tinycolor.darken=function(color,amount){amount=0===amount?0:amount||10;var hsl=tinycolor(color).toHsl();return hsl.l-=amount/100,hsl.l=clamp01(hsl.l),tinycolor(hsl)},tinycolor.complement=function(color){var hsl=tinycolor(color).toHsl();return hsl.h=(hsl.h+180)%360,tinycolor(hsl)},tinycolor.triad=function(color){var hsl=tinycolor(color).toHsl(),h=hsl.h;return[tinycolor(color),tinycolor({h:(h+120)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+240)%360,s:hsl.s,l:hsl.l})]},tinycolor.tetrad=function(color){var hsl=tinycolor(color).toHsl(),h=hsl.h;return[tinycolor(color),tinycolor({h:(h+90)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+180)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+270)%360,s:hsl.s,l:hsl.l})]},tinycolor.splitcomplement=function(color){var hsl=tinycolor(color).toHsl(),h=hsl.h;return[tinycolor(color),tinycolor({h:(h+72)%360,s:hsl.s,l:hsl.l}),tinycolor({h:(h+216)%360,s:hsl.s,l:hsl.l})]},tinycolor.analogous=function(color,results,slices){results=results||6,slices=slices||30;var hsl=tinycolor(color).toHsl(),part=360/slices,ret=[tinycolor(color)];for(hsl.h=(hsl.h-(part*results>>1)+720)%360;--results;)hsl.h=(hsl.h+part)%360,ret.push(tinycolor(hsl));return ret},tinycolor.monochromatic=function(color,results){results=results||6;for(var hsv=tinycolor(color).toHsv(),h=hsv.h,s=hsv.s,v=hsv.v,ret=[],modification=1/results;results--;)ret.push(tinycolor({h:h,s:s,v:v})),v=(v+modification)%1;return ret},tinycolor.readability=function(color1,color2){var a=tinycolor(color1).toRgb(),b=tinycolor(color2).toRgb(),brightnessA=(299*a.r+587*a.g+114*a.b)/1e3,brightnessB=(299*b.r+587*b.g+114*b.b)/1e3,colorDiff=Math.max(a.r,b.r)-Math.min(a.r,b.r)+Math.max(a.g,b.g)-Math.min(a.g,b.g)+Math.max(a.b,b.b)-Math.min(a.b,b.b);return{brightness:Math.abs(brightnessA-brightnessB),color:colorDiff}},tinycolor.readable=function(color1,color2){var readability=tinycolor.readability(color1,color2);return readability.brightness>125&&readability.color>500},tinycolor.mostReadable=function(baseColor,colorList){for(var bestColor=null,bestScore=0,bestIsReadable=!1,i=0;i<colorList.length;i++){var readability=tinycolor.readability(baseColor,colorList[i]),readable=readability.brightness>125&&readability.color>500,score=3*(readability.brightness/125)+readability.color/500;(readable&&!bestIsReadable||readable&&bestIsReadable&&score>bestScore||!readable&&!bestIsReadable&&score>bestScore)&&(bestIsReadable=readable,bestScore=score,bestColor=tinycolor(colorList[i]))}return bestColor};var names=tinycolor.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},hexNames=tinycolor.hexNames=flip(names),matchers=function(){var CSS_INTEGER="[-\\+]?\\d+%?",CSS_NUMBER="[-\\+]?\\d*\\.\\d+%?",CSS_UNIT="(?:"+CSS_NUMBER+")|(?:"+CSS_INTEGER+")",PERMISSIVE_MATCH3="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?",PERMISSIVE_MATCH4="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?";return{rgb:new RegExp("rgb"+PERMISSIVE_MATCH3),rgba:new RegExp("rgba"+PERMISSIVE_MATCH4),hsl:new RegExp("hsl"+PERMISSIVE_MATCH3),hsla:new RegExp("hsla"+PERMISSIVE_MATCH4),hsv:new RegExp("hsv"+PERMISSIVE_MATCH3),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();"undefined"!=typeof module&&module.exports?module.exports=tinycolor:"function"==typeof define&&define.amd?define(function(){return tinycolor}):window.tinycolor=tinycolor}();

function getRequestParam(name) {
	var params = window.location.search.substr(1).split('&');
	for (var i = 0; i < params.length; i++) {
		var p=params[i].split('=');
		if (p.length > 1 && p[0].valueOf() == name.valueOf()) {
			return decodeURIComponent(p[1]);
		}
	}
	return '';
}
