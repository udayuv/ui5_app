/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/i18n/Formatting","sap/base/i18n/Localization","sap/ui/core/Element","sap/ui/core/Theming","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/calendar/Month","sap/ui/core/IconPool","./PlanningCalendarLegend","sap/ui/core/InvisibleText","sap/ui/unified/library","sap/ui/core/date/UI5Date"],function(e,t,a,n,l,i,s,o,r,d,p,c){"use strict";var g=p.CalendarDayType;var f={apiVersion:2};f.render=function(e,t){var a=t._getCoreLocaleData();var n=t._getDensitySizes();e.openStart("div",t);e.class("sapMSinglePCGrid");e.class("sapMSPCMonthGrid");e.openEnd();this.renderDayNames(e,t,a);e.openStart("div");e.class("sapMSinglePCGridContent");e.openEnd();this.renderCells(e,t,a,n);e.close("div");e.close("div")};f.renderCells=function(e,t,a,n){var l=t._getCells(),i=t._getVerticalLabels(),s=t._getColumns(),o=[],r=[],d,p,c,g,f=[],u,v,D,S;for(D=0;D<t._getRows();D++){v=0;e.openStart("div");e.attr("role","grid");e.class("sapMSPCMonthWeek");e.openEnd();e.openStart("div");e.class("sapMSPCMonthWeekNumber");e.openEnd();e.text(i[D]);e.close("div");for(S=0;S<s;S++){d=D*s+S;p=l[d];c=t._getAppointmetsForADay(p);g=t._getPreviousAppointmetsForADay(p);f.push(g);u=t._aMoreCountPerDay[d];o.push(u);r.push(c);v=Math.max(v,t._aAppsLevelsPerDay[d].length)}e.openStart("div");e.class("sapMSPCMonthDays");e.class("sapMSPCMonthDaysMax"+v);e.attr("role","row");e.openEnd();for(S=0;S<s;S++){d=D*s+S;p=l[d];this.renderDay(e,t,p,a,o[d],d)}e.openStart("div");e.class("sapMSinglePCBlockers");e.class("sapUiCalendarRowVisFilled");e.attr("role","list");e.openEnd();for(S=0;S<s;S++){d=D*s+S;p=l[d];if(S===0){this.renderAppointments(e,t,f[d],S,o[d],n,D,p,l)}this.renderAppointments(e,t,r[d],S,o[d],n,D,p,l)}e.close("div");e.close("div");e.close("div")}};f.renderDay=function(e,t,n,i,o,d){var p=t._getSpecialDates(),g=s.prototype._getDateTypes.call(t,n),f=t._getDateFormatter(),u=n.isSame(l.fromLocalJSDate(c.getInstance())),v,D,S;e.openStart("div");e.class("sapMSPCMonthDay");if(t._checkDateSelected(n)){e.class("sapMSPCMonthDaySelected")}if(u){e.class("sapMSPCMonthDayToday")}e.attr("role","gridcell");if(t._isNonWorkingDay(n)){e.class("nonWorkingTimeframe")}if(p){if(g&&g[0]){v=g[0];e.class("sapUiCalendarSpecialDay"+v.type);D=r.findLegendItemForItem(a.getElementById(t._sLegendId),v)}}e.attr("sap-ui-date",n.valueOf().toString());e.attr("tabindex",-1);e.attr("aria-labelledby",f.format(n.toLocalJSDate())+"-Descr");e.openEnd();this.renderDndPlaceholder(e,t.getAggregation("_appsPlaceholders")[d]);if(u){e.openStart("div");e.class("sapMSPCMonthNowMarker");e.openEnd()}e.openStart("div");e.class("specialDateIndicator");if(g[0]?.color){e.style("background-color",g[0].color)}e.openEnd();e.close("div");e.openStart("div");e.class("sapMSPCMonthDayNumber");e.openEnd();e.text(n.getDate());e.close("div");if(o){S=f.format(n.toLocalJSDate())+"-MoreLinkDesc";e.openStart("div");e.class("sapMSPCMonthLnkMore");e.openEnd();e.renderControl(t._getMoreLink(o,n,d,S));e.openStart("span",S);e.class("sapUiInvisibleText");e.openEnd();e.text(t._getMoreLinkDescription(o,n.toLocalJSDate()));e.close("span");e.close("div")}e.openStart("span",f.format(n.toLocalJSDate())+"-Descr");e.class("sapUiInvisibleText");e.openEnd();e.text(t._getCellStartInfo(n.toLocalJSDate()));if(t._sLegendId&&D){e.text(D)}e.close("span");if(u){e.close("div")}e.close("div")};f.renderAppointments=function(e,t,a,n,l,i,s,o,r){var d=t._getMaxAppointments(),p=l?d-2:d-1,c=t._getColumns(),g,f,u;for(var v=0;v<a.length;v++){f=a[v];g=t._getRowEndIndex(r,r.indexOf(o),c);if(f.level<=p){u=f._nextDay>g;if(f._nextDay===undefined||u){continue}this.renderAppointment(e,t,f,n,i,s,o)}else if(f._overflows){f.level=f._nextDayLevel;if(f._nextDay&&f._nextDayLevel<t._getMaxAppointments()-1){this.renderAppointment(e,t,f,f._nextDay,i,s,o)}}}};f.renderAppointment=function(e,a,i,s,o,r,p){var f=i.data,u=i.width,v=i.level,D=a._getCells(),S=a._getColumns(),_=f.getTooltip_AsString(),y=f.getType(),C=f.getColor(),m=f.getTitle(),h=f.getText(),A=f.getIcon(),b=f.getId(),M=f.getStartDate(),I=f.getEndDate(),E=f.getCustomContent(),x=!!E.length,P=!I||a._isAllDayAppointment(M,I),T=P?d.getStaticId("sap.ui.unified","CALENDAR_ALL_DAY_PREFIX"):d.getStaticId("sap.ui.unified","APPOINTMENT"),L=f.getParent().getEnableAppointmentsDragAndDrop(),U=p&&p.isSame(l.fromLocalJSDate(c.getInstance())),w={role:"listitem",labelledby:{value:T,append:true},selected:null},N=S-s-u,k=t.getRTL(),O=n.getTheme(),R=a._findStartDateIndex(D,i,a._iStartDayOffset),W=i._nextDay>R,F=D[i._nextDay],J=a._getDateColumn(D,F,S),H=a._getDateRow(D,F,S),V=H===r,z,B,G,X,Y;if(i._overflows||V){if(!i._partRendered){i._partRendered=true;W=i._nextDay>R;s=J;N=S-J+1-u;Y=l.fromLocalJSDate(I);G=a._getDateColumn(D,Y,S);if(N>0||X){N=S-G-1;if(G<s||X){N=0}}}}if(i._overflows){v=i.level}if(O.includes("horizon")){if(U){B=O.indexOf("_hc")?.4375:.0625}else{B=O.indexOf("_hc")?.1875:.0625}}else{if(U){B=O.indexOf("_hc")?.3125:.0625}else{B=O.indexOf("_hc")?.125:.0625}}N=N<0?0:N;if(!x&&m){w["labelledby"].value=w["labelledby"].value+" "+b+"-"+s+"_"+r+"-Title"}w["labelledby"].value=w["labelledby"].value+" "+b+"-"+s+"_"+r+"-Descr";if(!x&&h){w["labelledby"].value=w["labelledby"].value+" "+b+"-"+s+"_"+r+"-Text"}if(f.getTentative()){w["labelledby"].value=w["labelledby"].value+" "+d.getStaticId("sap.ui.unified","APPOINTMENT_TENTATIVE")}if(f.getSelected()){w["describedby"]={value:d.getStaticId("sap.ui.unified","APPOINTMENT_SELECTED"),append:true}}e.openStart("div",f.getId()+"-"+s+"_"+r);e.attr("draggable",L);e.attr("data-sap-ui-draggable",L);e.attr("data-sap-ui-related",f.getId());e.attr("data-sap-level",v);e.attr("data-sap-width",u);e.attr("tabindex",0);if(_){e.attr("title",_)}e.accessibilityState(f,w);e.class("sapMSinglePCAppointmentWrap");e.class("sapUiCalendarRowApps");if(!C&&y!==g.None){e.class("sapUiCalendarApp"+y)}if(C){if(t.getRTL()){e.style("border-right-color",C)}else{e.style("border-left-color",C)}}e.style(k?"right":"left","calc("+s*100/S+"% + "+B+"rem)");e.style(k?"left":"right","calc("+N*100/S+"% + "+B+"rem)");e.style("top",v*o.appHeight+o.cellHeaderHeight+"rem");e.openEnd();e.openStart("div");e.class("sapUiCalendarApp");if(f.getSelected()){e.class("sapUiCalendarAppSel")}if(f.getTentative()){e.class("sapUiCalendarAppTent")}if(A){e.class("sapUiCalendarAppWithIcon")}e.openEnd();e.openStart("div");e.class("sapUiCalendarAppCont");if(C&&!f.getSelected()){e.style("background-color",f._getCSSColorForBackground(C))}e.openEnd();if(i.hasPrevious<0||i._overflows||W){z=["sapUiCalendarAppArrowIconLeft","sapUiCalendarAppArrowIcon"];e.icon("sap-icon://arrow-left",z,{title:null,role:"img"})}if(!x&&A){z=["sapUiCalendarAppIcon"];var j={};j["id"]=b+"-Icon";j["title"]=null;j["role"]="img";e.icon(A,z,j)}if(!x&&m){e.openStart("span",b+"-"+s+"_"+r+"-Title");e.class("sapUiCalendarAppTitle");e.openEnd();e.text(m,true);e.close("span")}if(x){E.forEach(function(t){e.renderControl(t)})}if(i.hasNext<0){z=["sapUiCalendarAppArrowIconRight","sapUiCalendarAppArrowIcon"];e.icon("sap-icon://arrow-right",z,{title:null,role:"img"})}e.openStart("span",b+"-"+s+"_"+r+"-Descr");e.class("sapUiInvisibleText");e.openEnd();e.text(a._getAppointmentAnnouncementInfo(f));e.close("span");e.close("div");e.close("div");e.close("div")};f.renderDayNames=function(t,a,n){var s=a._getFirstDayOfWeek(),o=a.getId(),r,d=e.getCalendarType(),p=n.getDaysStandAlone("abbreviated",d),g=n.getDaysStandAlone("wide",d),f=c.getInstance(a.getStartDate()),u,v;f.setDate(f.getDate()-f.getDay()+s);u=l.fromLocalJSDate(f);t.openStart("div",o+"-Names");t.class("sapMSPCMonthDayNames");t.openEnd();for(var D=0;D<7;D++){v=(D+s)%7;r=o+"-WH"+v;t.openStart("div",r);t.class("sapUiCalWH");if(D===0){t.class("sapUiCalFirstWDay")}if(i._isWeekend(u,n)){t.class("sapUiCalItemWeekEnd")}u.setDate(u.getDate()+1);t.accessibilityState(null,{role:"columnheader",label:g[v]});t.openEnd();t.text(p[v%7]);t.close("div")}t.close("div")};f.renderDndPlaceholder=function(e,t){e.openStart("div");e.class("sapMSinglePCOverlay");e.openEnd();e.renderControl(t);e.close("div")};return f},true);
//# sourceMappingURL=SinglePlanningCalendarMonthGridRenderer.js.map