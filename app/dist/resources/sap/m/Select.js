/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","./Dialog","./Popover","./SelectList","./library","sap/ui/core/Control","sap/ui/core/EnabledPropagator","sap/ui/core/LabelEnablement","sap/ui/core/Icon","sap/ui/core/IconPool","./Button","./Bar","./Title","./delegate/ValueStateMessage","sap/ui/core/message/MessageMixin","sap/ui/core/library","sap/ui/core/Item","sap/ui/Device","sap/ui/core/InvisibleText","./SelectRenderer","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","./Text","sap/m/SimpleFixFlex","sap/base/Log","sap/ui/core/ValueStateSupport","sap/ui/core/InvisibleMessage","sap/ui/core/Lib","sap/ui/core/ResizeHandler"],function(e,t,i,s,n,o,r,a,l,u,c,p,h,g,d,f,y,S,m,I,v,_,b,C,T,x,A,P,V){"use strict";var R=n.SelectListKeyboardNavigationMode;var k=n.PlacementType;var L=f.ValueState;var O=f.TextDirection;var E=f.TextAlign;var F=f.OpenState;var D=n.SelectType;var M=f.InvisibleMessageMode;var B=f.TitleLevel;var w=o.extend("sap.m.Select",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.m.IOverflowToolbarContent","sap.m.IToolbarInteractiveControl","sap.f.IShellBar","sap.ui.core.ISemanticFormContent","sap.ui.core.ILabelable"],library:"sap.m",properties:{name:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Behavior",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Data",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},type:{type:"sap.m.SelectType",group:"Appearance",defaultValue:D.Default},autoAdjustWidth:{type:"boolean",group:"Appearance",defaultValue:false},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:E.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:O.Inherit},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:L.None},valueStateText:{type:"string",group:"Misc",defaultValue:""},showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},resetOnMissingKey:{type:"boolean",group:"Behavior",defaultValue:false},forceSelection:{type:"boolean",group:"Behavior",defaultValue:true},wrapItemsText:{type:"boolean",group:"Behavior",defaultValue:false},columnRatio:{type:"sap.m.SelectColumnRatio",group:"Appearance",defaultValue:"3:2"},required:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable",forwarding:{getter:"getList",aggregation:"items"}},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"},_valueIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_pickerHeader:{type:"sap.m.Bar",multiple:false,visibility:"hidden"},_pickerValueStateContent:{type:"sap.m.Text",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{selectedItem:{type:"sap.ui.core.Item"},previousSelectedItem:{type:"sap.ui.core.Item"}}},liveChange:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},designtime:"sap/m/designtime/Select.designtime"},renderer:I});u.insertFontFaceStyle();r.apply(w.prototype,[true]);d.call(w.prototype);function H(e){if(this._isIconOnly()&&!this.isOpen()){return}if(e){if(this.getSelectedItemId()!==e.getId()){this.fireEvent("liveChange",{selectedItem:e})}this.setSelection(e);this.setValue(e.getText());this.scrollToItem(e)}}w.prototype._attachHiddenSelectHandlers=function(){var e=this._getHiddenSelect(),t=this._getHiddenInput();e.on("focus",this._addFocusClass.bind(this));e.on("blur",this._removeFocusClass.bind(this));t.on("focus",this.focus.bind(this))};w.prototype.focus=function(){this._getHiddenSelect().trigger("focus");o.prototype.focus.call(this,arguments)};w.prototype._addFocusClass=function(){this.$().addClass("sapMSltFocused")};w.prototype._removeFocusClass=function(){this.$().removeClass("sapMSltFocused")};w.prototype._detachHiddenSelectHandlers=function(){var e=this._getHiddenSelect(),t=this._getHiddenInput();if(e){e.off("focus");e.off("blur")}if(t){t.off("focus")}};w.prototype._getHiddenSelect=function(){return this.$("hiddenSelect")};w.prototype._getHiddenInput=function(){return this.$("hiddenInput")};w.prototype._announceValueStateText=function(){var e=this._getValueStateText();if(this._oInvisibleMessage){this._oInvisibleMessage.announce(e,M.Polite)}};w.prototype._getValueStateText=function(){var e=this.getValueState(),t,i;if(e===L.None){return""}t=P.getResourceBundleFor("sap.m").getText("INPUTBASE_VALUE_STATE_"+e.toUpperCase());i=t+" "+(this.getValueStateText()||x.getAdditionalText(this));return i};w.prototype._isFocused=function(){return this.getFocusDomRef()===document.activeElement};w.prototype._isIconOnly=function(){return this.getType()===D.IconOnly};w.prototype._handleFocusout=function(e){this._bFocusoutDueRendering=this.bRenderingPhase;if(this._bFocusoutDueRendering){this._bProcessChange=false;return}if(this._bProcessChange){if(!this.isOpen()||e.target===this.getAggregation("picker")){this._checkSelectionChange()}else{this._revertSelection()}this._bProcessChange=false}else{this._bProcessChange=true}};w.prototype._checkSelectionChange=function(){var e=this.getSelectedItem();if(this._oSelectionOnFocus!==e){this.fireChange({selectedItem:e,previousSelectedItem:this._oSelectionOnFocus})}};w.prototype._revertSelection=function(){var e=this.getSelectedItem();if(this._oSelectionOnFocus!==e){this.fireEvent("liveChange",{selectedItem:this._oSelectionOnFocus});this.setSelection(this._oSelectionOnFocus);this.setValue(this._getSelectedItemText())}};w.prototype._getSelectedItemText=function(e){e=e||this.getSelectedItem();if(!e){e=this.getDefaultSelectedItem()}if(e){return e.getText()}return""};w.prototype.getOverflowToolbarConfig=function(){var e=["enabled","selectedKey"];if(!this.getAutoAdjustWidth()||this._bIsInOverflow){e.push("selectedItemId")}var t={canOverflow:true,autoCloseEvents:["change"],invalidationEvents:["_itemTextChange"],propsUnrelatedToSize:e};t.onBeforeEnterOverflow=function(e){var t=e.getParent();if(!t.isA("sap.m.OverflowToolbar")){return}e._prevSelectType=e.getType();e._bIsInOverflow=true;if(e.getType()!==D.Default){e.setProperty("type",D.Default,true)}};t.onAfterExitOverflow=function(e){var t=e.getParent();if(!t.isA("sap.m.OverflowToolbar")){return}e._bIsInOverflow=false;if(e.getType()!==e._prevSelectType){e.setProperty("type",e._prevSelectType,true)}};return t};w.prototype.getList=function(){if(this._bIsBeingDestroyed){return null}return this._oList};w.prototype.findFirstEnabledItem=function(e){var t=this.getList();return t?t.findFirstEnabledItem(e):null};w.prototype.findLastEnabledItem=function(e){var t=this.getList();return t?t.findLastEnabledItem(e):null};w.prototype.setSelectedIndex=function(e,t){var i;t=t||this.getItems();e=e>t.length-1?t.length-1:Math.max(0,e);i=t[e];if(i){this.setSelection(i)}};w.prototype.scrollToItem=function(e){var t=this.getPicker().getDomRef(),i=e&&e.getDomRef();if(!t||!i){return}var s=t.querySelector(".sapUiSimpleFixFlexFlexContent"),n=t.querySelector(".sapMSltPickerValueState"),o=n?n.clientHeight:0,r=s.scrollTop,a=i.offsetTop-o,l=s.clientHeight,u=i.offsetHeight;if(r>a){s.scrollTop=a}else if(a+u>r+l){s.scrollTop=Math.ceil(a+u-l)}};w.prototype.setValue=function(e){var t=this.getDomRef(),i=t&&t.querySelector(".sapMSelectListItemText"),s=!this.isOpen()&&this._isFocused()&&this._oInvisibleMessage;if(i){i.textContent=e}this._setHiddenSelectValue();this._getValueIcon();if(s){this._oInvisibleMessage.announce(e,M.Assertive)}};w.prototype._setHiddenSelectValue=function(){var e=this._getHiddenSelect(),t=this._getHiddenInput(),i=this.getSelectedKey(),s=this._getSelectedItemText();t.attr("value",i||"");if(!this._isIconOnly()){e.text(s)}};w.prototype._getValueIcon=function(){if(this._bIsBeingDestroyed){return null}var e=this.getAggregation("_valueIcon"),t=this.getSelectedItem(),i=!!(t&&t.getIcon&&t.getIcon()),s=i?t.getIcon():"sap-icon://pull-down";if(!e){e=new l(this.getId()+"-labelIcon",{src:s,visible:false});this.setAggregation("_valueIcon",e,true)}if(e.getVisible()!==i){e.setVisible(i);e.toggleStyleClass("sapMSelectListItemIcon",i)}if(i&&t.getIcon()!==e.getSrc()){e.setSrc(s)}return e};w.prototype._isShadowListRequired=function(){if(this.getAutoAdjustWidth()){return false}else if(this.getWidth()==="auto"){return true}return false};w.prototype._handleAriaActiveDescendant=function(e){var t=this.getFocusDomRef(),i=e&&e.getDomRef(),s="aria-activedescendant";if(!t){return}if(i&&this.isOpen()){t.setAttribute(s,e.getId())}else{t.removeAttribute(s)}};w.prototype.updateItems=function(e){s.prototype.updateItems.apply(this,arguments);this._oSelectionOnFocus=this.getSelectedItem()};w.prototype.refreshItems=function(){s.prototype.refreshItems.apply(this,arguments)};w.prototype.onBeforeOpen=function(e){var t=this["_onBeforeOpen"+this.getPickerType()],i=this.getRenderer().CSS_CLASS;this.addStyleClass(i+"Pressed");this.addStyleClass(i+"Expanded");this.closeValueStateMessage();this.addContent();this.addContentToFlex();t&&t.call(this)};w.prototype.onAfterOpen=function(e){var t=this.getFocusDomRef(),i=null;if(!t){return}i=this.getSelectedItem();t.setAttribute("aria-expanded","true");t.setAttribute("aria-controls",this.getList().getId());if(i){t.setAttribute("aria-activedescendant",i.getId());this.scrollToItem(i)}};w.prototype.onBeforeClose=function(e){var t=this.getFocusDomRef(),i=this.getRenderer().CSS_CLASS;if(t){t.removeAttribute("aria-controls");t.removeAttribute("aria-activedescendant");if(this.shouldValueStateMessageBeOpened()&&document.activeElement===t){this.openValueStateMessage()}}this.removeStyleClass(i+"Expanded")};w.prototype.onAfterClose=function(e){var t=this.getFocusDomRef(),i=this.getRenderer().CSS_CLASS,s=i+"Pressed";if(t){t.setAttribute("aria-expanded","false");t.removeAttribute("aria-activedescendant")}this.removeStyleClass(s)};w.prototype.getPicker=function(){if(this._bIsBeingDestroyed){return null}return this.createPicker(this.getPickerType())};w.prototype.getValueStateTextInvisibleText=function(){if(this._bIsBeingDestroyed){return null}if(!this._oValueStateTextInvisibleText){this._oValueStateTextInvisibleText=new m({id:this.getId()+"-valueStateText-InvisibleText"});this._oValueStateTextInvisibleText.toStatic()}return this._oValueStateTextInvisibleText};w.prototype.getSimpleFixFlex=function(){if(this._bIsBeingDestroyed){return null}else if(this.oSimpleFixFlex){return this.oSimpleFixFlex}this.oSimpleFixFlex=new C({id:this.getPickerValueStateContentId(),fixContent:this._getPickerValueStateContent().addStyleClass(this.getRenderer().CSS_CLASS+"PickerValueState"),flexContent:this.createList()});return this.oSimpleFixFlex};w.prototype.setPickerType=function(e){this._sPickerType=e};w.prototype.getPickerType=function(){return this._sPickerType};w.prototype._getPickerValueStateContent=function(){if(!this.getAggregation("_pickerValueStateContent")){this.setAggregation("_pickerValueStateContent",new b({wrapping:true,text:this._getTextForPickerValueStateContent()}))}return this.getAggregation("_pickerValueStateContent")};w.prototype._updatePickerValueStateContentText=function(){var e=this.getPicker(),t=e&&e.getContent()[0].getFixContent(),i;if(t){i=this._getTextForPickerValueStateContent();t.setText(i)}};w.prototype._getTextForPickerValueStateContent=function(){var e=this.getValueStateText(),t;if(e){t=e}else{t=this._getDefaultTextForPickerValueStateContent()}return t};w.prototype._getDefaultTextForPickerValueStateContent=function(){var e=this.getValueState(),t,i;if(e===L.None){i=""}else{t=P.getResourceBundleFor("sap.ui.core");i=t.getText("VALUE_STATE_"+e.toUpperCase())}return i};w.prototype._updatePickerValueStateContentStyles=function(){var e=this.getValueState(),t=L,i=this.getRenderer().CSS_CLASS,s=i+"Picker",n=s+e+"State",o=s+"WithSubHeader",r=this.getPicker(),a=r&&r.getContent()[0].getFixContent();if(a){this._removeValueStateClassesForPickerValueStateContent(r);a.addStyleClass(n);if(e!==t.None){r.addStyleClass(o)}else{r.removeStyleClass(o)}}};w.prototype._removeValueStateClassesForPickerValueStateContent=function(e){var t=L,i=this.getRenderer().CSS_CLASS,s=i+"Picker",n=e.getContent()[0].getFixContent();Object.keys(t).forEach(function(e){var t=s+e+"State";n.removeStyleClass(t)})};w.prototype._createPopover=function(){var e=this;var t=new i({showArrow:false,showHeader:false,placement:k.VerticalPreferredBottom,offsetX:0,offsetY:0,initialFocus:this,ariaLabelledBy:this._getPickerHiddenLabelId()});t.addEventDelegate({ontouchstart:function(t){var i=this.getDomRef("cont");if(t.target===i||t.srcControl instanceof y){e._bProcessChange=false}}},t);this._decoratePopover(t);return t};w.prototype._decoratePopover=function(e){var t=this;e.open=function(){return this.openBy(t)}};w.prototype._onBeforeRenderingPopover=function(){var e=this.getPicker(),t=this.$().outerWidth()+"px";if(e){e.setContentMinWidth(t)}};w.prototype._createDialog=function(){var e=this,i=this._getPickerHeader(),s=new t({stretch:true,ariaLabelledBy:this._getPickerHiddenLabelId(),customHeader:i,beforeOpen:function(){e.updatePickerHeaderTitle()}});return s};w.prototype._getPickerTitle=function(){var e=this.getPicker(),t=e&&e.getCustomHeader();if(t){return t.getContentMiddle()[0]}return null};w.prototype._getPickerHeader=function(){var e=u.getIconURI("decline"),t;if(!this.getAggregation("_pickerHeader")){t=P.getResourceBundleFor("sap.m");this.setAggregation("_pickerHeader",new p({titleAlignment:n.TitleAlignment.Auto,contentMiddle:new h({text:t.getText("SELECT_PICKER_TITLE_TEXT"),level:B.H1}),contentRight:new c({icon:e,press:this.close.bind(this)})}))}return this.getAggregation("_pickerHeader")};w.prototype._getPickerHiddenLabelId=function(){return m.getStaticId("sap.m","INPUT_AVALIABLE_VALUES")};w.prototype.getPickerValueStateContentId=function(){return this.getId()+"-valueStateText"};w.prototype.updatePickerHeaderTitle=function(){var e=this.getPicker();if(!e){return}var t=this.getLabels();if(t.length){var i=t[0],s=this._getPickerTitle();if(i&&typeof i.getText==="function"){s&&s.setText(i.getText())}}};w.prototype._onBeforeOpenDialog=function(){};w.prototype.init=function(){this.setPickerType(S.system.phone?"Dialog":"Popover");this.createPicker(this.getPickerType());this._oSelectionOnFocus=null;this.bRenderingPhase=false;this._bFocusoutDueRendering=false;this._bProcessChange=false;this.sTypedChars="";this.iTypingTimeoutID=-1;this._oValueStateMessage=new g(this);this._bValueStateMessageOpened=false;this._sAriaRoleDescription=P.getResourceBundleFor("sap.m").getText("SELECT_ROLE_DESCRIPTION");this._oInvisibleMessage=null;this._referencingLabelsHandlers=[]};w.prototype._attachResizeHandlers=function(){if(this.getAutoAdjustWidth()&&this.getPicker()&&this.getPickerType()==="Popover"){this._iResizeHandlerId=V.register(this,this._onResizeRef.bind(this))}};w.prototype._detachResizeHandlers=function(){if(this._iResizeHandlerId){V.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null}};w.prototype._onResizeRef=function(){this.getPicker().oPopup.setFollowOf(true)};w.prototype.onBeforeRendering=function(){if(!this._oInvisibleMessage){this._oInvisibleMessage=A.getInstance()}this.bRenderingPhase=true;this.synchronizeSelection({forceSelection:this.getForceSelection()});this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();this._detachHiddenSelectHandlers();if(this._isIconOnly()){this.setAutoAdjustWidth(true)}};w.prototype.onAfterRendering=function(){this._detachResizeHandlers();this._attachResizeHandlers();this.bRenderingPhase=false;this._setHiddenSelectValue();this._attachHiddenSelectHandlers();this._clearReferencingLabelsHandlers();this._handleReferencingLabels()};w.prototype.exit=function(){var e=this.getValueStateMessage(),t=this._getValueIcon();this._oSelectionOnFocus=null;if(this._oValueStateTextInvisibleText){this._oValueStateTextInvisibleText.destroy();this._oValueStateTextInvisibleText=null}if(e){this.closeValueStateMessage();e.destroy()}if(t){t.destroy()}this._oValueStateMessage=null;this._bValueStateMessageOpened=false};w.prototype.ontouchstart=function(e){e.setMarked();if(this.getEnabled()&&this.getEditable()){this.addStyleClass(this.getRenderer().CSS_CLASS+"Pressed");this.focus()}};w.prototype.ontouchend=function(e){e.setMarked();if(this.getEnabled()&&this.getEditable()&&!this.isOpen()&&this.isOpenArea(e.target)){this.removeStyleClass(this.getRenderer().CSS_CLASS+"Pressed")}};w.prototype.ontap=function(e){var t=this.getRenderer().CSS_CLASS;e.setMarked();if(!this.getEnabled()||!this.getEditable()){return}if(this.isOpenArea(e.target)){if(this.isOpen()){this.close();this.removeStyleClass(t+"Pressed");return}if(S.system.phone){this.focus()}this.open()}if(this.isOpen()){this.addStyleClass(t+"Pressed")}};w.prototype.onSelectionChange=function(e){var t=e.getParameter("selectedItem"),i=this.getSelectedItem();this.close();this.setSelection(t);this.fireChange({selectedItem:t,previousSelectedItem:i});this.setValue(this._getSelectedItemText())};w.prototype.onkeypress=function(e){if(!this.getEditable()){return}e.setMarked();var t=String.fromCharCode(e.which),i;this.sTypedChars+=t;i=/^(.)\1+$/i.test(this.sTypedChars)?t:this.sTypedChars;clearTimeout(this.iTypingTimeoutID);this.iTypingTimeoutID=setTimeout(function(){this.sTypedChars="";this.iTypingTimeoutID=-1}.bind(this),1e3);H.call(this,this.searchNextItemByText(i))};w.prototype.onsapshow=function(e){if(!this.getEditable()){return}e.setMarked();if(e.which===_.F4){e.preventDefault()}this.toggleOpenState()};w.prototype.onsaphide=w.prototype.onsapshow;w.prototype.onmousedown=function(e){e.preventDefault();this._getHiddenSelect().trigger("focus")};w.prototype.onsapescape=function(e){if(!this.getEditable()||this._bSpaceDown){return}if(this.isOpen()){e.setMarked();this.close();this._revertSelection()}};w.prototype.onsapenter=function(e){e.preventDefault();if(!this.getEditable()){return}if(this.isOpen()){e.setMarked()}this.close();this._checkSelectionChange()};w.prototype.onkeydown=function(e){if(e.which===_.SPACE){this._bSpaceDown=true}if([_.ARROW_DOWN,_.ARROW_UP,_.SPACE].indexOf(e.which)>-1){e.preventDefault()}if(e.which===_.SHIFT||e.which===_.ESCAPE){this._bSupressNextAction=this._bSpaceDown}};w.prototype.onkeyup=function(e){if(!this.getEditable()){return}if(e.which===_.SPACE){if(!e.shiftKey&&!this._bSupressNextAction){e.setMarked();if(this.isOpen()){this._checkSelectionChange()}this.toggleOpenState()}this._bSpaceDown=false;this._bSupressNextAction=false}};w.prototype.onsapdown=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t,i=this.getSelectableItems();t=i[i.indexOf(this.getSelectedItem())+1];H.call(this,t)};w.prototype.onsapup=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t,i=this.getSelectableItems();t=i[i.indexOf(this.getSelectedItem())-1];H.call(this,t)};w.prototype.onsaphome=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t=this.getSelectableItems()[0];H.call(this,t)};w.prototype.onsapend=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t=this.findLastEnabledItem(this.getSelectableItems());H.call(this,t)};w.prototype.onsappagedown=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t=this.getSelectableItems(),i=this.getSelectedItem();this.setSelectedIndex(t.indexOf(i)+10,t);i=this.getSelectedItem();if(i){this.setValue(i.getText())}this.scrollToItem(i)};w.prototype.onsappageup=function(e){if(!this.getEditable()){return}e.setMarked();e.preventDefault();var t=this.getSelectableItems(),i=this.getSelectedItem();this.setSelectedIndex(t.indexOf(i)-10,t);i=this.getSelectedItem();if(i){this.setValue(i.getText())}this.scrollToItem(i)};w.prototype.onsaptabnext=function(e){if(this.isOpen()){this.close();this._checkSelectionChange()}};w.prototype.onsaptabprevious=w.prototype.onsaptabnext;w.prototype.onfocusin=function(e){if(!this._bFocusoutDueRendering&&!this._bProcessChange){this._oSelectionOnFocus=this.getSelectedItem()}this._bProcessChange=true;setTimeout(function(){if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&document.activeElement===this.getFocusDomRef()){this.openValueStateMessage()}}.bind(this),100)};w.prototype.onfocusout=function(e){this._handleFocusout(e);if(this.bRenderingPhase){return}this.closeValueStateMessage()};w.prototype.onsapfocusleave=function(t){var i=this.getAggregation("picker");if(!t.relatedControlId||!i){return}var s=e.getElementById(t.relatedControlId),n=s&&s.getFocusDomRef();if(S.system.desktop&&v(i.getFocusDomRef(),n)){this.focus()}};w.prototype.getFocusDomRef=function(){return this._getHiddenSelect()[0]};w.prototype.getPopupAnchorDomRef=function(){return this.getDomRef()};w.prototype.setSelection=function(t){var i=this.getList(),s;if(i){i.setSelection(t)}this.setAssociation("selectedItem",t,true);this.setProperty("selectedItemId",t instanceof y?t.getId():t,true);if(typeof t==="string"){t=e.getElementById(t)}s=t?t.getKey():"";this.setProperty("selectedKey",s,true);this._handleAriaActiveDescendant(t)};w.prototype.setColumnRatio=function(e){var t=this.getList();this.setProperty("columnRatio",e,true);if(t&&this.getShowSecondaryValues()){t.setProperty("_columnRatio",this.getColumnRatio())}return this};w.prototype.isSelectionSynchronized=function(){return s.prototype.isSelectionSynchronized.apply(this,arguments)};w.prototype.synchronizeSelection=function(){s.prototype.synchronizeSelection.apply(this,arguments)};w.prototype.addContent=function(e){};w.prototype.addContentToFlex=function(){};w.prototype.createPicker=function(e){var t=this.getAggregation("picker"),i=this.getRenderer().CSS_CLASS;if(t){return t}t=this["_create"+e]();this.setAggregation("picker",t,true);t.setHorizontalScrolling(false).setVerticalScrolling(false).addStyleClass(i+"Picker").addStyleClass(i+"Picker-CTX").addStyleClass("sapUiNoContentPadding").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this).addContent(this.getSimpleFixFlex());return t};w.prototype.searchNextItemByText=function(e){var t=this.getSelectedItem(),i,s,n,o;if(!(typeof e==="string"&&e!=="")){return null}if(e.length>1&&t.getText().toLowerCase().startsWith(e.toLowerCase())){return t}i=this.getItems();s=this.getSelectedIndex();n=i.splice(s+1,i.length-s);o=i.splice(0,i.length-1);i=n.concat(o);for(var r=0,a;r<i.length;r++){a=i[r];if(a.getEnabled()&&!a.isA("sap.ui.core.SeparatorItem")&&a.getText().toLowerCase().startsWith(e.toLowerCase())){return a}}return null};w.prototype.createList=function(){var e=R,t=S.system.phone?e.Delimited:e.None;this._oList=new s({width:"100%",keyboardNavigationMode:t,hideDisabledItems:true}).addStyleClass(this.getRenderer().CSS_CLASS+"List-CTX").addEventDelegate({ontap:function(e){var t=e.srcControl;if(t.getEnabled()){this._checkSelectionChange();this.close()}}},this).addEventDelegate({onAfterRendering:this.onAfterRenderingList},this).attachSelectionChange(this.onSelectionChange,this);this._oList.setProperty("_tabIndex","-1");this._oList.toggleStyleClass("sapMSelectListWrappedItems",this.getWrapItemsText());return this._oList};w.prototype.setWrapItemsText=function(e){var t=this.getPicker();if(this._oList){this._oList.toggleStyleClass("sapMSelectListWrappedItems",e)}if(t&&this.getPickerType()==="Popover"){t.toggleStyleClass("sapMPickerWrappedItems",e)}return this.setProperty("wrapItemsText",e,true)};w.prototype.hasContent=function(){return this.getItems().length>0};w.prototype.onBeforeRenderingPicker=function(){var e=this["_onBeforeRendering"+this.getPickerType()];e&&e.call(this)};w.prototype.onAfterRenderingPicker=function(){var e=this["_onAfterRendering"+this.getPickerType()];e&&e.call(this)};w.prototype.onAfterRenderingList=function(){};w.prototype.open=function(){var e=this.getPicker();this.focus();if(e){e.open()}return this};w.prototype.toggleOpenState=function(){if(this.isOpen()){this.close()}else{this.open()}return this};w.prototype.getVisibleItems=function(){var e=this.getList();return e?e.getVisibleItems():[]};w.prototype.isItemSelected=function(e){return e&&e.getId()===this.getAssociation("selectedItem")};w.prototype.getSelectedIndex=function(){var e=this.getSelectedItem();return e?this.indexOfItem(this.getSelectedItem()):-1};w.prototype.getDefaultSelectedItem=function(e){return this.getForceSelection()?this.findFirstEnabledItem():null};w.prototype.getSelectableItems=function(){var e=this.getList();if(!e){return[]}return e.getSelectableItems()};w.prototype.getOpenArea=function(){return this.getDomRef()};w.prototype.isOpenArea=function(e){var t=this.getOpenArea();return t&&t.contains(e)};w.prototype.getFormFormattedValue=function(){var e=this.getSelectedItem();return e?e.getText():""};w.prototype.getFormValueProperty=function(){return"selectedKey"};w.prototype.getFormObservingProperties=function(){return["selectedKey"]};w.prototype.getFormRenderAsControl=function(){return false};w.prototype.findItem=function(e,t){var i=this.getList();return i?i.findItem(e,t):null};w.prototype.clearSelection=function(){this.setSelection(null)};w.prototype.onItemChange=function(e){var t=this.getAssociation("selectedItem"),i=e.getParameter("id"),s=e.getParameter("name"),n=e.getParameter("newValue"),o,r,a,l;if(s==="key"&&!this.isBound("selectedKey")){r=this.getSelectedKey();a=this.getItemByKey(n);if(n===r&&t!==i&&a&&i===a.getId()){this.setSelection(a);return}o=e.getParameter("oldValue");if(t===i&&r===o&&!this.getItemByKey(o)){this.setSelectedKey(n);return}l=this.getItemByKey(r);if(t===i&&n!==r&&l){this.setSelection(l);return}}if(s==="text"&&t===i){this.fireEvent("_itemTextChange");this.setValue(n)}};w.prototype.fireChange=function(e){this._oSelectionOnFocus=e.selectedItem;return this.fireEvent("change",e)};w.prototype.addAggregation=function(e,t,i){if(e==="items"&&!i&&!this.isInvalidateSuppressed()){this.invalidate(t)}return o.prototype.addAggregation.apply(this,arguments)};w.prototype.destroyAggregation=function(e,t){if(e==="items"&&!t&&!this.isInvalidateSuppressed()){this.invalidate()}return o.prototype.destroyAggregation.apply(this,arguments)};w.prototype.setAssociation=function(e,t,i){var n=this.getList();if(n&&e==="selectedItem"){s.prototype.setAssociation.apply(n,arguments)}return o.prototype.setAssociation.apply(this,arguments)};w.prototype.setProperty=function(e,t,i){var n=this.getList();if(e==="selectedKey"||e==="selectedItemId"){n&&s.prototype.setProperty.apply(n,arguments)}try{o.prototype.setProperty.apply(this,arguments)}catch(e){T.warning("Update failed due to exception. Loggable in support mode log",null,null,function(){return{exception:e}})}return this};w.prototype.removeAllAssociation=function(e,t){var i=this.getList();if(i&&e==="selectedItem"){s.prototype.removeAllAssociation.apply(i,arguments)}return o.prototype.removeAllAssociation.apply(this,arguments)};w.prototype.clone=function(){var e=o.prototype.clone.apply(this,arguments),t=this.getSelectedItem(),i=this.getSelectedKey();if(!this.isBound("selectedKey")&&!e.isSelectionSynchronized()){if(t&&i===""){e.setSelectedIndex(this.indexOfItem(t))}else{e.setSelectedKey(i)}}return e};w.prototype._updatePickerAriaLabelledBy=function(e){var t=this.getPicker(),i;if(!t){return}i=this.getValueStateTextInvisibleText().getId();if(e===L.None){t.removeAriaLabelledBy(i)}else{t.addAriaLabelledBy(i)}};w.prototype._handleReferencingLabels=function(){var e=this.getLabels(),t,i=this;e.forEach(function(e){if(!e){return}t={ontap:function(){if(window.getSelection().type!=="Range"){i.focus()}}};i._referencingLabelsHandlers.push({oDelegate:t,sLabelId:e.getId()});e.addEventDelegate(t)})};w.prototype._clearReferencingLabelsHandlers=function(){var t;this._referencingLabelsHandlers.forEach(function(i){t=e.getElementById(i.sLabelId);if(t){t.removeEventDelegate(i.oDelegate)}});this._referencingLabelsHandlers=[]};w.prototype.getLabels=function(){var t=this.getAriaLabelledBy().concat(a.getReferencingLabels(this));t=t.filter(function(e,i){return t.indexOf(e)===i}).map(function(t){return e.getElementById(t)}).filter(Boolean);return t};w.prototype.getDomRefForValueStateMessage=function(){return this.getFocusDomRef()};w.prototype.getValueStateMessageId=function(){return this.getId()+"-message"};w.prototype.getValueStateMessage=function(){return this._oValueStateMessage};w.prototype.openValueStateMessage=function(){var e=this.getValueStateMessage();if(e&&!this._bValueStateMessageOpened){this._bValueStateMessageOpened=true;e.open()}};w.prototype.closeValueStateMessage=function(){var e=this.getValueStateMessage();if(e&&this._bValueStateMessageOpened){this._bValueStateMessageOpened=false;e.close()}};w.prototype.shouldValueStateMessageBeOpened=function(){return!this._isIconOnly()&&this.getValueState()!==L.None&&this.getEnabled()&&this.getEditable()&&!this._bValueStateMessageOpened};w.prototype.setShowSecondaryValues=function(e){var t=!this._isShadowListRequired();this.setProperty("showSecondaryValues",e,t);var i=this.getList(),s=e?this.getColumnRatio():null;if(i){i.setShowSecondaryValues(e);i.setProperty("_columnRatio",s)}return this};w.prototype.addItem=function(e){this.addAggregation("items",e);if(e){e.attachEvent("_change",this.onItemChange,this)}return this};w.prototype.insertItem=function(e,t){this.insertAggregation("items",e,t);if(e){e.attachEvent("_change",this.onItemChange,this)}return this};w.prototype.findAggregatedObjects=function(){var e=this.getList();if(e){return s.prototype.findAggregatedObjects.apply(e,arguments)}return[]};w.prototype.getItems=function(){var e=this.getList();return e?e.getItems():[]};w.prototype.setSelectedItem=function(t){if(typeof t==="string"){this.setAssociation("selectedItem",t,true);t=e.getElementById(t)}if(!(t instanceof y)&&t!==null){return this}if(!t){t=this.getDefaultSelectedItem()}this.setSelection(t);this.setValue(this._getSelectedItemText(t));this._oSelectionOnFocus=t;return this};w.prototype.setSelectedItemId=function(e){e=this.validateProperty("selectedItemId",e);if(!e){e=this.getDefaultSelectedItem()}this.setSelection(e);this.setValue(this._getSelectedItemText());this._oSelectionOnFocus=this.getSelectedItem();return this};w.prototype._isKeyAvailable=function(e){var t=this._oList.getItems().map(function(e){return e.getKey()});return t.indexOf(e)>-1};w.prototype.setSelectedKey=function(e){e=this.validateProperty("selectedKey",e);var t=e==="";if(!t&&!this._isKeyAvailable(e)&&this.getResetOnMissingKey()){t=true}if(!this.getForceSelection()&&t){this.setSelection(null);this.setValue("");return this.setProperty("selectedKey",e)}var i=this.getItemByKey(e);if(i||t){if(!i&&t){i=this.getDefaultSelectedItem()}this.setSelection(i);this.setValue(this._getSelectedItemText(i));this._oSelectionOnFocus=i;return this}return this.setProperty("selectedKey",e)};w.prototype.setValueState=function(e){var t=this.getValueState(),i,s;if(e===t){return this}s=this.getPicker();if(s&&s.isA("sap.m.Popover")&&s.isOpen()&&s.oPopup.getOpenState()===F.CLOSING){s.attachEventOnce("afterClose",function(t){this._updatePickerAriaLabelledBy(e)},this)}else{this._updatePickerAriaLabelledBy(e)}this.setProperty("valueState",e);if(this._isFocused()){this._announceValueStateText()}i=this.getDomRefForValueState();if(!i){return this}if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&document.activeElement===i){this.openValueStateMessage()}else{this.closeValueStateMessage()}this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();return this};w.prototype.setValueStateText=function(e){var t=this.getValueStateTextInvisibleText();this.setProperty("valueStateText",e);if(t){t.setText(e)}if(this.getDomRefForValueState()){this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles()}if(this._isFocused()){this._announceValueStateText()}return this};w.prototype.getItemAt=function(e){return this.getItems()[+e]||null};w.prototype.getSelectedItem=function(){var t=this.getAssociation("selectedItem");return t===null?null:e.getElementById(t)||null};w.prototype.getFirstItem=function(){return this.getItems()[0]||null};w.prototype.getLastItem=function(){var e=this.getItems();return e[e.length-1]||null};w.prototype.getEnabledItems=function(e){var t=this.getList();return t?t.getEnabledItems(e):[]};w.prototype.getItemByKey=function(e){var t=this.getList();return t?t.getItemByKey(e):null};w.prototype.removeItem=function(e){var t;e=this.removeAggregation("items",e);if(this.getItems().length===0){this.clearSelection()}else if(this.isItemSelected(e)){t=this.findFirstEnabledItem();if(t){this.setSelection(t)}}this.setValue(this._getSelectedItemText());if(e){e.detachEvent("_change",this.onItemChange,this)}return e};w.prototype.removeAllItems=function(){var e=this.removeAllAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove()}for(var t=0;t<e.length;t++){e[t].detachEvent("_change",this.onItemChange,this)}return e};w.prototype.destroyItems=function(){this.destroyAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove()}return this};w.prototype.isOpen=function(){var e=this.getAggregation("picker");return!!(e&&e.isOpen())};w.prototype.close=function(){var e=this.getAggregation("picker");if(e){e.close()}return this};w.prototype.getDomRefForValueState=function(){return this.getFocusDomRef()};w.prototype._isRequired=function(){return this.getRequired()||a.isRequired(this)};w.prototype.getAccessibilityInfo=function(){var e=[],t="",i=P.getResourceBundleFor("sap.m"),s=this._isIconOnly(),n={role:this.getRenderer().getAriaRole(this),focusable:this.getEnabled(),enabled:this.getEnabled(),readonly:s?undefined:this.getEnabled()&&!this.getEditable()};if(s){var o=this.getTooltip_AsString();if(!o){var r=u.getIconInfo(this.getIcon());o=r&&r.text?r.text:""}n.type=i.getText("ACC_CTR_TYPE_BUTTON");e.push(o)}else if(this.getType()==="Default"){n.type=i.getText("SELECT_ROLE_DESCRIPTION");e.push(this._getSelectedItemText())}if(this._isRequired()){e.push(i.getText("SELECT_REQUIRED"))}t=e.join(" ").trim();if(t){n.description=t}return n};w.prototype._getToolbarInteractive=function(){return true};w.prototype.hasLabelableHTMLElement=function(){return this.getId()+"-hiddenSelect"};return w});
//# sourceMappingURL=Select.js.map