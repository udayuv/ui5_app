/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Lib","sap/ui/model/ValidateException","sap/ui/model/odata/type/ODataType","sap/ui/model/type/String"],function(e,t,i,n,s){"use strict";var r=/^\d+$/,a=/^0*(?=\d)/;function o(e,t){return t&&t.isDigitSequence&&e&&e.match(r)}function l(t,i){var n,s,r;t.oConstraints=undefined;if(i){s=i.maxLength;if(typeof s==="string"){s=parseInt(s)}if(typeof s==="number"&&!isNaN(s)&&s>0){t.oConstraints={maxLength:s}}else if(s!==undefined){e.warning("Illegal maxLength: "+i.maxLength,null,t.getName())}n=i.isDigitSequence;if(n===true||n==="true"){t.oConstraints=t.oConstraints||{};t.oConstraints.isDigitSequence=true}else if(n!==undefined&&n!==false&&n!=="false"){e.warning("Illegal isDigitSequence: "+n,null,t.getName())}r=i.nullable;if(r===false||r==="false"){t.oConstraints=t.oConstraints||{};t.oConstraints.nullable=false}else if(r!==undefined&&r!==true&&r!=="true"){e.warning("Illegal nullable: "+r,null,t.getName())}}}var u=n.extend("sap.ui.model.odata.type.String",{constructor:function(t,i){var s=t?t.parseKeepsEmptyString:undefined;n.apply(this,arguments);this.oFormatOptions=t;l(this,i);this._sParsedEmptyString=null;if(this.oConstraints&&this.oConstraints.nullable===false&&this.oConstraints.isDigitSequence){this._sParsedEmptyString="0"}else if(s!==undefined){if(s===true){this._sParsedEmptyString=""}else if(s!==false){e.warning("Illegal parseKeepsEmptyString: "+s,null,this.getName())}}}});u.prototype.formatValue=function(e,t){if(e===null&&this.getPrimitiveType(t)==="string"){return""}if(o(e,this.oConstraints)){e=e.replace(a,"");if(this.oConstraints.maxLength&&e==="0"&&this.getPrimitiveType(t)==="string"){return""}}return s.prototype.formatValue.call(this,e,t)};u.prototype.parseValue=function(e,t){var i;i=e===""?this._sParsedEmptyString:s.prototype.parseValue.apply(this,arguments);if(o(i,this.oConstraints)){i=i.replace(a,"");if(this.oConstraints.maxLength){i=i.padStart(this.oConstraints.maxLength,"0")}}return i};u.prototype.validateValue=function(e){var n=this.oConstraints||{},s=n.maxLength;if(e===null){if(n.nullable!==false){return}}else if(e===""&&this._sParsedEmptyString===""){return}else if(typeof e!=="string"){throw new i("Illegal "+this.getName()+" value: "+e)}else if(n.isDigitSequence){if(!e.match(r)){throw new i(t.getResourceBundleFor("sap.ui.core").getText("EnterDigitsOnly"))}if(s&&e.length>s){throw new i(t.getResourceBundleFor("sap.ui.core").getText("EnterMaximumOfDigits",[s]))}return}else if(!s||e.length<=s){return}throw new i(t.getResourceBundleFor("sap.ui.core").getText(s?"EnterTextMaxLength":"EnterText",[s]))};u.prototype.getName=function(){return"sap.ui.model.odata.type.String"};return u});
//# sourceMappingURL=String.js.map