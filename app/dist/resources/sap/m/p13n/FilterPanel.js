/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/p13n/QueryPanel","sap/m/VBox","sap/m/Text","sap/ui/layout/Grid","sap/ui/layout/GridData","sap/m/ComboBox","sap/ui/core/library","sap/m/library","sap/m/Label","sap/ui/core/Lib"],(t,e,o,n,r,s,a,i,c,p)=>{"use strict";const l=a.ValueState;const u=i.ListKeyboardMode;const y=i.FlexJustifyContent;const _=i.WrappingType;const g=t.extend("sap.m.p13n.FilterPanel",{metadata:{library:"sap.m",properties:{itemFactory:{type:"function"},title:{type:"string",defaultValue:p.getResourceBundleFor("sap.m").getText("p13n.DEFAULT_TITLE_FILTER")}}},renderer:{apiVersion:2}});g.prototype.PRESENCE_ATTRIBUTE="active";g.prototype._createInnerListControl=function(){const e=t.prototype._createInnerListControl.apply(this,arguments);return e};g.prototype._createQueryRowGrid=function(t){const e=t.name?this._createRowContainer(t.label,t.key):this._createKeySelect(t.name);const o=[e];if(t.name){const n=this._createFactoryControl(t);o.push(n);this._setLabelForOnBox(n,e)}return new n({containerQuery:true,defaultSpan:"XL4 L4 M4 S4",content:o}).addStyleClass("sapUiTinyMargin")};g.prototype._getPlaceholderText=function(){return this._getResourceText("p13n.FILTER_PLACEHOLDER")};g.prototype._getRemoveButtonTooltipText=function(){return this._getResourceText("p13n.FILTER_REMOVEICONTOOLTIP")};g.prototype._getRemoveButtonAnnouncementText=function(){return this._getResourceText("p13n.FILTER_REMOVEICONANNOUNCE")};g.prototype._createKeySelect=function(t){const e=new s({width:"100%",items:this._getAvailableItems(),placeholder:this._getPlaceholderText(),selectionChange:t=>{const e=t.getSource();this._selectKey(e)},change:t=>{const e=t.getSource();const o=t.getParameter("newValue");e.setValueState(o&&!e.getSelectedItem()?l.Error:l.None);this._selectKey()}});e.setLayoutData(new r({span:"XL4 L4 M4 S11"}));return e};g.prototype._createRemoveButton=function(e){const o=t.prototype._createRemoveButton.apply(this,arguments);o.setJustifyContent(y.Start);o.setLayoutData(new r({span:"XL1 L1 M1 S1"}));return o};g.prototype._createRowContainer=(t,o)=>{const n=new c({text:t,showColon:true,wrapping:true,wrappingType:_.Hyphenated});const r=new e({items:[n.addStyleClass("sapUiTinyMarginBegin")]});r._key=o;return r};g.prototype._setLabelForOnBox=(t,e)=>{e.getItems()[0].setLabelFor(t)};g.prototype._selectKey=function(e){let o,n;if(e){this._oComboBox=e;o=e.getParent();n=e.getSelectedKey()}else if(this._oComboBox){e=this._oComboBox;o=e.getParent();n=e.getSelectedKey();let r;if(n){t.prototype._selectKey.call(this,e);const s=o.getContent()[0];o.removeContent(s);const a=n?e.getSelectedItem().getText():"";const i=this._createRowContainer(a,n);o.insertContent(i,0);r=this._createFactoryControl({name:n});this._setLabelForOnBox(r,i);o.insertContent(r,1)}setTimeout(()=>{if(this._oListControl&&!this._oListControl.bIsDestroyed){this._oListControl.setKeyboardMode(u.Edit)}const t=r?.getMetadata().getName().includes("sap.ui.mdc")?r.getItems()?.[0]:r;t?.focus()},20);delete this._oComboBox}};g.prototype._getFactoryControlForRow=t=>t.getContent()[0].getContent()[1];g.prototype._createFactoryControl=function(t){const e=this.getItemFactory().call(this,t);e.setLayoutData(new r({span:"XL7 L7 M7 S7"}));let o;this._getP13nModel().getProperty("/items").forEach((e,n)=>{if(e.key==t.name){o=n}});const n=this._getP13nModel().createBindingContext(`/items/${o}/`);e.setBindingContext(n,this.P13N_MODEL);return e};g.prototype._updatePresence=function(e,o,n){t.prototype._updatePresence.apply(this,arguments);if(!o){const t=this._getP13nModel().getProperty("/items").find(t=>t.name===e);t.conditions=[{operator:"Contains",conditions:[]}]}};return g});
//# sourceMappingURL=FilterPanel.js.map