/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_ConcatHelper","./_GroupLock","./_Helper","./_MinMaxHelper","./_TreeState","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/odata/ODataUtils"],function(e,t,n,i,o,r,s,a,l,d){"use strict";function u(i,r,a,d,u){var c=function(){},h=null,f,g=this;t.call(this,i,r,d,true);this.oAggregation=a;this.sDownloadUrl=t.prototype.getDownloadUrl.call(this,"");this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.oCountPromise=undefined;if(d.$count){if(a.hierarchyQualifier){this.oCountPromise=new l(function(e){f=e});this.oCountPromise.$resolve=f}else if(a.groupLevels.length){d.$$leaves=true;this.oCountPromise=new l(function(e){h=function(t){e(parseInt(t.UI5__leaves))}})}}this.oFirstLevel=this.createGroupLevelCache(null,u||!!h);this.addKeptElement=this.oFirstLevel.addKeptElement;this.removeKeptElement=this.oFirstLevel.removeKeptElement;this.requestSideEffects=this.oFirstLevel.requestSideEffects;this.oGrandTotalPromise=undefined;if(u){this.oGrandTotalPromise=new l(function(t){n.enhanceCache(g.oFirstLevel,a,[h,function(n){var i;if(a["grandTotal like 1.84"]){e.removeUI5grand__(n)}e.setAnnotations(n,true,true,0,e.getAllProperties(a));if(a.grandTotalAtBottomOnly===false){i=Object.assign({},n,{"@$ui5.node.isExpanded":undefined});o.setPrivateAnnotation(n,"copy",i);o.setPrivateAnnotation(i,"predicate","($isTotal=true)")}o.setPrivateAnnotation(n,"predicate","()");t(n)},c])})}else if(h){n.enhanceCache(g.oFirstLevel,a,[h,c])}this.oTreeState=new s(a.$NodeProperty,e=>o.getKeyFilter(e,this.sMetaPath,this.getTypes()));this.bUnifiedCache=this.oAggregation.expandTo>=Number.MAX_SAFE_INTEGER||!!this.oAggregation.createInPlace}u.prototype=Object.create(t.prototype);u.prototype.addTransientCollection=null;u.prototype._delete=function(e,n,i,r,s){let a=parseInt(i);if(isNaN(a)){throw new Error(`Unsupported kept-alive entity: ${this.sResourcePath}${i}`)}const d=this.aElements[a];const u=o.getPrivateAnnotation(d,"predicate");if(d["@$ui5.node.isExpanded"]){throw new Error(`Unsupported expanded node: ${this.sResourcePath}${u}`)}const c=o.getPrivateAnnotation(d,"parent");if(d["@$ui5.context.isTransient"]){return c._delete(e,n,o.getPrivateAnnotation(d,"transientPredicate"))}return l.resolve(this.oRequestor.request("DELETE",n,e,{"If-Match":d})).then(()=>{this.oTreeState.delete(d);a=t.getElementIndex(this.aElements,u,a);const e=c.removeElement(o.getPrivateAnnotation(d,"rank",0),u);const n=o.getPrivateAnnotation(d,"descendants",0);for(let t=0;t<n;t+=1){c.removeElement(e)}const i=n+1;if(c===this.oFirstLevel){this.adjustDescendantCount(d,a,-i)}else if(!c.getValue("$count")){this.makeLeaf(this.aElements[a-1])}this.shiftRank(a,-i);this.removeElement(a,u);s(a,-1)})};u.prototype.addElements=function(t,n,i,r){var s=this.aElements,a=this.oAggregation.hierarchyQualifier,d=this.oAggregation.$NodeProperty,u=this;function c(t,c){var h=s[n+c],f,g=o.getPrivateAnnotation(t,"predicate"),p=o.getPrivateAnnotation(t,"transientPredicate");if(h){if(h===t){return}e.beforeOverwritePlaceholder(h,t,i,r===undefined?undefined:r+c,d)}else if(n+c>=s.length){throw new Error("Array index out of bounds: "+(n+c))}f=s.$byPredicate[g];if(f&&f!==t&&!(f instanceof l)){if(!a){throw new Error("Duplicate predicate: "+g)}if(!f["@odata.etag"]||t["@odata.etag"]===f["@odata.etag"]){o.updateNonExisting(t,f)}else if(u.hasPendingChangesForPath(g)){throw new Error("Modified on client and on server: "+u.sResourcePath+g)}o.copySelected(f,t)}if(g){s.$byPredicate[g]=t}if(p){s.$byPredicate[p]=t}s[n+c]=t;if(i){o.setPrivateAnnotation(t,"parent",i)}if(p){r-=1}else{o.setPrivateAnnotation(t,"rank",r+c)}}if(n<0){throw new Error("Illegal offset: "+n)}if(Array.isArray(t)){t.forEach(c)}else{c(t,0)}};u.prototype.adjustDescendantCount=function(e,t,n){let i=e["@$ui5.node.level"];let r=false;for(let e=t-1;e>=0&&i>1;e-=1){const s=this.aElements[e];const a=s["@$ui5.node.level"];if(a===0){r=true}else if(a<i){if(!r||this.isAncestorOf(e,t)){const i=o.getPrivateAnnotation(s,"descendants",0)+n;o.setPrivateAnnotation(s,"descendants",i);if(i===0){this.makeLeaf(s)}t=e;r=false}i=a}}};u.prototype.beforeRequestSideEffects=function(e){if(!this.oAggregation.hierarchyQualifier){throw new Error("Missing recursive hierarchy")}delete e.$apply;if(!e.$select.includes(this.oAggregation.$NodeProperty)){e.$select.push(this.oAggregation.$NodeProperty)}};u.prototype.beforeUpdateSelected=function(t,n){e.checkNodeProperty(this.aElements.$byPredicate[t],n,this.oAggregation.$NodeProperty,true)};u.prototype.collapse=function(t){const n=this.getValue(t);const i=e.getCollapsedObject(n);o.updateAll(this.mChangeListeners,t,n,i);this.oTreeState.collapse(n);const r=this.aElements;const s=r.indexOf(n);let a=this.countDescendants(n,s);if(this.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(i).length>1){a+=1}for(let e=s+1;e<s+1+a;e+=1){if(!this.oAggregation.hierarchyQualifier||!r[e]["@$ui5.context.isSelected"]){delete r.$byPredicate[o.getPrivateAnnotation(r[e],"predicate")];delete r.$byPredicate[o.getPrivateAnnotation(r[e],"transientPredicate")]}}const l=r.splice(s+1,a);l.$level=n["@$ui5.node.level"];l.$rank=o.getPrivateAnnotation(n,"rank");o.setPrivateAnnotation(n,"spliced",l);r.$count-=a;return a};u.prototype.countDescendants=function(e,t){var n;const i=e["@$ui5.node.level"];const r=this.bUnifiedCache?Infinity:this.oAggregation.expandTo;let s=o.getPrivateAnnotation(e,"descendants");for(n=t+1;n<this.aElements.length;n+=1){const e=this.aElements[n];const t=e["@$ui5.node.level"];const a=t===0&&o.hasPrivateAnnotation(e,"placeholder");if(!a&&t<=i){break}if(t<=r&&o.hasPrivateAnnotation(e,"rank")){if(!s){break}s-=1;if(e["@$ui5.node.isExpanded"]===false){s-=o.getPrivateAnnotation(e,"descendants",0)}}}return n-(t+1)};u.prototype.create=function(e,t,n,i,r,s,a,l){if(s){throw new Error("Unsupported bAtEndOfCreated")}const d=r["@$ui5.node.parent"];delete r["@$ui5.node.parent"];const u=d?.slice(d.indexOf("("));const c=this.aElements;const h=c.$byPredicate[u];if(h?.["@$ui5.node.isExpanded"]===false){throw new Error("Unsupported collapsed parent: "+d)}const f=h?h["@$ui5.node.level"]+1:1;let g=f>this.oAggregation.expandTo&&!this.oAggregation.createInPlace?o.getPrivateAnnotation(h,"cache"):this.oFirstLevel;if(!g){g=this.createGroupLevelCache(h);g.setEmpty();o.setPrivateAnnotation(h,"cache",g)}o.addByPath(this.mPostRequests,i,r);const p=c.indexOf(h)+1;const P=g.create(e,t,n,i,r,s,a,l,()=>{o.removeByPath(this.mPostRequests,i,r);if(this.oAggregation.createInPlace){return}c.$count-=1;delete c.$byPredicate[i];c.splice(p,1)});if(d){o.getPrivateAnnotation(r,"postBody")[this.oAggregation.$ParentNavigationProperty+"@odata.bind"]=o.makeRelativeUrl("/"+d,"/"+this.sResourcePath)}const v=h&&h["@$ui5.node.isExpanded"]===undefined;const m=v&&h?.["@$ui5.node.level"]>=this.oAggregation.expandTo;if(m){this.oTreeState.expand(h)}const $=(e,t)=>{if(v){o.updateAll(this.mChangeListeners,u,h,{"@$ui5.node.isExpanded":true})}r["@$ui5.node.level"]=f;c.splice(e,0,null);this.addElements(r,e,g,t);c.$count+=1};const y=(e,t)=>{g.removeElement(0);o.deletePrivateAnnotation(r,"transientPredicate");delete c.$byPredicate[i];if(t!==undefined){this.adjustDescendantCount(r,e,+1);g.restoreElement(t,r);o.setPrivateAnnotation(r,"rank",t);this.shiftRank(e,+1)}};if(this.oAggregation.createInPlace){return P.then(async()=>{o.removeByPath(this.mPostRequests,i,r);delete r["@$ui5.context.isTransient"];const[t]=await Promise.all([this.requestRank(r,e),this.requestNodeProperty(r,e)]);if(m){o.setPrivateAnnotation(r,"rank",t)}else if(t===undefined){g.removeElement(0)}else{$(t,t);y(t,t)}return r})}$(p,undefined);return P.then(async()=>{o.removeByPath(this.mPostRequests,i,r);c.$byPredicate[o.getPrivateAnnotation(r,"predicate")]=r;r["@$ui5.node.level"]=f;this.oTreeState.setOutOfPlace(r,h);if(g===this.oFirstLevel&&this.oAggregation.expandTo>1){const[t]=await Promise.all([this.requestRank(r,e),this.requestNodeProperty(r,e,true)]);y(p,t)}else{await this.requestNodeProperty(r,e,true)}return r})};u.prototype.createGroupLevelCache=function(n,i){var r=this.oAggregation,s=n?n["@$ui5.node.level"]+1:1,a,l,d,c,h,f,g;if(r.hierarchyQualifier){f=Object.assign({},this.mQueryOptions)}else{a=e.getAllProperties(r);c=s>r.groupLevels.length;d=c?r.groupLevels.concat(Object.keys(r.group).sort()):r.groupLevels.slice(0,s);f=e.filterOrderby(this.mQueryOptions,r,s);g=!c&&Object.keys(r.aggregate).some(function(e){return r.aggregate[e].subtotals})}if(n){h=o.getPrivateAnnotation(n,"filter")||o.getKeyFilter(n,this.sMetaPath,this.getTypes());f.$$filterBeforeAggregate=h+(f.$$filterBeforeAggregate?" and ("+f.$$filterBeforeAggregate+")":"")}if(!i){delete f.$count;f=e.buildApply(r,f,s)}f.$count=true;l=t.create(this.oRequestor,this.sResourcePath,f,true);l.calculateKeyPredicate=r.hierarchyQualifier?u.calculateKeyPredicateRH.bind(null,n,r):u.calculateKeyPredicate.bind(null,n,d,a,c,g);if(h){l.$parentFilter=h}return l};u.prototype.expand=function(t,n,r,s){var a,d=typeof n==="string"?this.getValue(n):n,u=o.getPrivateAnnotation(d,"spliced"),c=this;if(n!==d){o.updateAll(this.mChangeListeners,n,d,e.getOrCreateExpandedObject(this.oAggregation,d));this.oTreeState.expand(d,r)}if(u){o.deletePrivateAnnotation(d,"spliced");const e=this.aElements;const t=e.indexOf(d)+1;this.aElements=e.concat(u,e.splice(t));this.aElements.$byPredicate=e.$byPredicate;a=u.length;this.aElements.$count=e.$count+a;const n=d["@$ui5.node.level"]-u.$level;const r=o.getPrivateAnnotation(d,"rank")-u.$rank;u.forEach(function(e){var t=o.getPrivateAnnotation(e,"predicate");if(e["@$ui5.node.level"]){e["@$ui5.node.level"]+=n}if(o.getPrivateAnnotation(e,"parent")===c.oFirstLevel){const t=o.getPrivateAnnotation(e,"rank");if(t!==undefined){o.setPrivateAnnotation(e,"rank",t+r)}}if(!o.hasPrivateAnnotation(e,"placeholder")){if(u.$stale&&!e["@$ui5.context.isSelected"]){c.turnIntoPlaceholder(e,t)}else{c.aElements.$byPredicate[t]=e;const n=o.getPrivateAnnotation(e,"transientPredicate");if(n){c.aElements.$byPredicate[n]=e}if(o.hasPrivateAnnotation(e,"expanding")){o.deletePrivateAnnotation(e,"expanding");a+=c.expand(i.$cached,e).getResult()}}}});return l.resolve(a)}if(this.bUnifiedCache||r>1){return l.resolve(-1)}let h=o.getPrivateAnnotation(d,"cache");if(!h){h=this.createGroupLevelCache(d);o.setPrivateAnnotation(d,"cache",h)}return h.read(0,this.iReadLength,0,t,s).then(function(t){var i=c.aElements.indexOf(d)+1,r=d["@$ui5.node.level"],s=e.getCollapsedObject(d),l=c.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(s).length>1,u;if(!d["@$ui5.node.isExpanded"]){o.deletePrivateAnnotation(d,"spliced");return 0}if(!i){o.setPrivateAnnotation(d,"expanding",true);return 0}a=t.value.$count;if(o.hasPrivateAnnotation(d,"groupLevelCount")&&o.getPrivateAnnotation(d,"groupLevelCount")!==a){throw new Error("Unexpected structural change: groupLevelCount")}o.setPrivateAnnotation(d,"groupLevelCount",a);o.updateAll(c.mChangeListeners,n,d,{"@$ui5.node.groupLevelCount":a});if(l){a+=1}if(i===c.aElements.length){c.aElements.length+=a}else{for(u=c.aElements.length-1;u>=i;u-=1){c.aElements[u+a]=c.aElements[u];delete c.aElements[u]}}c.addElements(t.value,i,h,0);for(u=i+t.value.length;u<i+t.value.$count;u+=1){c.aElements[u]=e.createPlaceholder(r+1,u-i,h)}if(l){s=Object.assign({},s);e.setAnnotations(s,undefined,true,r,e.getAllProperties(c.oAggregation));o.setPrivateAnnotation(s,"predicate",o.getPrivateAnnotation(d,"predicate").slice(0,-1)+",$isTotal=true)");c.addElements(s,i+a-1)}c.aElements.$count+=a;return a},function(t){o.updateAll(c.mChangeListeners,n,d,e.getCollapsedObject(d));c.oTreeState.collapse(d);throw t})};u.prototype.fetchParentIndex=function(e,t){const n=this.aElements[e]["@$ui5.node.level"];for(let t=e-1;t>=0;t-=1){const i=this.aElements[t]["@$ui5.node.level"];if(i===0){break}if(i===n){e=t}}const i=this.aElements[e];let r=o.getPrivateAnnotation(i,"parentIndexPromise");if(r){return r}const s=o.getKeyFilter(i,this.sMetaPath,this.getTypes());const a=Object.assign({},this.mQueryOptions);a.$apply="ancestors($root"+this.oAggregation.$path+","+this.oAggregation.hierarchyQualifier+","+this.oAggregation.$NodeProperty+",filter("+s+"),1)";const d=this.sResourcePath+this.oRequestor.buildQueryString(null,a);r=this.oRequestor.request("GET",d,t).then(async e=>{const n=e.value[0];const i=this.aElements.$byPredicate[o.getKeyPredicate(n,this.sMetaPath,this.getTypes())];if(i&&o.getPrivateAnnotation(i,"rank")!==undefined){return this.aElements.indexOf(i)}o.setPrivateAnnotation(n,"parent",this.oFirstLevel);const r=[this.oAggregation.$DistanceFromRoot,this.oAggregation.$DrillState,this.oAggregation.$LimitedDescendantCount];const[s]=await Promise.all([this.requestRank(n,t),this.requestProperties(n,r,t,true),this.requestNodeProperty(n,t,false)]);this.oFirstLevel.calculateKeyPredicate(n,this.getTypes(),this.sMetaPath);const a=this.findIndex(s);if(o.hasPrivateAnnotation(this.aElements[a],"placeholder")){this.insertNode(n,s,a)}return a}).finally(()=>{o.deletePrivateAnnotation(i,"parentIndexPromise")});r=l.resolve(r);o.setPrivateAnnotation(i,"parentIndexPromise",r);return r};u.prototype.fetchValue=function(e,t,n,i){var o=this;if(t==="$count"){if(this.oCountPromise){return this.oCountPromise}if(this.oAggregation.hierarchyQualifier||this.oAggregation.groupLevels.length){a.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return l.resolve()}return this.oFirstLevel.fetchValue(e,t,n,i)}return l.resolve(this.aElements.$byPredicate[t.split("/")[0]]).then(function(){o.registerChangeListener(t,i);return o.drillDown(o.aElements,t,e)})};u.prototype.findIndex=function(e,t=this.oFirstLevel){return this.aElements.findIndex(n=>o.getPrivateAnnotation(n,"rank")===e&&o.getPrivateAnnotation(n,"parent")===t)};u.prototype.get1stInPlaceChildIndex=function(e){const t=e>=0?this.aElements[e]["@$ui5.node.level"]+1:1;return this.aElements.findIndex((n,i)=>i>e&&n["@$ui5.node.level"]===t&&n["@$ui5.context.isTransient"]===undefined)};u.prototype.getAllElements=function(e){var t;if(e){throw new Error("Unsupported path: "+e)}t=this.aElements.map(function(e){return o.hasPrivateAnnotation(e,"placeholder")?undefined:e});t.$count=this.aElements.$count;return t};u.prototype.getCreatedElements=function(e){return[]};u.prototype.getDownloadQueryOptions=function(t){if(this.oAggregation.hierarchyQualifier){if("$count"in t){t=Object.assign({},t);delete t.$count}}else{t=e.filterOrderby(t,this.oAggregation)}return e.buildApply(this.oAggregation,t,0,true)};u.prototype.getDownloadUrl=function(e,t){return this.sDownloadUrl};u.prototype.getInsertIndex=function(e){var t;for(t=0;t<this.aElements.length;t+=1){const n=this.aElements[t];if(o.getPrivateAnnotation(n,"rank")>e&&!this.oTreeState.isOutOfPlace(o.getPrivateAnnotation(n,"predicate"))){return t}}return t};u.prototype.getParentIndex=function(e){const t=this.aElements[e]["@$ui5.node.level"];if(t<=1){return-1}let n=false;for(let i=e;i>=0;i-=1){const o=this.aElements[i];const r=o["@$ui5.node.level"];if(r===0){n=true}else if(r<t){if(r===t-1&&(!n||this.isAncestorOf(i,e))){return i}break}}};u.prototype.getSiblingIndex=function(t,n,i){const r=this.aElements[t];const s=o.getPrivateAnnotation(r,"parent");const a=s!==this.oFirstLevel||this.oAggregation.expandTo===1&&!this.oAggregation.$ExpandLevels;const l=o.getPrivateAnnotation(r,"rank");let d=l+n;if(n<0){if(!a){d=e.findPreviousSiblingIndex(s.aElements,l)}if(d<0){return-1}}else{d+=o.getPrivateAnnotation(r,"descendants",0);if(d>=s.aElements.$count||s.aElements[d]?.["@$ui5.node.level"]<r["@$ui5.node.level"]){return-1}}if(d>=0){const e=this.findIndex(d,s);if(e<0){return-1}const t=this.aElements[e];if(a&&i||!o.hasPrivateAnnotation(t,"placeholder")){if(t["@$ui5.context.isTransient"]!==undefined){return this.getSiblingIndex(e,n,i)}return e}}};u.prototype.getValue=function(e){var t;t=this.fetchValue(i.$cached,e);if(t.isFulfilled()){return t.getResult()}t.caught()};u.prototype.handleOutOfPlaceNodes=function([e,...t]){if(!e){return}const n=e=>o.getKeyPredicate(e,this.sMetaPath,this.getTypes());const i=e=>parseInt(o.drillDown(e,this.oAggregation.$LimitedRank));const r={};e.value.forEach(e=>{r[n(e)]=e});const s=new Set(this.oTreeState.getOutOfPlacePredicates());t.forEach(e=>{e.value.forEach(e=>{const t=n(e);s.delete(t);if(this.aElements.$byPredicate[t]){return}const a=this.oTreeState.getOutOfPlace(t).parentPredicate;const l=r[a];if(l){const e=o.drillDown(l,this.oAggregation.$DrillState);if(e==="collapsed"){return}}else if(a){return}o.merge(e,r[t]);this.oFirstLevel.calculateKeyPredicate(e,this.getTypes(),this.sMetaPath);const d=i(e);o.deleteProperty(e,this.oAggregation.$LimitedRank);this.insertNode(e,d)})});s.forEach(e=>this.oTreeState.deleteOutOfPlace(e));this.oTreeState.getOutOfPlaceGroupedByParent().forEach(e=>{const t=r[e.parentPredicate];this.moveOutOfPlaceNodes(t&&i(t),e.nodePredicates)})};u.prototype.insertNode=function(e,t,n=t){this.addElements(e,n,this.oFirstLevel,t);this.oFirstLevel.removeElement(t);this.oFirstLevel.restoreElement(t,e)};u.prototype.isAncestorOf=function(e,t){if(t===e){return true}if(t<e||!this.aElements[e]["@$ui5.node.isExpanded"]||this.aElements[e]["@$ui5.node.level"]>=this.aElements[t]["@$ui5.node.level"]){return false}return t<=e+this.countDescendants(this.aElements[e],e)};u.prototype.isDeletingInOtherGroup=function(e){return false};u.prototype.isRefreshNeededAfterCreate=function(e){const t=this.aElements[e];return this.oAggregation.createInPlace&&t["@$ui5.node.isExpanded"]===undefined&&t["@$ui5.node.level"]>=this.oAggregation.expandTo};u.prototype.keepOnlyGivenElements=function(t){var n={},i=this;t.forEach(function(e){n[e]=true});return Object.values(this.aElements.$byPredicate).filter(function(t){var r=o.getPrivateAnnotation(t,"predicate");if(!r){return}if(n[r]){e.markSplicedStale(t);n[r]=false;return true}if(!(r in n)){i.turnIntoPlaceholder(t,r)}})};u.prototype.makeLeaf=function(e){o.updateAll(this.mChangeListeners,o.getPrivateAnnotation(e,"predicate"),e,{"@$ui5.node.isExpanded":undefined});delete e["@$ui5.node.isExpanded"];o.deletePrivateAnnotation(e,"descendants")};u.prototype.move=function(e,t,n,r,s,a){let d=!this.bUnifiedCache;const u=t.slice(t.indexOf("("));const c=this.aElements.$byPredicate[u];if(this.oTreeState.isOutOfPlace(u)){this.oTreeState.deleteOutOfPlace(u);delete c["@$ui5.context.isTransient"];d=true}const h=n?.slice(n.indexOf("("));const f=this.aElements.$byPredicate[h];if(this.oTreeState.isOutOfPlace(h)){this.oTreeState.deleteOutOfPlace(h,true);d=true}if(f?.["@$ui5.node.isExpanded"]===false||f?.["@$ui5.node.level"]>=this.oAggregation.expandTo&&!f["@$ui5.node.isExpanded"]){this.oTreeState.expand(f);if(!o.hasPrivateAnnotation(f,"spliced")){d=true}}let g;const p=()=>{if(r!==undefined){d=true;const t=s+"/"+this.oAggregation.$Actions.ChangeNextSiblingAction;const n=r?.slice(r.indexOf("("));g=this.aElements.$byPredicate[n];let i=null;if(g){this.oTreeState.deleteOutOfPlace(n);const e=this.oAggregation.$fetchMetadata(o.getMetaPath("/"+t+"/NextSibling/")).getResult();const r=Object.keys(e).filter(e=>e[0]!=="$");i=r.reduce((e,t)=>{e[t]=g[t];return e},{})}return this.oRequestor.request("POST",t,e.getUnlockedCopy(),{"If-Match":c,Prefer:"return=minimal"},{NextSibling:i})}};let P=l.all([this.oRequestor.request("PATCH",t,e,{"If-Match":c,Prefer:"return=minimal"},{[this.oAggregation.$ParentNavigationProperty+"@odata.bind"]:n},null,function e(){}),p(),this.requestRank(c,e,d),a&&this.requestRank(g,e,true)]);if(d){P=P.then(([,,e,t])=>()=>[e===undefined?undefined:this.findIndex(e),a&&this.findIndex(t)])}else{P=P.then(([e,,t])=>{const n=c["@$ui5.node.isExpanded"]?this.collapse(u):undefined;let r=1;switch(f?f["@$ui5.node.isExpanded"]:true){case false:r=this.expand(i.$cached,h).unwrap()+1;case true:break;default:o.updateAll(this.mChangeListeners,h,f,{"@$ui5.node.isExpanded":true})}const s=this.aElements.indexOf(c);const a=o.getPrivateAnnotation(c,"descendants",0)+1;this.adjustDescendantCount(c,s,-a);this.aElements.splice(s,1);const l=o.getPrivateAnnotation(c,"rank");this.shiftRankForMove(l,a,t);this.oFirstLevel.move(l,t,a);o.updateExisting(this.mChangeListeners,u,c,{"@odata.etag":e["@odata.etag"],"@$ui5.context.isTransient":undefined,"@$ui5.node.level":f?f["@$ui5.node.level"]+1:1});o.setPrivateAnnotation(c,"rank",t);const d=this.getInsertIndex(t);this.aElements.splice(d,0,c);this.adjustDescendantCount(c,d,+a);return[r,d,n]})}return{promise:P,refresh:d}};u.prototype.moveOutOfPlaceNodes=function(e,t){const n=e===undefined?-1:this.findIndex(e);t.forEach(e=>{const t=this.aElements.$byPredicate[e];if(t){const o=t["@$ui5.node.isExpanded"];if(o){this.collapse(e)}const r=this.aElements.indexOf(t);this.aElements.splice(r,1);this.aElements.splice(n+1,0,t);if(o){this.expand(i.$cached,e)}}})};u.prototype.read=function(e,t,n,i,r){var s,a=e,u=t,c,h,f=this.oGrandTotalPromise&&this.oAggregation.grandTotalAtBottomOnly!==true,g=[],p,P=this;function v(e,t){g.push(P.readGap(c,e,t,i.getUnlockedCopy(),r))}if(f&&!e&&t===1){if(n!==0){throw new Error("Unsupported prefetch length: "+n)}i.unlock();return this.oGrandTotalPromise.then(function(e){return{value:[e]}})}if(this.aElements.$count===undefined){this.iReadLength=t+n;if(f){if(a){a-=1}else{u-=1}}g.push(this.readCount(i),this.readFirst(a,u,n,i,r))}else{const r=d._getReadRange(this.aElements,e,t,n,e=>{switch(o.getPrivateAnnotation(e,"placeholder")){case true:return o.getPrivateAnnotation(e,"parent").isMissing(o.getPrivateAnnotation(e,"rank"));case 1:return!(this.aElements.$byPredicate[o.getPrivateAnnotation(e,"predicate")]instanceof l);default:return false}});const a=Math.min(r.start+r.length,this.aElements.length);for(p=r.start;p<a;p+=1){const e=this.aElements[p];s=o.hasPrivateAnnotation(e,"placeholder")?o.getPrivateAnnotation(e,"parent"):undefined;if(s!==c){if(h!==undefined){v(h,p);c=h=undefined}if(s){h=p;c=s}}else if(h!==undefined&&o.getPrivateAnnotation(e,"rank")!==o.getPrivateAnnotation(this.aElements[p-1],"rank")+1){v(h,p);h=p}}if(h!==undefined){v(h,p)}i.unlock()}return l.all(g).then(function(){var n=P.aElements.slice(e,e+t).map(function(e){return o.hasPrivateAnnotation(e,"placeholder")?undefined:e});n.$count=P.aElements.$count;return{value:n}})};u.prototype.readCount=function(e){var t,n=this.oCountPromise&&this.oCountPromise.$resolve,i;if(n){delete this.oCountPromise.$resolve;t=Object.assign({},this.mQueryOptions);delete t.$apply;delete t.$count;delete t.$expand;delete t.$orderby;if(this.oAggregation.search){t.$search=this.oAggregation.search}delete t.$select;i=this.sResourcePath+"/$count"+this.oRequestor.buildQueryString(null,t);return this.oRequestor.request("GET",i,e.getUnlockedCopy()).then(n)}};u.prototype.readFirst=function(t,n,i,r,s){var a=this;n+=i;i=Math.max(i,this.oTreeState.getOutOfPlaceCount());if(t>i){n+=i;t-=i}else{n+=t;t=0}const d=this.oFirstLevel.bSentRequest;return l.all([this.oFirstLevel.read(t,n,0,r,s),...d?[]:this.requestOutOfPlaceNodes(r)]).then(function([n,...i]){var r,s,l=0,d;a.aElements.length=a.aElements.$count=n.value.$count;if(a.oGrandTotalPromise){a.aElements.$count+=1;a.aElements.length+=1;r=a.oGrandTotalPromise.getResult();switch(a.oAggregation.grandTotalAtBottomOnly){case false:l=1;a.aElements.$count+=1;a.aElements.length+=1;a.addElements(r,0);s=o.getPrivateAnnotation(r,"copy");a.addElements(s,a.aElements.length-1);break;case true:a.addElements(r,a.aElements.length-1);break;default:l=1;a.addElements(r,0)}}a.addElements(n.value,t+l,a.oFirstLevel,t);for(d=0;d<a.aElements.$count;d+=1){a.aElements[d]??=e.createPlaceholder(a.oAggregation.expandTo>1||a.bUnifiedCache?0:1,d-l,a.oFirstLevel)}a.handleOutOfPlaceNodes(i)})};u.prototype.readGap=function(e,t,n,i,r){const s=this.aElements[t];const a=o.getPrivateAnnotation(s,"rank");if(a===undefined){if(n-t!==1){throw new Error("Not just a single created persisted")}const a=o.getPrivateAnnotation(s,"predicate");const l=e.refreshSingle(i,"",-1,a,true,false,r).then(n=>{o.inheritPathValue(this.oAggregation.$NodeProperty.split("/"),s,n,true);this.addElements(n,t,e)});this.aElements.$byPredicate[a]=l;return l}const l=e.getQueryOptions();if(l.$count){delete l.$count;e.setQueryOptions(l,true)}const d=e.read(a,n-t,0,i,r,true).then(n=>{var i=false,o;if(s!==this.aElements[t]&&n.value[0]!==this.aElements[t]){i=true;t=this.aElements.indexOf(s);if(t<0){t=this.aElements.indexOf(n.value[0]);if(t<0){o=new Error("Collapse before read has finished");o.canceled=true;throw o}}}this.addElements(n.value,t,e,a);if(i){o=new Error("Collapse or expand before read has finished");o.canceled=true;throw o}});if(d.isPending()){for(let e=t;e<n;e+=1){const t=o.getPrivateAnnotation(this.aElements[e],"predicate");if(t){this.aElements.$byPredicate[t]=d}}}return d};u.prototype.refreshKeptElements=function(e,t,n,i){const o=this.oFirstLevel.refreshKeptElements;return o.call(this,e,t,n,true)};u.prototype.requestNodeProperty=async function(e,t,n){if(o.drillDown(e,this.oAggregation.$NodeProperty)!==undefined){return}await this.requestProperties(e,[this.oAggregation.$NodeProperty],t,true,n)};u.prototype.requestOutOfPlaceNodes=function(t){const n=this.oTreeState.getOutOfPlaceGroupedByParent();if(!n.length){return[]}const i=[];const o=e=>{const n=this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,e,false,true);i.push(this.oRequestor.request("GET",n,t.getUnlockedCopy()))};let r=e.getQueryOptionsForOutOfPlaceNodesRank(n,this.oAggregation,this.oFirstLevel.getQueryOptions());o(r);n.forEach(t=>{r=e.getQueryOptionsForOutOfPlaceNodesData(t,this.oAggregation,this.mQueryOptions);o(r)});return i};u.prototype.requestProperties=async function(t,n,i,r,s,a){function l(e){e={...e};delete e.$count;delete e.$expand;delete e.$select;return e}let d;if(a){const t={...this.oAggregation,$ExpandLevels:this.oTreeState.getExpandLevels()};d=l(e.buildApply4Hierarchy(t,this.mQueryOptions))}else{const n=o.getPrivateAnnotation(t,"parent",this.oFirstLevel);d=s?e.dropFilter(this.oAggregation,this.mQueryOptions,n.$parentFilter):l(n.getQueryOptions())}d.$filter=o.getKeyFilter(t,this.sMetaPath,this.getTypes());const u=this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,d,false,true);const c=await this.oRequestor.request("GET",u,i.getUnlockedCopy(),undefined,undefined,undefined,undefined,this.sMetaPath,undefined,false,{$select:n},this);const h=c.value[0];if(r&&h){n.forEach(e=>{o.inheritPathValue(e.split("/"),h,t,true)})}else{return h}};u.prototype.requestRank=async function(e,t,n){const i=await this.requestProperties(e,[this.oAggregation.$LimitedRank],t,false,false,n);return i&&parseInt(o.drillDown(i,this.oAggregation.$LimitedRank))};u.prototype.requestSiblingIndex=async function(e,t,n){const i=this.getSiblingIndex(e,t,true);if(i!==undefined){return i}const r=this.aElements[e];const s={...this.oFirstLevel.mQueryOptions,$filter:this.oAggregation.$LimitedRank+(t<0?" lt ":" gt ")+o.getPrivateAnnotation(r,"rank")+" and "+this.oAggregation.$DistanceFromRoot+" lt "+r["@$ui5.node.level"],$top:1};if(t<0){s.$orderby=this.oAggregation.$LimitedRank+" desc"}s.$select=[...s.$select,this.oAggregation.$LimitedRank];delete s.$count;const a=this.sResourcePath+this.oRequestor.buildQueryString("",s,false,true,true);const l=await this.oRequestor.request("GET",a,n);const d=l.value[0];this.oFirstLevel.calculateKeyPredicate(d,this.getTypes(),this.sMetaPath);const u=parseInt(o.drillDown(d,this.oAggregation.$LimitedRank));o.deleteProperty(d,this.oAggregation.$LimitedRank);if(o.hasPrivateAnnotation(this.aElements[u],"placeholder")){this.insertNode(d,u)}return d["@$ui5.node.level"]===r["@$ui5.node.level"]?u:-1};u.prototype.reset=function(e,n,i,r,s){var a,d=this;if(s){throw new Error("Unsupported grouping via sorter")}e.forEach(function(e){var t=d.aElements.$byPredicate[e];if(o.hasPrivateAnnotation(t,"placeholder")){throw new Error("Unexpected placeholder")}delete t["@$ui5.node.isExpanded"];delete t["@$ui5.node.level"];delete t["@$ui5._"];o.setPrivateAnnotation(t,"predicate",e)});this.oAggregation=r;const u=this.oFirstLevel.reset;u.call(this,e,n,i);this.sDownloadUrl=t.prototype.getDownloadUrl.call(this,"");if(n){this.oBackup.oCountPromise=this.oCountPromise;this.oBackup.oFirstLevel=this.oFirstLevel;this.oBackup.bUnifiedCache=this.bUnifiedCache;this.bUnifiedCache=true}else{this.oTreeState.reset()}this.oAggregation.$ExpandLevels=this.oTreeState.getExpandLevels();this.oCountPromise=undefined;if(i.$count){this.oCountPromise=new l(function(e){a=e});this.oCountPromise.$resolve=a}this.oFirstLevel=this.createGroupLevelCache()};u.prototype.resetOutOfPlace=function(){this.oTreeState.resetOutOfPlace()};u.prototype.restore=function(e){if(e){this.oCountPromise=this.oBackup.oCountPromise;this.oFirstLevel=this.oBackup.oFirstLevel;this.bUnifiedCache=this.oBackup.bUnifiedCache}const t=this.oFirstLevel.restore;t.call(this,e)};u.prototype.shiftRank=function(e,t){const n=this.aElements[e];const i=o.getPrivateAnnotation(n,"rank");if(i===undefined){return}const r=o.getPrivateAnnotation(n,"parent");if(r===this.oFirstLevel){e=-1}for(let s=e+1;s<this.aElements.length;s+=1){const e=this.aElements[s];if(e===n){continue}if(o.getPrivateAnnotation(e,"parent")===r){const n=o.getPrivateAnnotation(e,"rank");if(n>=i){o.setPrivateAnnotation(e,"rank",n+t)}}if(r!==this.oFirstLevel&&e["@$ui5.node.level"]<n["@$ui5.node.level"]){break}}};u.prototype.shiftRankForMove=function(e,t,n){if(e<n){this.aElements.forEach(i=>{const r=o.getPrivateAnnotation(i,"rank");if(e+t<=r&&r<n+t){o.setPrivateAnnotation(i,"rank",r-t)}})}else if(n<e){this.aElements.forEach(i=>{const r=o.getPrivateAnnotation(i,"rank");if(n<=r&&r<e){o.setPrivateAnnotation(i,"rank",r+t)}})}};u.prototype.toString=function(){return this.sDownloadUrl};u.prototype.turnIntoPlaceholder=function(t,n){if(o.hasPrivateAnnotation(t,"placeholder")){return}o.setPrivateAnnotation(t,"placeholder",1);e.markSplicedStale(t);delete this.aElements.$byPredicate[n];const i=o.getPrivateAnnotation(t,"rank");if(i!==undefined){o.getPrivateAnnotation(t,"parent").drop(i,n,true)}};u.calculateKeyPredicate=function(t,n,i,r,s,a,l,d){var u;if(!(d in l)){return undefined}if(t){i.forEach(function(e){if(Array.isArray(e)){o.inheritPathValue(e,t,a)}else if(!(e in a)){a[e]=t[e]}})}u=r&&o.getKeyPredicate(a,d,l)||o.getKeyPredicate(a,d,l,n,true);o.setPrivateAnnotation(a,"predicate",u);if(!r){o.setPrivateAnnotation(a,"filter",o.getKeyFilter(a,d,l,n))}e.setAnnotations(a,r?undefined:false,s,t?t["@$ui5.node.level"]+1:1,t?null:i);return u};u.calculateKeyPredicateRH=function(t,n,i,r,s){var a,l,d=1,u,c;if(!(s in r)){return undefined}c=o.getKeyPredicate(i,s,r);o.setPrivateAnnotation(i,"predicate",c);if(s!==n.$metaPath){return c}switch(o.drillDown(i,n.$DrillState)){case"expanded":l=true;break;case"collapsed":l=false;break;default:}o.deleteProperty(i,n.$DrillState);if(t){d=t["@$ui5.node.level"]+1}else{a=o.drillDown(i,n.$DistanceFromRoot);if(a){o.deleteProperty(i,n.$DistanceFromRoot);d=parseInt(a)+1}}e.setAnnotations(i,l,undefined,d);if(n.$LimitedDescendantCount){u=o.drillDown(i,n.$LimitedDescendantCount);if(u){o.deleteProperty(i,n.$LimitedDescendantCount);if(u!=="0"){o.setPrivateAnnotation(i,"descendants",parseInt(u))}}}return c};u.create=function(n,i,o,s,a,l,d,c){var h,f;function g(){if("$expand"in s){throw new Error("Unsupported system query option: $expand")}if("$select"in s){throw new Error("Unsupported system query option: $select")}}if(a){h=e.hasGrandTotal(a.aggregate);f=a.groupLevels&&!!a.groupLevels.length;if(e.hasMinOrMax(a.aggregate)){if(h){throw new Error("Unsupported grand totals together with min/max")}if(f){throw new Error("Unsupported group levels together with min/max")}if(a.hierarchyQualifier){throw new Error("Unsupported recursive hierarchy together with min/max")}if(d){throw new Error("Unsupported $$sharedRequest together with min/max")}g();return r.createCache(n,i,a,s)}if(s.$filter&&(h&&!a["grandTotal like 1.84"]||f)){throw new Error("Unsupported system query option: $filter")}if(h||f||a.hierarchyQualifier){if(s.$search){throw new Error("Unsupported system query option: $search")}if(!a.hierarchyQualifier){g()}if(c){throw new Error("Unsupported grouping via sorter")}if(d){throw new Error("Unsupported $$sharedRequest")}return new u(n,i,a,s,h)}}if(s.$$filterBeforeAggregate){s.$apply="filter("+s.$$filterBeforeAggregate+")/"+s.$apply;delete s.$$filterBeforeAggregate}return t.create(n,i,s,l,o,d)};return u},false);
//# sourceMappingURL=_AggregationCache.js.map