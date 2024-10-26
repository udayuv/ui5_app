/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BarInPageEnabler","./ToolbarLayoutData","./ToolbarSpacer","./library","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/EnabledPropagator","sap/ui/events/KeyCodes","./ToolbarRenderer","sap/m/Button","sap/ui/core/library"],function(t,e,o,i,n,r,s,a,p,u,c){"use strict";var l=i.ToolbarDesign,g=i.ToolbarStyle;var h=2;var f=n.extend("sap.m.Toolbar",{metadata:{interfaces:["sap.ui.core.Toolbar","sap.m.IBar"],library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},active:{type:"boolean",group:"Behavior",defaultValue:false},enabled:{type:"boolean",group:"Behavior",defaultValue:true},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:""},design:{type:"sap.m.ToolbarDesign",group:"Appearance",defaultValue:l.Auto},style:{type:"sap.m.ToolbarStyle",group:"Appearance",defaultValue:g.Standard},ariaHasPopup:{type:"string",group:"Accessibility",defaultValue:null}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},_activeButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{parameters:{srcControl:{type:"sap.ui.core.Control"}}}},designtime:"sap/m/designtime/Toolbar.designtime"},renderer:p});s.call(f.prototype);f.shrinkClass="sapMTBShrinkItem";f.isRelativeWidth=function(t){return/^([-+]?\d+%|auto|inherit|)$/i.test(t)};f.getOrigWidth=function(t){var e=r.getElementById(t);if(!e||!e.getWidth){return""}return e.getWidth()};f.checkShrinkable=function(t,i){if(t.isA("sap.ui.core.HTML")){return}if(t instanceof o){return this.isRelativeWidth(t.getWidth())}i=i||this.shrinkClass;t.removeStyleClass(i);var n=this.getOrigWidth(t.getId());if(!this.isRelativeWidth(n)){return}var r=t.getLayoutData();if(r instanceof e){return r.getShrinkable()&&t.addStyleClass(i)}if(n.indexOf("%")>0||t.getMetadata().isInstanceOf("sap.ui.core.IShrinkable")){return t.addStyleClass(i)}var s=t.getDomRef();if(s&&(s.firstChild||{}).nodeType==3){return t.addStyleClass(i)}};f.prototype._setEnableAccessibilty=function(t){var e=t?"true":"false",o=t?"toolbar":"none";this.data("sap-ui-fastnavgroup",e,t);this._setRootAccessibilityRole(o);return this};f.prototype.enhanceAccessibilityState=function(t,e){if(t===this.getAggregation("_activeButton")){return this.assignAccessibilityState(e)}};f.prototype.getAccessibilityState=function(){var t=this.getAriaLabelledBy(),e=this.getActive();return{role:!e?this._getAccessibilityRole():undefined,haspopup:e?this.getAriaHasPopup():undefined,labelledby:t.length?this.getAriaLabelledBy():this.getTitleId()}};f.prototype.assignAccessibilityState=function(t){if(!this._getAccessibilityRole()&&!this.getActive()){return{}}return Object.assign(t,this.getAccessibilityState(t))};f.prototype.init=function(){this.data("sap-ui-fastnavgroup","true",true);this._oContentDelegate={onAfterRendering:this._onAfterContentRendering}};f.prototype.onAfterRendering=function(){this._checkContents()};f.prototype.onLayoutDataChange=function(){this.invalidate()};f.prototype.addContent=function(t){this.addAggregation("content",t);this._onContentInserted(t);return this};f.prototype.insertContent=function(t,e){this.insertAggregation("content",t,e);this._onContentInserted(t);return this};f.prototype.removeContent=function(t){t=this.removeAggregation("content",t);this._onContentRemoved(t);return t};f.prototype.removeAllContent=function(){var t=this.removeAllAggregation("content")||[];t.forEach(this._onContentRemoved,this);return t};f.prototype.ontap=function(t){if(this.getActive()&&!t.isMarked()||t.srcControl===this._activeButton){t.setMarked();this.firePress({srcControl:t.srcControl});this.focus({preventScroll:true})}};f.prototype.onsapenter=function(t){if(this.getActive()&&!t.isMarked()||t.srcControl===this._activeButton){t.setMarked();this.firePress({srcControl:this})}};f.prototype.onsapspace=function(t){if(!this.getActive()&&t.isMarked()||t.srcControl===this._activeButton){t.preventDefault()}};f.prototype.onkeyup=function(t){if(t.which===a.SPACE){this.onsapenter(t)}};f.prototype.ontouchstart=function(t){this.getActive()&&t.setMarked()};f.prototype._checkContents=function(){this.getContent().forEach(function(t){f.checkShrinkable(t)})};f.prototype._onContentInserted=function(t){if(t){t.attachEvent("_change",this._onContentPropertyChanged,this);t.addEventDelegate(this._oContentDelegate,t)}};f.prototype._onContentRemoved=function(t){if(t){t.detachEvent("_change",this._onContentPropertyChanged,this);t.removeEventDelegate(this._oContentDelegate,t)}};f.prototype.onfocusin=function(t){if(this.getActive()){if(t.target===this.getDomRef()){this._getActiveButton().focus()}}};f.prototype.getFocusDomRef=function(){return this.getActive()?this._getActiveButton().getFocusDomRef():this.getDomRef()};f.prototype.getFocusInfo=function(){return{id:this._getActiveButton().getId()}};f.prototype.applyFocusInfo=function(t){var e=this.getFocusDomRef();if(e){this.focus()}};f.prototype._onAfterContentRendering=function(){var t=this.getLayoutData();if(t instanceof e){t.applyProperties()}};f.prototype._onContentPropertyChanged=function(t){var e=t.getParameter("name");if(e==="visible"){this.invalidate()}if(e!="width"){return}var o=t.getSource();var i=o.getWidth().indexOf("%")>0;o.toggleStyleClass(f.shrinkClass,i)};f.prototype._getAccessibilityRole=function(){var t=this._getRootAccessibilityRole(),e=t;if(this.getActive()){e="button"}else if(this._getToolbarInteractiveControlsCount()<h&&t==="toolbar"){e=""}return e};f.prototype._getToolbarInteractiveControlsCount=function(){return this.getContent().filter(function(t){return t.getVisible()&&t.isA("sap.m.IToolbarInteractiveControl")&&typeof t._getToolbarInteractive==="function"&&t._getToolbarInteractive()}).length};f.prototype._getActiveButton=function(){if(!this._activeButton){this._activeButton=new u({text:"",id:"sapMTBActiveButton"+this.getId()}).addStyleClass("sapMTBActiveButton");this._activeButton.onfocusin=function(){this.addStyleClass("sapMTBFocused");if(typeof u.prototype.onfocusin==="function"){u.prototype.onfocusin.call(this._activeButton,arguments)}}.bind(this);this._activeButton.onfocusout=function(){this.removeStyleClass("sapMTBFocused");if(typeof u.prototype.onfocusout==="function"){u.prototype.onfocusout.call(this._activeButton,arguments)}}.bind(this);this.setAggregation("_activeButton",this._activeButton)}return this._activeButton};f.prototype.getAccessibilityInfo=function(){return{children:this.getContent()}};f.prototype.setDesign=function(t,e){if(!e){return this.setProperty("design",t)}this._sAutoDesign=this.validateProperty("design",t);return this};f.prototype.getActiveDesign=function(){var t=this.getDesign();if(t!=l.Auto){return t}return this._sAutoDesign||t};f.prototype.getTitleControl=function(){var t=sap.ui.require("sap/m/Title");if(!t){return}var e=this.getContent();for(var o=0;o<e.length;o++){var i=e[o];if(i instanceof t&&i.getVisible()){return i}}};f.prototype.getTitleId=function(){var t=this.getTitleControl();return t?t.getId():""};f.prototype.isContextSensitive=t.prototype.isContextSensitive;f.prototype.setHTMLTag=t.prototype.setHTMLTag;f.prototype.getHTMLTag=t.prototype.getHTMLTag;f.prototype.applyTagAndContextClassFor=t.prototype.applyTagAndContextClassFor;f.prototype._applyContextClassFor=t.prototype._applyContextClassFor;f.prototype._applyTag=t.prototype._applyTag;f.prototype._getContextOptions=t.prototype._getContextOptions;f.prototype._setRootAccessibilityRole=t.prototype._setRootAccessibilityRole;f.prototype._getRootAccessibilityRole=t.prototype._getRootAccessibilityRole;f.prototype._setRootAriaLevel=t.prototype._setRootAriaLevel;f.prototype._getRootAriaLevel=t.prototype._getRootAriaLevel;return f});
//# sourceMappingURL=Toolbar.js.map