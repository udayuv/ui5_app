sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/m/MessageToast","sap/ui/model/json/JSONModel"],(e,t,n,o)=>{"use strict";return e.extend("ui5.walkthrough.controller.Detail",{onInit(){const e=new o({currency:"EUR"});this.getView().setModel(e,"view");const t=this.getOwnerComponent().getRouter();t.getRoute("detail").attachPatternMatched(this.onObjectMatched,this)},onObjectMatched(e){this.byId("rating").reset();this.getView().bindElement({path:"/"+window.decodeURIComponent(e.getParameter("arguments").invoicePath),model:"invoice"})},onNavBack(){const e=t.getInstance();const n=e.getPreviousHash();if(n!==undefined){window.history.go(-1)}else{const e=this.getOwnerComponent().getRouter();e.navTo("overview",{},true)}},onRatingChange(e){const t=e.getParameter("value");const o=this.getView().getModel("i18n").getResourceBundle();n.show(o.getText("ratingConfirmation",[t]))}})});
//# sourceMappingURL=Detail.controller.js.map