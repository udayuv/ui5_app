/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Focusable"],function(e,t,a,jQuery){"use strict";var r=t.extend("sap.m.QuickViewBase",{metadata:{library:"sap.m",properties:{},defaultAggregation:"pages",aggregations:{pages:{type:"sap.m.QuickViewPage",multiple:true,singularName:"page",bindable:"bindable"}},events:{navigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"},navOrigin:{type:"sap.ui.core.Control"}}},afterNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"},isTopPage:{type:"boolean"},navOrigin:{type:"sap.ui.core.Control"}}}}},renderer:{apiVersion:2,render:function(){}}});r.prototype.navigateBack=function(){if(!this._oNavContainer.currentPageIsTopPage()){this._setNavOrigin(null);this._oNavContainer.back()}};r.prototype.getNavContainer=function(){return this._oNavContainer};r.prototype._initPages=function(){var e=this._oNavContainer;e.destroyPages();e.init();var t=this.getAggregation("pages");if(!t){return}var a=this.getId();for(var r=0;r<t.length;r++){var i=t[r];i._oPage=null;var o={hasBackButton:r>0,popover:this._oPopover,navContainer:e,quickViewId:a,quickView:this};i.setNavContext(o);var n=this._createPage(i);this._oNavContainer.addPage(n)}};r.prototype._processKeyboard=function(e){if(e.shiftKey&&e.which===a.ENTER){this.navigateBack();e.preventDefault()}};r.prototype._createPage=function(e){return e};r.prototype._navigate=function(e){var t=e.getParameter("to");var a=e.getParameter("from");var r=e.getParameter("toId");var i=e.getParameter("fromId");var o=jQuery(document.getElementById(i)).index();var n=jQuery(document.getElementById(r)).index();if(n==-1||n>o){t.addStyleClass("sapMNavItemOffset")}else{a.addStyleClass("sapMNavItemOffset")}a.$().parents(".sapMPanelContent").scrollTop(0);var s=e.getParameters();if(this._navOrigin){s.navOrigin=this._navOrigin}this.fireNavigate(s)};r.prototype._afterNavigate=function(e){var t=e.getParameter("to");var a=e.getParameter("from");var r=e.getParameter("toId");var i=e.getParameter("fromId");var o=jQuery(document.getElementById(i)).index();var n=jQuery(document.getElementById(r)).index();if(n>o){t.removeStyleClass("sapMNavItemOffset")}else{a.removeStyleClass("sapMNavItemOffset")}var s=e.getParameters();s.isTopPage=this._oNavContainer.currentPageIsTopPage();if(this._navOrigin){s.navOrigin=this._navOrigin}this.fireAfterNavigate(s);this._setLinkWidth();setTimeout(this._restoreFocus.bind(this),0)};r.prototype._restoreFocus=function(){var e=this._oNavContainer.getCurrentPage();var t=this._oNavContainer._mFocusObject[e.getId()];if(!t){var a=e.getContent();if(a&&a.length>1){t=a[1].$().firstFocusableDomRef()}}if(t){t.focus()}};r.prototype._setLinkWidth=function(){};r.prototype._setNavOrigin=function(e){this._navOrigin=e};return r});
//# sourceMappingURL=QuickViewBase.js.map