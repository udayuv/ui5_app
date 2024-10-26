/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataContextBinding","./ODataListBinding","./ODataMetaModel","./ODataPropertyBinding","./SubmitMode","./lib/_GroupLock","./lib/_Helper","./lib/_MetadataRequestor","./lib/_Parser","./lib/_Requestor","sap/base/assert","sap/base/Log","sap/base/i18n/Localization","sap/ui/base/SyncPromise","sap/ui/core/Messaging","sap/ui/core/Rendering","sap/ui/core/Supportability","sap/ui/core/cache/CacheManager","sap/ui/core/message/Message","sap/ui/core/message/MessageType","sap/ui/model/BindingMode","sap/ui/model/Context","sap/ui/model/Model","sap/ui/model/odata/OperationMode","sap/ui/thirdparty/URI"],function(e,t,r,i,o,n,s,a,u,p,d,h,c,f,l,g,y,m,v,w,E,b,M,P,R){"use strict";var C="sap.ui.model.odata.v4.ODataModel",B=["$count","$expand","$filter","$levels","$orderby","$search","$select"],q=["$$groupId","$$patchWithoutSideEffects","$$updateGroupId"],I=[undefined,w.Success,w.Information,w.Warning,w.Error],$={dataReceived:true,dataRequested:true,messageChange:true,propertyChange:true,sessionTimeout:true},A={annotationURI:true,autoExpandSelect:true,earlyRequests:true,groupId:true,groupProperties:true,httpHeaders:true,ignoreAnnotationsFromMetadata:true,metadataUrlParams:true,odataVersion:true,operationMode:true,serviceUrl:true,sharedRequests:true,supportReferences:true,synchronizationMode:true,updateGroupId:true,withCredentials:true},D=["$apply","$count","$expand","$filter","$orderby","$search","$select"],O=/^[ -~]+$/,k=M.extend("sap.ui.model.odata.v4.ODataModel",{constructor:G});function G(e={}){var t,i=c.getLanguageTag().toString(),n,u,d,h,f,g,m=this;M.call(this);if("synchronizationMode"in e&&e.synchronizationMode!=="None"){throw new Error("Synchronization mode must be 'None'")}n=e.odataVersion||"4.0";this.sODataVersion=n;if(n!=="4.0"&&n!=="2.0"){throw new Error("Unsupported value for parameter odataVersion: "+n)}for(u in e){if(!(u in A)){throw new Error("Unsupported parameter: "+u)}}h=e.serviceUrl;if(!h){throw new Error("Missing service root URL")}f=new R(h);if(f.path()[f.path().length-1]!=="/"){throw new Error("Service root URL must end with '/'")}if(e.operationMode&&e.operationMode!==P.Server){throw new Error("Unsupported operation mode: "+e.operationMode)}this.sOperationMode=e.operationMode;g=this.buildQueryOptions(f.query(true),false,true);this.mUriParameters=g;if(y.isStatisticsEnabled()){g=Object.assign({"sap-statistics":true},g)}this.sServiceUrl=f.query("").toString();this.sGroupId=e.groupId;if(this.sGroupId===undefined){this.sGroupId="$auto"}if(this.sGroupId!=="$auto"&&this.sGroupId!=="$direct"){throw new Error("Group ID must be '$auto' or '$direct'")}s.checkGroupId(e.updateGroupId,false,false,"Invalid update group ID: ");this.sUpdateGroupId=e.updateGroupId||this.getGroupId();this.mGroupProperties={};for(const r in e.groupProperties){s.checkGroupId(r,true);t=e.groupProperties[r];if(typeof t!=="object"||Object.keys(t).length!==1||!(t.submit in o)){throw new Error("Group '"+r+"' has invalid properties: '"+t+"'")}}this.mGroupProperties=s.clone(e.groupProperties)||{};this.mGroupProperties.$auto={submit:o.Auto};this.mGroupProperties.$direct={submit:o.Direct};if(e.autoExpandSelect!==undefined&&typeof e.autoExpandSelect!=="boolean"){throw new Error("Value for autoExpandSelect must be true or false")}this.bAutoExpandSelect=e.autoExpandSelect===true;if("sharedRequests"in e&&e.sharedRequests!==true){throw new Error("Value for sharedRequests must be true")}this.bSharedRequests=e.sharedRequests===true;this.bIgnoreETag=false;if("ignoreAnnotationsFromMetadata"in e&&e.ignoreAnnotationsFromMetadata!==true){throw new Error("Value for ignoreAnnotationsFromMetadata must be true")}this.mHeaders={"Accept-Language":i};this.mMetadataHeaders={"Accept-Language":i};d=Object.assign({},g,e.metadataUrlParams);this.oMetaModel=new r(a.create(this.mMetadataHeaders,n,e.ignoreAnnotationsFromMetadata,d,e.withCredentials),this.sServiceUrl+"$metadata",e.annotationURI,this,e.supportReferences,d["sap-language"]);this.oInterface={fetchEntityContainer:this.oMetaModel.fetchEntityContainer.bind(this.oMetaModel),fetchMetadata:this.oMetaModel.fetchObject.bind(this.oMetaModel),fireDataReceived:this.fireDataReceived.bind(this),fireDataRequested:this.fireDataRequested.bind(this),fireSessionTimeout:function(){m.fireEvent("sessionTimeout")},getGroupProperty:this.getGroupProperty.bind(this),getMessagesByPath:this.getMessagesByPath.bind(this),getOptimisticBatchEnabler:this.getOptimisticBatchEnabler.bind(this),getReporter:this.getReporter.bind(this),isIgnoreETag:function(){return m.bIgnoreETag},onCreateGroup:function(e){if(m.isAutoGroup(e)){m.addPrerenderingTask(m._submitBatch.bind(m,e,true))}},onHttpResponse:function(e){const t=m.fnHttpListener;t?.({responseHeaders:e})},reportStateMessages:this.reportStateMessages.bind(this),reportTransitionMessages:this.reportTransitionMessages.bind(this),updateMessages:function(e,t){l.updateMessages(e,t)}};this.oRequestor=p.create(this.sServiceUrl,this.oInterface,this.mHeaders,g,n,e.withCredentials);this.changeHttpHeaders(e.httpHeaders);this.bEarlyRequests=e.earlyRequests;if(this.bEarlyRequests){this.oMetaModel.fetchEntityContainer(true);this.initializeSecurityToken();this.oRequestor.sendOptimisticBatch()}this.aAllBindings=[];this.oAnnotationChangePromise=null;this.mKeepAliveBindingsByPath={};this.mSupportedBindingModes={OneTime:true,OneWay:true};if(e.sharedRequests){this.sDefaultBindingMode=E.OneWay}else{this.sDefaultBindingMode=E.TwoWay;this.mSupportedBindingModes.TwoWay=true}this.aPrerenderingTasks=null;this.fnHttpListener=null;this.fnOptimisticBatchEnabler=null;this.mPath2DataReceivedError={};this.mPath2DataRequestedCount={}}k.prototype._requestAnnotationChanges=function(){this.oAnnotationChangePromise??=f.resolve();return this.oAnnotationChangePromise};k.prototype._submitBatch=function(e,t){var r=this;return this.oRequestor.submitBatch(e).catch(function(e){r.reportError("$batch failed",C,e);if(!t){throw e}})};k.prototype.addPrerenderingTask=function(e,t){var r,i,o=this;function n(e){clearTimeout(i);while(e.length){e.shift()()}if(o.aPrerenderingTasks===e){o.aPrerenderingTasks=null}}if(!this.aPrerenderingTasks){this.aPrerenderingTasks=[];r=n.bind(null,this.aPrerenderingTasks);g.addPrerenderingTask(r);i=setTimeout(function(){i=setTimeout(r,0)},0)}if(t){this.aPrerenderingTasks.unshift(e)}else{this.aPrerenderingTasks.push(e)}};k.prototype.attachDataReceived=function(e,t){return this.attachEvent("dataReceived",e,t)};k.prototype.attachDataRequested=function(e,t){return this.attachEvent("dataRequested",e,t)};k.prototype.attachEvent=function(e,t,r,i){if(!(e in $)){throw new Error("Unsupported event '"+e+"': v4.ODataModel#attachEvent")}return M.prototype.attachEvent.apply(this,arguments)};k.prototype.attachSessionTimeout=function(e,t){return this.attachEvent("sessionTimeout",e,t)};k.prototype.bindContext=function(t,r,i){return new e(this,t,r,i)};k.prototype.bindingCreated=function(e){this.aAllBindings.push(e)};k.prototype.bindingDestroyed=function(e){var t=this.aAllBindings.indexOf(e);if(t<0){throw new Error("Unknown "+e)}this.aAllBindings.splice(t,1)};k.prototype.bindList=function(e,r,i,o,n){return new t(this,e,r,i,o,n)};k.prototype.bindProperty=function(e,t,r){return new i(this,e,t,r)};k.prototype.bindTree=function(e,t,r,i,o){throw new Error("Unsupported operation: v4.ODataModel#bindTree")};k.prototype.buildQueryOptions=function(e,t,r){var i,o=Object.assign({},e);function n(e,r,i){var o,a,p,d=e[r];if(!t||!i.includes(r)){throw new Error("System query option "+r+" is not supported")}if((r==="$expand"||r==="$select")&&typeof d==="string"){d=u.parseSystemQueryOption(r+"="+d)[r];e[r]=d}if(r==="$expand"){d=e[r]=s.clone(d);for(p in d){a=d[p];if(a===null||typeof a!=="object"){a=d[p]={}}for(o in a){n(a,o,B)}}}else if(r==="$count"){if(typeof d==="boolean"){if(!d){delete e.$count}}else{switch(typeof d==="string"&&d.toLowerCase()){case"false":delete e.$count;break;case"true":e.$count=true;break;default:throw new Error("Invalid value for $count: "+d)}}}}if(e){for(i in e){if(i.startsWith("$$")){delete o[i]}else if(i[0]==="@"){throw new Error("Parameter "+i+" is not supported")}else if(i[0]==="$"){n(o,i,D)}else if(!r&&i.startsWith("sap-")&&!i.startsWith("sap-valid-")){throw new Error("Custom query option "+i+" is not supported")}}}return o};k.prototype.changeHttpHeaders=function(e){var t,r,i={},o,n;this.oRequestor.checkHeaderNames(e);for(n in e){r=n.toLowerCase();o=e[n];if(i[r]){throw new Error("Duplicate header "+n)}else if(!(typeof o==="string"&&O.test(o)||o===undefined)){throw new Error("Unsupported value for header '"+n+"': "+o)}else{if(r==="x-csrf-token"){n="X-CSRF-Token"}i[r]={key:n,value:o}}}this.oRequestor.checkForOpenRequests();for(n in this.mHeaders){r=n.toLowerCase();t=i[r];if(t){delete this.mHeaders[n];delete this.mMetadataHeaders[n];if(t.value!==undefined){this.mHeaders[t.key]=t.value;this.mMetadataHeaders[t.key]=t.value}delete i[r]}}for(n in i){t=i[n];if(t.value!==undefined){this.mHeaders[t.key]=t.value;if(n!=="x-csrf-token"){this.mMetadataHeaders[t.key]=t.value}}}};k.prototype.checkBatchGroupId=function(e){s.checkGroupId(e);if(this.isDirectGroup(e)){throw new Error("Group ID does not use batch requests: "+e)}};k.prototype.clearSessionContext=function(){this.oRequestor.clearSessionContext()};k.prototype.createBindingContext=function(e,t){var r,i,o,n;function s(e){var t=e.indexOf("."),r=e.indexOf("/");return t>0&&(r<0||t<r)}if(arguments.length>2){throw new Error("Only the parameters sPath and oContext are supported")}if(t&&t.getBinding){throw new Error("Unsupported type: oContext must be of type sap.ui.model.Context, "+"but was sap.ui.model.odata.v4.Context")}o=this.resolve(e,t);if(o===undefined){throw new Error("Cannot create binding context from relative path '"+e+"' without context")}n=o.indexOf("#");if(n>=0){r=o.slice(0,n);let e=o.slice(n+1);if(e[0]==="#"){e=e.slice(1)}else if(r.length>1&&e[0]!=="@"&&s(e)){return new b(this,o)}if(e[0]==="/"){e="."+e}i=this.oMetaModel.getMetaContext(r);return this.oMetaModel.createBindingContext(e,i)}return new b(this,o)};k.prototype.createUI5Message=function(e,t,r,i=e){var o=typeof e.target==="string",n=e.longtextUrl,a,u=this;function p(e){return u.normalizeMessageTarget(e[0]==="/"?e:s.buildPath("/"+t,r,e))}if(o){t&&=t.split("?")[0];a=[p(e.target)];if(e.additionalTargets){e.additionalTargets.forEach(function(e){a.push(p(e))})}}if(n&&t){n=s.makeAbsolute(n,this.sServiceUrl+t)}return new v({code:e.code,descriptionUrl:n||undefined,message:e.message,persistent:!o||e.transition,processor:this,target:o?a:"",technical:e.technical,technicalDetails:s.createTechnicalDetails(i),type:I[e.numericSeverity]||w.None})};k.prototype.delete=function(e,t,r){var i,o,n=this;if(typeof e==="string"){if(e[0]!=="/"){throw new Error("Invalid path: "+e)}i=true;o=Promise.resolve([e,"*"])}else{o=Promise.all([e.fetchCanonicalPath(),e.fetchValue("@odata.etag",null,true)])}s.checkGroupId(t,false,true);t??=this.getUpdateGroupId();if(this.isApiGroup(t)){throw new Error("Illegal update group ID: "+t)}return o.then(function(o){return n.oRequestor.request("DELETE",o[0].slice(1)+s.buildQuery(n.mUriParameters),n.lockGroup(t,n,true,true),{"If-Match":o[1]}).catch(function(e){if(r||!(e.status===404||i&&e.status===412)){n.reportError("Failed to delete "+o[0],C,e);throw e}}).then(function(){if(i){n.aAllBindings.forEach(function(t){t.onDelete(e)})}})})};k.prototype.destroy=function(){this.oMetaModel.destroy();this.oRequestor.destroy();this.mHeaders=undefined;this.mMetadataHeaders=undefined;return M.prototype.destroy.apply(this,arguments)};k.prototype.destroyBindingContext=function(){throw new Error("Unsupported operation: v4.ODataModel#destroyBindingContext")};k.prototype.detachDataReceived=function(e,t){return this.detachEvent("dataReceived",e,t)};k.prototype.detachDataRequested=function(e,t){return this.detachEvent("dataRequested",e,t)};k.prototype.detachSessionTimeout=function(e,t){return this.detachEvent("sessionTimeout",e,t)};k.prototype.fetchKeyPredicate=function(e,t){var r={};return this.oRequestor.fetchType(r,e).then(function(){return s.getKeyPredicate(t,e,r)})};k.prototype.filterMatchingMessages=function(e,t){return s.hasPathPrefix(e,t)?this.mMessages[e]:[]};k.prototype.fireDataReceived=function(e,t){if(!(t in this.mPath2DataRequestedCount)){throw new Error("Received more data than requested")}this.mPath2DataRequestedCount[t]-=1;this.mPath2DataReceivedError[t]??=e;if(this.mPath2DataRequestedCount[t]===0){this.fireEvent("dataReceived",this.mPath2DataReceivedError[t]?{error:this.mPath2DataReceivedError[t],path:t}:{data:{},path:t});delete this.mPath2DataReceivedError[t];delete this.mPath2DataRequestedCount[t]}};k.prototype.fireDataRequested=function(e){if(e in this.mPath2DataRequestedCount){this.mPath2DataRequestedCount[e]+=1}else{this.mPath2DataRequestedCount[e]=1;this.fireEvent("dataRequested",{path:e})}};k.prototype.getAllBindings=function(){return this.aAllBindings.slice()};k.prototype.getContext=function(){throw new Error("Unsupported operation: v4.ODataModel#getContext")};k.prototype.getDependentBindings=function(e){return this.aAllBindings.filter(function(t){var r=t.getContext();return t.isRelative()&&(r===e||r&&r.getBinding&&r.getBinding()===e)})};k.prototype.getGroupId=function(){return this.sGroupId};k.prototype.getGroupProperty=function(e,t){switch(t){case"submit":if(e.startsWith("$auto.")){return o.Auto}if(e==="$single"){return"Single"}return this.mGroupProperties[e]?this.mGroupProperties[e].submit:o.API;default:throw new Error("Unsupported group property: '"+t+"'")}};k.prototype.getHttpHeaders=function(e){var t=Object.assign({},this.mHeaders);if(!e){delete t["SAP-ContextId"]}if(t["X-CSRF-Token"]===null){delete t["X-CSRF-Token"]}return t};k.prototype.getKeepAliveContext=function(e,t,r={}){var i,o,n;if(!this.bAutoExpandSelect){throw new Error("Missing parameter autoExpandSelect")}if(e[0]!=="/"){throw new Error("Not a list context path to an entity: "+e)}Object.keys(r).forEach(function(e){if(e.startsWith("sap-")&&!e.startsWith("sap-valid-")||e[0]==="$"&&!q.includes(e)){throw new Error("Invalid parameter: "+e)}});n=e.slice(0,s.getPredicateIndex(e));i=this.mKeepAliveBindingsByPath[n];if(!i){o=this.aAllBindings.filter(function(e){if(e.mParameters&&e.mParameters.$$getKeepAliveContext){e.removeCachesAndMessages(n.slice(1),true)}return e.isKeepAliveBindingFor&&e.isKeepAliveBindingFor(n)});if(o.length>1){throw new Error("Multiple bindings with $$getKeepAliveContext for: "+e)}i=o[0];if(!i){i=this.bindList(n,undefined,undefined,undefined,r);this.mKeepAliveBindingsByPath[n]=i}}return i.getKeepAliveContext(e,t,r.$$groupId)};k.prototype.getKeyPredicate=s.createGetMethod("fetchKeyPredicate",true);k.prototype.getMessages=function(e){return this.getMessagesByPath(e.getPath(),true).sort(v.compare)};k.prototype.getMetaModel=function(){return this.oMetaModel};k.prototype.getObject=function(){throw new Error("Unsupported operation: v4.ODataModel#getObject")};k.prototype.getODataVersion=function(){return this.sODataVersion};k.prototype.getOptimisticBatchEnabler=function(){return this.fnOptimisticBatchEnabler};k.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataModel#getOriginalProperty")};k.prototype.getProperty=function(){throw new Error("Unsupported operation: v4.ODataModel#getProperty")};k.prototype.getReporter=function(){var e=this;return function(t){if(!t.$reported){e.reportError(t.message,C,t)}}};k.prototype.getServiceUrl=function(){return this.sServiceUrl};k.prototype.getUpdateGroupId=function(){return this.sUpdateGroupId};k.prototype.hasPendingChanges=function(e){if(e!==undefined){this.checkBatchGroupId(e);if(this.isAutoGroup(e)&&this.oRequestor.hasPendingChanges("$parked."+e)){return true}}return this.oRequestor.hasPendingChanges(e)};k.prototype.initializeSecurityToken=function(){this.oRequestor.refreshSecurityToken().catch(function(){})};k.prototype.isApiGroup=function(e){return this.getGroupProperty(e,"submit")===o.API};k.prototype.isAutoGroup=function(e){return this.getGroupProperty(e,"submit")===o.Auto};k.prototype.isDirectGroup=function(e){return this.getGroupProperty(e,"submit")===o.Direct};k.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataModel#isList")};k.prototype.lock=function(e){var t;if(!this.isAutoGroup(e)){throw new Error("Group ID does not use automatic batch requests: "+e)}t=this.lockGroup(e,this,true);return{isLocked:function(){return t.isLocked()},unlock:function(){t.unlock()}}};k.prototype.lockGroup=function(e,t,r,i,o){return this.oRequestor.lockGroup(e,t,r,i,o)};k.prototype.normalizeMessageTarget=function(e){var t,r,i="",o=this;if(e.includes("$uid=")){return e}t=e.split("/").map(function(e){var t,n=e.indexOf("("),a,p,d;function h(e){if(e in p){return encodeURIComponent(decodeURIComponent(p[e]))}r=true}if(n<0){i=s.buildPath(i,e);return e}t=e.slice(0,n);i=s.buildPath(i,t);p=u.parseKeyPredicate(e.slice(n));if(""in p){return t+"("+h("")+")"}d=o.oMetaModel.getObject("/"+i+"/");if(!(d&&d.$Key)){r=true;return e}a=d.$Key.map(function(e){var t=h(e);return d.$Key.length>1?e+"="+t:t});return t+"("+a.join(",")+")"}).join("/");return r?e:t};k.prototype.refresh=function(e){if(typeof e==="boolean"){throw new Error("Unsupported parameter bForceUpdate")}s.checkGroupId(e);this.getBindings().forEach(function(t){if(t.isRoot()){t.refresh(t.isSuspended()?undefined:e)}})};k.prototype.releaseKeepAliveBinding=function(e){var t=this.mKeepAliveBindingsByPath[e];if(t){delete this.mKeepAliveBindingsByPath[e];return t}};k.prototype.reportError=function(e,t,r){var i;if(r.canceled==="noDebugLog"){return}i=r.stack.includes(r.message)?r.stack:r.message+"\n"+r.stack;if(r.canceled){h.debug(e,i,t);return}h.error(e,i,t);if(r.$reported){return}r.$reported=true;this.reportTransitionMessages(s.extractMessages(r),r.resourcePath)};k.prototype.reportStateMessages=function(e,t,r){var i="/"+e,o=[],n=[],a=this;Object.keys(t).forEach(function(r){t[r].forEach(function(t){o.push(a.createUI5Message(t,e,r))})});(r||[""]).forEach(function(e){var t=s.buildPath(i,e);Object.keys(a.mMessages).forEach(function(e){if(e===t||e.startsWith(t+"/")||e.startsWith(t+"(")){n=n.concat(a.mMessages[e].filter(function(e){return!e.persistent}))}})});if(o.length||n.length){l.updateMessages(n,o)}};k.prototype.reportTransitionMessages=function(e,t){var r;if(!e.length){return}if(t){const e=this.getMetaModel();t=t.split("?")[0];const i="/"+s.getMetaPath(t);const o=e.getObject(i);if(Array.isArray(o)){r=e.getObject(i+"/@$ui5.overload/0");t=t.slice(0,t.lastIndexOf("/"))}}l.updateMessages(undefined,e.map(e=>{const i=e;if(r){e=s.clone(e);s.adjustTargets(e,r)}e.transition=true;return this.createUI5Message(e,t,undefined,i)}))};k.prototype.requestCanonicalPath=function(e){d(e.getModel()===this,"oEntityContext must belong to this model");return e.requestCanonicalPath()};k.prototype.requestKeyPredicate=s.createRequestMethod("fetchKeyPredicate");k.prototype.requestSideEffects=function(e,t){if(!t.length){return undefined}return f.all(this.aAllBindings.filter(function(e){return e.isRoot()}).map(function(r){return r.requestAbsoluteSideEffects(e,t)}))};k.prototype.resetChanges=function(e){e??=this.sUpdateGroupId;this.checkBatchGroupId(e);if(this.isAutoGroup(e)){this.oRequestor.cancelChanges("$parked."+e);this.oRequestor.cancelChanges("$inactive."+e,true)}this.oRequestor.cancelChanges(e);this.aAllBindings.forEach(function(t){if(e===t.getUpdateGroupId()){t.resetInvalidDataState()}})};k.prototype.resolve=function(e,t){var r;if(e&&e[0]==="/"){r=e}else if(t){r=t.getPath();if(e){if(!r.endsWith("/")){r+="/"}r+=e}}if(r&&r!=="/"&&r[r.length-1]==="/"&&!r.includes("#")){r=r.slice(0,r.length-1)}return r};k.prototype.setAnnotationChangePromise=function(e){if(this.oAnnotationChangePromise){throw Error("Too late")}this.oAnnotationChangePromise=e};k.prototype.setHttpListener=function(e){this.fnHttpListener=e};k.prototype.setIgnoreETag=function(e){this.bIgnoreETag=e};k.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataModel#setLegacySyntax")};k.prototype.setOptimisticBatchEnabler=function(e){if(!this.bEarlyRequests){throw new Error("The earlyRequests model parameter is not set")}if(this.oRequestor.isBatchSent()){throw new Error("The setter is called after a non-optimistic batch is sent")}if(typeof e!=="function"){throw new Error("The given fnOptimisticBatchEnabler parameter is not a function")}if(this.fnOptimisticBatchEnabler){throw new Error("The setter is called more than once")}this.fnOptimisticBatchEnabler=e};k.prototype.submitBatch=function(e){var t=this;this.checkBatchGroupId(e);if(this.isAutoGroup(e)){this.oRequestor.relocateAll("$parked."+e,e)}this.oRequestor.addChangeSet(e);return new Promise(function(r){t.addPrerenderingTask(function(){r(t._submitBatch(e))})})};k.prototype.toString=function(){return C+": "+this.sServiceUrl};k.prototype.waitForKeepAliveBinding=function(e){if(e.mParameters?.$$getKeepAliveContext){const t=this.mKeepAliveBindingsByPath[e.getResolvedPath()];if(t){return t.oCachePromise}}return f.resolve()};k.prototype.withUnresolvedBindings=function(e,t){return this.aAllBindings.filter(function(e){return!e.isResolved()}).some(function(r){return r[e](t)})};k.cleanUpOptimisticBatch=function(e){return m.delWithFilters({olderThan:e,prefix:"sap.ui.model.odata.v4.optimisticBatch:"})};return k});
//# sourceMappingURL=ODataModel.js.map