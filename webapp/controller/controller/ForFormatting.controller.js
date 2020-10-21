sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sit/mng/mtng/util/Formatter",
	"sap/m/MessageBox"
], function(Controller, JSONModel, Formatter, MessageBox) {
	"use strict";

	return Controller.extend("sit.mng.mtng.controller.S1", {

		formatter: Formatter,

		onInit: function() {

			var that = this;
			var mainModel = this.getOwnerComponent().getModel();
			sap.ui.core.UIComponent.getRouterFor(that).attachRouteMatched(that.handleRouteMatch, that);
		},
		//
		handleRouteMatch: function() {
			var that = this;
			var mainModel = this.getOwnerComponent().getModel();

			var locationArray = [];
			var finalArray = [];
			var localModel = new sap.ui.model.json.JSONModel();

			that.getView().setModel(localModel, "localModel");
			that.getView().byId("idstartdate").setDateValue(new Date());

			/*that.getView().byId("idbookdate").setDateValue(new Date());*/
			var mParameters = {
				success: function(oData) {

					that.getView().getModel("localModel").setProperty("/mainService", oData.results);
					$.each(oData.results, function(i, el) {
						if ($.inArray(el.Location, locationArray) === -1) {
							locationArray.push(el.Location);
						}
					});
					finalArray.push({
						"Location": "Select"
					});
					$.each(locationArray, function(i, e) {
						finalArray.push({
							"Location": e
						});
					});
					that.getView().getModel("localModel").setProperty("/LocationsData", finalArray);
				},
				error: function(errorResponse) {

				},
				async: true
			};
			mainModel.read("/GeoLocationSet", mParameters);
			that.getView().getModel("localModel").setProperty("/BookBtn", false);
			that.getView().getModel("localModel").setProperty("/BookBtnenabled", false);
			that.getView().getModel("localModel").setProperty("/DeleteBtn", false);
			that.getView().byId("idlocationselect").setSelectedKey("Select");
			that.getView().byId("idBuildingselect").setSelectedKey("Select");
			that.getView().byId("idroomselect").setSelectedKey("Select");
			//var userId=document.getElementById("username").value.toUpperCase() //add user
			//that.getView().getModel("localModel").setProperty("/userId",userId); 
			var afilters = [];
			var userFilter = new sap.ui.model.Filter({
				path: "Userid",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "FIORI_ADMIN" //assign user
			});
			afilters.push(userFilter);

			var mParameters = {
				filters: afilters,
				success: function(oData) {

					that.getView().getModel("localModel").setProperty("/tableData", oData.results);

				},
				error: function(errorResponse) {

				},
				async: true
			};
			mainModel.read("/ReservationSet", mParameters);
			that.getView().byId("idinpttitle").setValue("");
			that.getView().byId("idtimestart").setValue("");
			that.getView().byId("idtimeend").setValue("");
			that.getView().byId("idinptdes").setValue("");
			that.getView().byId("idlocationselect").setSelectedKey("Select");
			that.getView().byId("idBuildingselect").setSelectedKey("Select");
			that.getView().byId("idroomselect").setSelectedKey("Select");
			that.getView().byId("idinputemail").setValue("");
			that.getView().byId("idinptpn").setValue("");
			that.getView().byId("idcheckbox").getSelected(false);

		},

		//Select Location
		onLocationSelect: function(oEvent) {
			var that = this;
			var locationSelectedKey = oEvent.getSource().getSelectedKey();
			if (this.getView().byId("idinpttitle").getValue().length === 0 || this.getView().byId("idstartdate").getValue().length === 0 ||
				this.getView().byId("idtimestart").getValue().length === 0 || this.getView().byId("idtimeend").getValue().length === 0 ||
				this.getView().byId("idlocationselect").getSelectedKey() === "Select" || this.getView().byId("idBuildingselect").getSelectedKey() ===
				"Select" || this.getView().byId("idroomselect").getSelectedKey() === "Select" || this.getView().byId("idinputemail").getValue().length ===
				0) {
				that.getView().getModel("localModel").setProperty("/BookBtn", false);
			} else {
				that.getView().getModel("localModel").setProperty("/BookBtn", true);
			}
			var oModel = that.getView().getModel("localModel");
			var buildingArray = [];
			var finalArray = [];
			if (locationSelectedKey !== "Select") {
				$.each(oModel.getProperty("/mainService"), function(index, element) {
					if (locationSelectedKey === element.Location) {
						if ($.inArray(element.Building, buildingArray) === -1) {
							buildingArray.push(element.Building);
						}
					}
				});
				$.each(buildingArray, function(i, e) {
					finalArray.push({
						"Building": e
					})
				});
				that.getView().byId("idBuildingselect").setEnabled(true);
				finalArray.unshift({
					"Building": "Select"
				});
				oModel.setProperty("/BuildingData", finalArray);
			} else {
				that.getView().byId("idBuildingselect").setEnabled(false);
				that.getView().byId("idBuildingselect").setSelectedKey("Select");
				that.getView().byId("idroomselect").setEnabled(false);
				that.getView().byId("idroomselect").setSelectedKey("Select");
			}
		},

		////Select Building
		onBuildingSelect: function(oEvent) {
			var that = this;
			var buildingSelectedKey = oEvent.getSource().getSelectedKey();
			if (this.getView().byId("idinpttitle").getValue().length === 0 || this.getView().byId("idstartdate").getValue().length === 0 ||
				this.getView().byId("idtimestart").getValue().length === 0 || this.getView().byId("idtimeend").getValue().length === 0 ||
				this.getView().byId("idlocationselect").getSelectedKey() === "Select" || this.getView().byId("idBuildingselect").getSelectedKey() ===
				"Select" || this.getView().byId("idroomselect").getSelectedKey() === "Select" || this.getView().byId("idinputemail").getValue().length ===
				0) {
				that.getView().getModel("localModel").setProperty("/BookBtn", false);
			} else {
				that.getView().getModel("localModel").setProperty("/BookBtn", true);
			}
			var buildingEnabled = that.getView().byId("idBuildingselect").getEnabled();
			var oModel = that.getView().getModel("localModel");
			var confRoomArray = [];
			if (buildingSelectedKey !== "Select" && buildingEnabled === true) {
				$.each(oModel.getProperty("/mainService"), function(index, element) {
					if (buildingSelectedKey === element.Building) {
						confRoomArray.push(element);
					}
				});
				that.getView().byId("idroomselect").setEnabled(true);
				confRoomArray.unshift({
					"Confroom": "Select"
				});
				oModel.setProperty("/ConfroomData", confRoomArray);
			} else {
				that.getView().byId("idroomselect").setEnabled(false);
				that.getView().byId("idroomselect").setSelectedKey("Select");
			}
		},

		////Title Validation 
		Validation: function(oEvt) {
			var that = this;

			if (this.getView().byId("idinpttitle").getValue().length === 0 || this.getView().byId("idstartdate").getValue().length === 0 ||
				this.getView().byId("idtimestart").getValue().length === 0 || this.getView().byId("idtimeend").getValue().length === 0 ||
				this.getView().byId("idlocationselect").getSelectedKey() === "Select" || this.getView().byId("idBuildingselect").getSelectedKey() ===
				"Select" || this.getView().byId("idroomselect").getSelectedKey() === "Select" || this.getView().byId("idinputemail").getValue().length ===
				0) {
				that.getView().getModel("localModel").setProperty("/BookBtn", false);
			} else {
				that.getView().getModel("localModel").setProperty("/BookBtn", true);
			}
		},
		//	
		////Email Validation
		validate: function() {
			var email = this.getView().byId("idinputemail").getValue();
			var mailregex = /^\w+[\w-+\.]*\@(itcinfotech.com)/;
			if (!mailregex.test(email)) {
				sap.m.MessageBox.show(email + " is not a valid email address");
				this.getView().byId("idinputemail").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.getView().byId("idinputemail").setValueState();
			}
		},

		//Check Room Availability
		onPressCheck: function() {
			var that = this;
			var oModel = that.getOwnerComponent().getModel();

			var Startdate = this.getView().byId("idstartdate").getValue().replace("-", "").replace("-", "");
			var ostartdate = parseInt(this.getView().byId("idstartdate").getValue().replace("-", "").replace("-", ""));
			var Enddate = this.getView().byId("idbookdate").getValue().replace("-", "").replace("-", "");
			var oenddate = parseInt(this.getView().byId("idbookdate").getValue().replace("-", "").replace("-", ""));
			var sCurrentDate = new Date();
			var sCurrentHours = sCurrentDate.getHours().toString();
			var sCurrentMinutes = sCurrentDate.getMinutes() < 10 ? "0" + sCurrentDate.getMinutes().toString() : sCurrentDate.getMinutes().toString();
			var sCurrenttime = sCurrentHours + sCurrentMinutes + "00";
			var ocurrenttime = parseInt(sCurrentHours + sCurrentMinutes + "00");

			var sCurrentyear = sCurrentDate.getFullYear().toString();
			var sCurrentmonth = (sCurrentDate.getMonth() + 1) < 10 ? "0" + (sCurrentDate.getMonth() + 1).toString() : (sCurrentDate.getMonth() +
				1).toString();
			var sCurrentday = sCurrentDate.getDate() < 10 ? "0" + sCurrentDate.getDate().toString() : sCurrentDate.getDate().toString();
			var sCreatedate = sCurrentyear + sCurrentmonth + sCurrentday;
			var ocreatedate = parseInt(sCurrentyear + sCurrentmonth + sCurrentday);

			var a = this.getView().byId("idcheckbox").getSelected();

			var Starttime = this.getView().byId("idtimestart").getValue().replace(":", "").replace(" ", "");
			if (Starttime.includes("AM")) {
				Starttime = Starttime.replace("AM", "00");
			} else {
				var hrs = Starttime.slice(0, 2);
				if (parseInt(hrs) < 12) {
					hrs = parseInt(hrs) + 12;

					if (hrs === 24) {
						hrs = "00"
					}
				}
				Starttime = Starttime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
			}
			var ostrttime = this.getView().byId("idtimestart").getValue().replace(":", "").replace(" ", "");
			if (ostrttime.includes("AM")) {
				ostrttime = ostrttime.replace("AM", "00");
			} else {
				var hrs = ostrttime.slice(0, 2);
				if (parseInt(hrs) < 12) {
					hrs = parseInt(hrs) + 12;

					if (hrs === 24) {
						hrs = "00"
					}
				}
				ostrttime = ostrttime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
			}
			var ostarttime = parseInt(ostrttime);

			var Endtime = this.getView().byId("idtimeend").getValue().replace(":", "").replace(" ", "");
			if (Endtime.includes("AM")) {
				Endtime = Endtime.replace("AM", "00");

			} else {
				var hrs = Endtime.slice(0, 2);
				if (parseInt(hrs) < 12) {
					hrs = parseInt(hrs) + 12;

					if (hrs === 24) {
						hrs = "00"
					}
				}
				Endtime = Endtime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
			}
			var oendtme = this.getView().byId("idtimeend").getValue().replace(":", "").replace(" ", "");
			if (oendtme.includes("AM")) {
				oendtme = oendtme.replace("AM", "00");

			} else {
				var hrs = oendtme.slice(0, 2);
				if (parseInt(hrs) < 12) {
					hrs = parseInt(hrs) + 12;

					if (hrs === 24) {
						hrs = "00";
					}
				}
				oendtme = oendtme.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
			}
			var oendtime = parseInt(oendtme);

			if (ostartdate < ocreatedate) {
				sap.m.MessageToast.show("Meeting Start Date Cannot be in Past");
			} else if (a === true && ostartdate > oenddate) {
				sap.m.MessageToast.show("Meeting End Date cannot be less than Meeting Start Date");
			} else if ((a === false && ostartdate === ocreatedate) && ostarttime < ocurrenttime) {
				sap.m.MessageToast.show("Meeting Start Time cannot be in Past");
			} else if (a === false && ostarttime === oendtime) {
				sap.m.MessageToast.show("Meeting Start Time cannot be equal to Meeting End Time");
			} else if (a === false && ostarttime > oendtime) {
				sap.m.MessageToast.show("Meeting End Time cannot be less than Meeting Start time");
			} else if ((this.getView().byId("idinptpn").getValue().length != "") && (this.getView().byId("idinptpn").getValue().length < 10)) {
				sap.m.MessageToast.show("Enter Valid 10 Digit mobile Number");
			} else {

				var Userid = this.getView().byId("idinptusr").getText();
				//var Userid	= document.getElementById("username").value.toUpperCase();
				var Title = this.getView().byId("idinpttitle").getValue();
				var Createdate = sCreatedate;
				var Startdate = Startdate;
				var Enddate = Enddate;
				if (Enddate == "") {
					Enddate = Startdate;
				}
				var Starttime = Starttime;
				var Endtime = Endtime;
				var Location = this.getView().byId("idlocationselect").getSelectedItem().getProperty("text");
				var Building = this.getView().byId("idBuildingselect").getSelectedItem().getProperty("text");
				var Confroom = this.getView().byId("idroomselect").getSelectedItem().getProperty("text");
				var Email = this.getView().byId("idinputemail").getValue();
				var Contactnum = this.getView().byId("idinptpn").getValue();
				var Description = this.getView().byId("idinptdes").getValue();
				var Alldayevent = this.getView().byId("idcheckbox").getSelected();

				var sUrl = "/CheckRoomAvailability?startdate='" + Startdate + "'&enddate='" + Enddate + "'&starttime='" + Starttime +
					"'&endtime='" + Endtime + "'" +
					"&location='" + Location + "'&building='" + Building + "'&confroom='" + Confroom + "'";
				var oHeaders = {
					'X-Requested-With': 'X',
					'Accept' : 'application/json',
				};
				oModel.setHeaders(oHeaders);

				oModel.read(sUrl, {
					success: function(response) {
						sap.m.MessageToast.show("Conference Room is Available");
						that.getView().getModel("localModel").setProperty("/BookBtnenabled", true);
					},
					error: function(oError) {

						sap.m.MessageToast.show("Conference Room is Not Available");
						that.getView().getModel("localModel").setProperty("/BookBtnenabled", false);
					}
				});
			}
		},
		//
		//book room
		onPressBook: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			var sDate = new Date();
			var sYear = sDate.getFullYear().toString();
			var sMonth = (sDate.getMonth()+1)<10?"0"+(sDate.getMonth()+1).toString():(sDate.getMonth()+1).toString();
			var sDay = sDate.getDate()<10?"0"+sDate.getDate().toString():sDate.getDate().toString();
			var sCreateDate = sYear+sMonth+sDay;
			var sStarttime=this.getView().byId("idtimestart").getValue().replace(":","").replace(" ","");
			if(sStarttime.includes("AM")){
 				sStarttime = sStarttime.replace("AM","00");
			}else{
				var hrs= sStarttime.slice(0,2);
				if(parseInt(hrs) < 12){
					hrs=parseInt(hrs)+12;
					if(hrs===24){
						hrs="00";
					}	
				}
				sStarttime = sStarttime.replace("PM","00").replace(/^.{2}/g, hrs.toString());
			}
			var sEndtime= this.getView().byId("idtimeend").getValue().replace(":","").replace(" ","");
				if(sEndtime.includes("AM")){
					sEndtime = sEndtime.replace("AM","00");
				}else{
					var hrs= sEndtime.slice(0,2);
					if(parseInt(hrs) < 12){
						hrs=parseInt(hrs)+12;
						if(hrs===24){
							hrs="00";
						}	
					}
					sEndtime = sEndtime.replace("PM","00").replace(/^.{2}/g, hrs.toString());
				}
				
			var Startdate=this.getView().byId("idstartdate").getValue().replace("-","").replace("-","");
			var Enddate =this.getView().byId("idbookdate").getValue().replace("-","").replace("-","");
			if(Enddate===""){
				Enddate=Startdate;
			}
			
			var oEntry = {};		
			oEntry.Userid =this.getView().byId("idinptusr").getText();
			oEntry.Title =this.getView().byId("idinpttitle").getValue();
			oEntry.Startdate =Startdate;
			oEntry.Enddate =Enddate;
			oEntry.Createdate=sCreateDate;
			oEntry.Starttime =sStarttime;
			oEntry.Endtime =sEndtime;
			oEntry.Location =this.getView().byId("idlocationselect").getSelectedItem().getProperty("text");	
			oEntry.Building =this.getView().byId("idBuildingselect").getSelectedItem().getProperty("text");
			oEntry.Confroom =this.getView().byId("idroomselect").getSelectedItem().getProperty("text");
			oEntry.Email =this.getView().byId("idinputemail").getValue();
			oEntry.Contactnum =this.getView().byId("idinptpn").getValue();
			oEntry.Description =this.getView().byId("idinptdes").getValue();
			oEntry.Alldayevent=this.getView().byId("idcheckbox").getSelected();
			
		
			//mail 
			var odate = new Date();
			var oyear = odate.getFullYear();
			var omonth = (odate.getMonth()+1)<10?"0"+(odate.getMonth()+1):(odate.getMonth()+1);
			var oday = odate.getDate()<10?"0"+odate.getDate():odate.getDate();
			var date=oday+"-"+omonth+"-"+oyear;
			var ostdate=this.getView().byId("idstartdate").getValue();
			var ostdateyear=ostdate.slice(0,4);
			var ostdatemonth=ostdate.slice(5,7);
			var ostdateday=ostdate.slice(8,10);
			var ostdatereal=ostdateday+"-"+ostdatemonth+"-"+ostdateyear;
				
			var oenddte=this.getView().byId("idbookdate").getValue();
			var oenddteyear=oenddte.slice(0,4);
			var oenddtemonth=oenddte.slice(5,7);
			var oenddteday=oenddte.slice(8,10);
			var oenddtereal=oenddteday+"-"+oenddtemonth+"-"+oenddteyear;
			
			if(oenddtereal==="--"){oenddtereal=ostdatereal;}
			/*var a="Hi Team,"+"\n"+"\n";*/
				
				var a="Meeting Title		:  "+ oEntry.Title+"\n";
				a=a+"Created Date		:  " + sDate+"\n";
				a=a+"Meeting Start Date	:  " + ostdatereal+"\n";
				a=a+"Meeting End Date   	:  " + oenddtereal+"\n";
				a=a+"Meeting Start Time	:  " + this.getView().byId("idtimestart").getValue()+"\n";
				a=a+"Meeting End Time	:  " + this.getView().byId("idtimeend").getValue()+"\n";
				a=a+"Location		:  " + oEntry.Location+"\n";
				a=a+"Building		:  " + oEntry.Building+"\n";
				a=a+"Conference Room	:  " + oEntry.Confroom+"\n";
				a=a+"Contact Number	:  " + oEntry.Contactnum+"\n";
				a=a+"Description		:  " + oEntry.Description+"\n"+"\n"+"\n";
				a=a+"Thanks & Regards,";
			//
			var Startdate=this.getView().byId("idstartdate").getValue().replace("-","").replace("-","");
			if(Startdate!== null){
				 sap.m.MessageBox.confirm(
					      "Confirm Create Meeting..", {
					          icon: sap.m.MessageBox.Icon.WARNING,
					          title: "Create Meeting",
					          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					          onClose: function(oAction) {
					          if(oAction==sap.m.MessageBox.Action.OK){
			
			var sUrl = '/ReservationSet';
			var oHeaders = { 'X-Requested-With': 'X', 'Accept' : 'application/json', }; 
			oModel.setHeaders(oHeaders);
			var that = this;
			oModel.create(sUrl,oEntry,{
				method: "POST",
				success: function(oData,response){
					sap.m.MessageToast.show("Meeting Created Successfully");
					sap.m.URLHelper.triggerEmail(oEntry.Email,"Conference Room Booking Details", "Hi Team,"+"\n"+"\n" +"Meeting ID		:" +"  "+oData.Meetingid+"\n"+a);
					that.handleRouteMatch();
				},
				error: function(oError){
					sap.m.MessageToast.show("Meeting Creation Failed");
				}
			});	
			
			}
			}});
			}
			
		},

		// delete room
		//onPressDelete:function(){
		//		var that=this;
		//		var oModel = that.getOwnerComponent().getModel();
		//		
		//		if(this.getView().byId("idtable").getSelectedItem()=== null){
		//			return sap.m.MessageToast.show("Select Row to Delete");
		//		}
		//		var SelectedRowdata = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
		//		getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);
		//		var oEntry = {};		
		//		oEntry.Description =SelectedRowdata.Description;
		//		oEntry.Meetingid =SelectedRowdata.Meetingid;
		//		oEntry.Userid =SelectedRowdata.Userid;
		//		oEntry.Location =SelectedRowdata.Location;
		//		oEntry.Title =SelectedRowdata.Title;
		//		oEntry.Building =SelectedRowdata.Building;
		//		oEntry.Contactnum =SelectedRowdata.Contactnum;
		//		oEntry.Confroom =SelectedRowdata.Confroom;
		//		oEntry.Starttime =SelectedRowdata.Starttime;
		//		oEntry.Endtime =SelectedRowdata.Endtime;
		//		oEntry.Startdate =SelectedRowdata.Startdate;
		//		oEntry.Enddate =SelectedRowdata.Enddate;
		//		oEntry.Createdate =SelectedRowdata.Createdate;
		//		oEntry.Email =SelectedRowdata.Email;	
		//		
		//		if(this.getView().byId("idtable").getSelectedItem()!== null){
		//			 sap.m.MessageBox.confirm(
		//				      "Confirm Cancel Meeting..", {
		//				          icon: sap.m.MessageBox.Icon.WARNING,
		//				          title: "Cancel Meeting",
		//				          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
		//				          onClose: function(oAction) {
		//				          if(oAction==sap.m.MessageBox.Action.OK){
		//				     		
		//		
		//		var sUrl = "/ReservationSet(Meetingid='"+oEntry.Meetingid+"',Userid='"+oEntry.Userid+"',Location='"+oEntry.Location+"'," +
		//				"Building='"+oEntry.Building+"',Confroom='"+oEntry.Confroom+"',Starttime='"+oEntry.Starttime+"'," +
		//				"Endtime='"+oEntry.Endtime+"',Startdate='"+oEntry.Startdate+"',Enddate='"+oEntry.Enddate+"')";
		//		
		//		var oHeaders = { 'X-Requested-With': 'X', 'Accept' : 'application/json', }; 
		//		oModel.setHeaders(oHeaders);
		//		  
		//		oModel.remove(sUrl,{
		//			
		//			success: function(){
		//				sap.m.MessageToast.show("your Booked Conference Room is Canceled");
		//				that.handleRouteMatch()},
		//			error: function(){
		//				sap.m.MessageToast.show("Failed to Cancel the Booked Room");}
		//		});
		//		}else{}
		//}})
		//}
		//},

		//update fragment open
		onPressUpdate: function() {
			var that = this;
			var SelectedRowdata = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
			getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);
			var dialogModel = new sap.ui.model.json.JSONModel();

			var updateBookingData = [];
			updateBookingData.push(SelectedRowdata);

			var locationArray = [];
			var buildingArray = [];
			var conferenceRoomArray = [];
			var locationFinal = [];
			var buildingArrayFinal = [];
			var localModel = that.getView().getModel("localModel");
			$.each(localModel.getProperty("/mainService"), function(index, element) {
				if ($.inArray(element.Location, locationArray) === -1) {
					locationArray.push(element.Location);
				}
				if (SelectedRowdata.Location === element.Location) {
					if ($.inArray(element.Building, buildingArray) === -1) {
						buildingArray.push(element.Building);
					}
				}
				if (SelectedRowdata.Building === element.Building) {
					conferenceRoomArray.push(element);
				}
			});
			$.each(locationArray, function(i, e) {
				locationFinal.push({
					"Location": e
				});
			});
			$.each(buildingArray, function(i, e) {
				buildingArrayFinal.push({
					"Building": e
				});
			});
			//	this.updateBookingData = updateBookinData;

			this.sUpdateUrl = "/ReservationSet(Meetingid='" + updateBookingData[0].Meetingid + "',Userid='" + updateBookingData[0].Userid +
				"',Location='" + updateBookingData[0].Location + "'," +
				"Building='" + updateBookingData[0].Building + "',Confroom='" + updateBookingData[0].Confroom + "',Starttime='" +
				updateBookingData[0].Starttime + "'," +
				"Endtime='" + updateBookingData[0].Endtime + "',Startdate='" + updateBookingData[0].Startdate + "',Enddate='" + updateBookingData[
					0].Enddate + "')";

			/*var dialogModel = new sap.ui.model.json.JSONModel();
			dialogModel.setData({"dialogArray":updateBookingData});*/

			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment("sit.mng.mtng.view.Fragment.Update", this);
				this._Dialog.setModel(dialogModel);
				this._Dialog.getModel().setProperty("/dialogArray", updateBookingData);
				var allday = updateBookingData[0].Alldayevent;
				if (allday === true) {
					sap.ui.getCore().byId("idtimestartfrag").setEnabled(false);
					sap.ui.getCore().byId("idtimeendfrag").setEnabled(false);
				} else {
					sap.ui.getCore().byId("idenddtefrag").setEnabled(false);
				}
				this._Dialog.getModel().setProperty("/LocationsData", locationFinal);
				this._Dialog.getModel().setProperty("/BuildingData", buildingArrayFinal);
				this._Dialog.getModel().setProperty("/ConfroomData", conferenceRoomArray);

				this._Dialog.open();
			} else {
				this._Dialog.setModel(dialogModel);
				this._Dialog.getModel().setProperty("/dialogArray", updateBookingData);
				this._Dialog.getModel().setProperty("/LocationsData", locationArray);
				this._Dialog.getModel().setProperty("/BuildingData", buildingArray);
				this._Dialog.getModel().setProperty("/ConfroomData", conferenceRoomArray);
				this._Dialog.open();
			}

		},

		//Update fragment close
		onClose: function() {
			this._Dialog.close();
		},
		//
		onBtnupdateSubmit: function() {
			var that = this;
			sap.m.MessageBox.confirm(
				"Confirm Update Meeting Details..", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Update Meeting Details",
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					onClose: function(oAction) {
						if (oAction === "OK") {
							that.onupdateSubmit(that);
						}
					}
				});

		},
		//Submit updated room
//		onupdateSubmit: function(that) {
//			var that1 = that;
//			var oModel = that1.getOwnerComponent().getModel();
//
//			//validations
//			var Startdate = sap.ui.getCore().byId("idstrtdatefrg").getValue().replace("-", "").replace("-", "");
//			var ostartdate = parseInt(sap.ui.getCore().byId("idstrtdatefrg").getValue().replace("-", "").replace("-", ""));
//			var Enddate = sap.ui.getCore().byId("idenddtefrag").getValue().replace("-", "").replace("-", "");
//			var oenddate = parseInt(sap.ui.getCore().byId("idenddtefrag").getValue().replace("-", "").replace("-", ""));
//			var sCurrentDate = new Date();
//			var sCurrentHours = sCurrentDate.getHours().toString();
//			var sCurrentMinutes = sCurrentDate.getMinutes() < 10 ? "0" + sCurrentDate.getMinutes().toString() : sCurrentDate.getMinutes().toString();
//			var sCurrenttime = sCurrentHours + sCurrentMinutes + "00";
//			var ocurrenttime = parseInt(sCurrentHours + sCurrentMinutes + "00");
//
//			var sCurrentyear = sCurrentDate.getFullYear().toString();
//			var sCurrentmonth = (sCurrentDate.getMonth() + 1) < 10 ? "0" + (sCurrentDate.getMonth() + 1).toString() : (sCurrentDate.getMonth() +
//				1).toString();
//			var sCurrentday = sCurrentDate.getDate() < 10 ? "0" + sCurrentDate.getDate().toString() : sCurrentDate.getDate().toString();
//			var sCreatedate = sCurrentyear + sCurrentmonth + sCurrentday;
//			var ocreatedate = parseInt(sCurrentyear + sCurrentmonth + sCurrentday);
//
//			var a = sap.ui.getCore().byId("idcheckboxfrag").getSelected();
//
//			var Starttime = sap.ui.getCore().byId("idtimestartfrag").getValue().replace(":", "").replace(" ", "");
//			if (Starttime.includes("AM")) {
//				Starttime = Starttime.replace("AM", "00");
//			} else if (Starttime.includes("PM")) {
//				var hrs = Starttime.slice(0, 2);
//				if (parseInt(hrs) < 12) {
//					hrs = parseInt(hrs) + 12;
//
//					if (hrs === 24) {
//						hrs = "00";
//					}
//				}
//				Starttime = Starttime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
//			}
//
//			var ostrttime = sap.ui.getCore().byId("idtimestartfrag").getValue().replace(":", "").replace(" ", "");
//			if (ostrttime.includes("AM")) {
//				ostrttime = ostrttime.replace("AM", "00");
//			} else if (ostrttime.includes("PM")) {
//				var hrs = ostrttime.slice(0, 2);
//				if (parseInt(hrs) < 12) {
//					hrs = parseInt(hrs) + 12;
//
//					if (hrs === 24) {
//						hrs = "00";
//					}
//				}
//				ostrttime = ostrttime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
//			}
//			var ostarttime = parseInt(ostrttime);
//
//			var Endtime = sap.ui.getCore().byId("idtimeendfrag").getValue().replace(":", "").replace(" ", "");
//			if (Endtime.includes("AM")) {
//				Endtime = Endtime.replace("AM", "00");
//			} else if (Endtime.includes("PM")) {
//				var hrs = Endtime.slice(0, 2);
//				if (parseInt(hrs) < 12) {
//					hrs = parseInt(hrs) + 12;
//
//					if (hrs === 24) {
//						hrs = "00";
//					}
//				}
//				Endtime = Endtime.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
//			}
//			var oedtme = sap.ui.getCore().byId("idtimeendfrag").getValue().replace(":", "").replace(" ", "");
//			if (oedtme.includes("AM")) {
//				oedtme = oedtme.replace("AM", "00");
//			} else if (oedtme.includes("PM")) {
//				var hrs = oedtme.slice(0, 2);
//				if (parseInt(hrs) < 12) {
//					hrs = parseInt(hrs) + 12;
//
//					if (hrs === 24) {
//						hrs = "00";
//					}
//				}
//				oedtme = oedtme.replace("PM", "00").replace(/^.{2}/g, hrs.toString());
//			}
//			var oendtime = parseInt(oedtme);
//
//			if (ostartdate < ocreatedate) {
//				sap.m.MessageToast.show("Meeting Start Date Cannot be in Past");
//			} else if (a === true && ostartdate > oenddate) {
//				sap.m.MessageToast.show("Meeting End Date cannot be less than Meeting Start Date");
//
//			} else if ((a === false && ostartdate === ocreatedate) && ostarttime < ocurrenttime) {
//				sap.m.MessageToast.show("Meeting Start Time cannot be in Past");
//			} else if (a === false && ostarttime === oendtime) {
//				sap.m.MessageToast.show("Meeting Start Time cannot be equal to Meeting End Time");
//			} else if (a === false && ostarttime > oendtime) {
//				sap.m.MessageToast.show("Meeting End Time cannot be less than Meeting Start time");
//			} else {
//				// end validations
//				var SelectedRowdata = that1.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
//				getModel().getProperty(that1.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);
//				var oEntry = {};
//
//				oEntry.Userid = that1.getView().byId("idinptusr").getText();
//				//oEntry.Userid =document.getElementById("username").value.toUpperCase();
//				oEntry.Meetingid = SelectedRowdata.Meetingid;
//				oEntry.Title = sap.ui.getCore().byId("idinputtitlefrag").getValue();
//				oEntry.Startdate = Startdate;
//				oEntry.Enddate = Enddate;
//				oEntry.Createdate = sCreatedate;
//				oEntry.Starttime = Starttime;
//				oEntry.Endtime = Endtime;
//				oEntry.Location = sap.ui.getCore().byId("idlocationselectfrag").getSelectedItem().getProperty("text");
//				oEntry.Building = sap.ui.getCore().byId("idBuildingselectfrag").getSelectedItem().getProperty("text");
//				oEntry.Confroom = sap.ui.getCore().byId("idroomselectfrag").getSelectedItem().getProperty("text");
//				oEntry.Email = sap.ui.getCore().byId("idmailfrag").getValue();
//				oEntry.Contactnum = sap.ui.getCore().byId("idconnumfrag").getValue();
//				oEntry.Description = that1.getView().byId("idinptdes").getValue();
//				oEntry.Alldayevent = sap.ui.getCore().byId("idcheckboxfrag").getSelected();
//
//				var odate = new Date();
//				var oyear = odate.getFullYear();
//				var omonth = (odate.getMonth() + 1) < 10 ? "0" + (odate.getMonth() + 1) : (odate.getMonth() + 1);
//				var oday = odate.getDate() < 10 ? "0" + odate.getDate() : odate.getDate();
//				var date = oday + "-" + omonth + "-" + oyear;
//
//				var ostdate = sap.ui.getCore().byId("idstrtdatefrg").getValue();
//				var ostdateyear = ostdate.slice(0, 4);
//				var ostdatemonth = ostdate.slice(4, 6);
//				var ostdateday = ostdate.slice(6, 8);
//				var ostdatereal = ostdateday + "-" + ostdatemonth + "-" + ostdateyear;
//
//				var oenddte = sap.ui.getCore().byId("idenddtefrag").getValue();
//				var oenddteyear = oenddte.slice(0, 4);
//				var oenddtemonth = oenddte.slice(4, 6);
//				var oenddteday = oenddte.slice(6, 8);
//				var oenddtereal = oenddteday + "-" + oenddtemonth + "-" + oenddteyear;
//
//				if (oenddtereal === "--") {
//					oenddtereal = ostdatereal;
//				}
//
//				var a = "Hi Team," + "\n" + "\n";
//				a = a + "Meeting ID		:  " + SelectedRowdata.Meetingid + "\n";
//				a = a + "Meeting Title		:  " + oEntry.Title + "\n";
//				a = a + "Created Date		:  " + that1.formatter.changeDateFormat(oEntry.Createdate) + "\n";
//				a = a + "Meeting Start Date	:  " + that1.formatter.changeDateFormat(oEntry.Startdate) + "\n";
//				a = a + "Meeting End Date   	:  " + that1.formatter.changeDateFormat(oEntry.Enddate) + "\n";
//				a = a + "Meeting Start Time	:  " + that1.formatter.changeTimeFormat(oEntry.Starttime) + "\n";
//				a = a + "Meeting End Time	:  " + that1.formatter.changeTimeFormat(oEntry.Endtime) + "\n";
//				a = a + "Location		:  " + oEntry.Location + "\n";
//				a = a + "Building		:  " + oEntry.Building + "\n";
//				a = a + "Conference Room	:  " + oEntry.Confroom + "\n";
//				a = a + "Contact Number	:  " + oEntry.Contactnum + "\n";
//				a = a + "Description		:  " + oEntry.Description + "\n" + "\n" + "\n";
//				a = a + "Thanks & Regards,";
//				//
//
//				var oHeaders = {
//					'X-Requested-With': 'X',
//					'Accept': 'application/json'
//				};
//				oModel.setHeaders(oHeaders);
//				oModel.update(that1.sUpdateUrl, oEntry, {
//					success: function(oData, response) {
//						sap.m.MessageToast.show("Your Meeting has been Successfully Updated");
//						that1._Dialog.close();
//						sap.m.URLHelper.triggerEmail(oEntry.Email, "Conference Room Booking Details", a);
//						that1.handleRouteMatch();
//					},
//					error: function(oError) {
//						sap.m.MessageToast.show("Failed to update the Room Details, Already booked..");
//					}
//				});
//			}
//		},

		//Check Availability Submit button
		/*onPresssubmitCheck:function(){
			var that=this;
			var oModel = that.getOwnerComponent().getModel();

			var Startdate =sap.ui.getCore().byId("idstrtdatefrg").getValue().replace("-","").replace("-","");
			var Enddate =sap.ui.getCore().byId("idenddtefrag").getValue().replace("-","").replace("-","");
			var sCurrentDate = new Date();
			var sCurrentHours = sCurrentDate.getHours().toString();
			var sCurrentMinutes = sCurrentDate.getMinutes()<10?"0"+sCurrentDate.getMinutes().toString():sCurrentDate.getMinutes().toString();
			var sCurrenttime= sCurrentHours+sCurrentMinutes+"00";

			var sCurrentyear = sCurrentDate.getFullYear().toString();
			var sCurrentmonth = (sCurrentDate.getMonth()+1)<10?"0"+(sCurrentDate.getMonth()+1).toString():(sCurrentDate.getMonth()+1).toString();
			var sCurrentday = sCurrentDate.getDate()<10?"0"+sCurrentDate.getDate().toString():sCurrentDate.getDate().toString();
			var sCreatedate = sCurrentyear+sCurrentmonth+sCurrentday;
			var a= sap.ui.getCore().byId("idcheckboxfrag").getSelected();

			var Starttime =sap.ui.getCore().byId("idtimestartfrag").getValue().replace(":","").replace(" ","");
			if(Starttime.includes("AM")){
				Starttime = Starttime.replace("AM","00");
				}else if(Starttime.includes("PM")){
				var hrs= Starttime.slice(0,2);
				if(parseInt(hrs) < 12){
					hrs=parseInt(hrs)+12;
				
					if(hrs===24){
						hrs="00"
					}	
				}
				Starttime = Starttime.replace("PM","00").replace(/^.{2}/g, hrs.toString());
			}

			var Endtime =sap.ui.getCore().byId("idtimeendfrag").getValue().replace(":","").replace(" ","");
			if(Endtime.includes("AM")){
				Endtime = Endtime.replace("AM","00");
				}else if(Endtime.includes("PM")){
				var hrs= Endtime.slice(0,2);
				if(parseInt(hrs) < 12){
					hrs=parseInt(hrs)+12;
				
					if(hrs===24){
						hrs="00"
					}	
				}
				Endtime = Endtime.replace("PM","00").replace(/^.{2}/g, hrs.toString());
			}

			if(Startdate<sCreatedate){
				sap.m.MessageToast.show("This day no longer exist");
			}

			else if(a===true && Startdate>Enddate){
				sap.m.MessageToast.show("Enddate should be Greater than StartDate");
				
			}
			else if((a===false && Startdate===sCreatedate) && Starttime<sCurrenttime){
				sap.m.MessageToast.show("Start Time should always be greater than current time");
			}
			else if(a===false && Starttime>Endtime){
				sap.m.MessageToast.show("End Time should be greater than Start time");			
			}
			else{
			// end validations
				
			//var Userid =this.getView().byId("idinptusr").getText();
			var Userid =document.getElementById("username").value.toUpperCase()
			var Title =sap.ui.getCore().byId("idinputtitlefrag").getValue();
			var Createdate=sCreatedate;
			var Startdate =Startdate;
			var Enddate =Enddate;
			if(Enddate==""){
				Enddate=Startdate;
			}
			var Starttime =Starttime;
			var Endtime =Endtime;
			var Location =sap.ui.getCore().byId("idlocationselectfrag").getSelectedItem().getProperty("text");
			var Building =sap.ui.getCore().byId("idBuildingselectfrag").getSelectedItem().getProperty("text");
			var Confroom =sap.ui.getCore().byId("idroomselectfrag").getSelectedItem().getProperty("text");
			var Email =sap.ui.getCore().byId("idmailfrag").getValue();
			var Contactnum =sap.ui.getCore().byId("idconnumfrag").getValue();
			var Description =this.getView().byId("idinptdes").getValue();
			var Alldayevent=sap.ui.getCore().byId("idcheckboxfrag").getSelected();

			var sUrl = "/CheckRoomAvailability?startdate='"+Startdate+"'&enddate='"+Enddate+"'&starttime='"+Starttime+"'&endtime='"+Endtime+"'" +
						"&location='"+Location+"'&building='"+Building+"'&confroom='"+Confroom+"'" ;
			var oHeaders = { 'X-Requested-With': 'X', 'Accept' : 'application/json', }; 
			oModel.setHeaders(oHeaders);

			oModel.read(sUrl,{		
					success: function(response){			
						sap.m.MessageToast.show("You can Update This Room");			
						sap.ui.getCore().byId("idbtnupdatesubmit").setEnabled(true);
					},
					error: function(oError){
						
							sap.m.MessageToast.show("This Room Updation is Not Available");
							sap.ui.getCore().byId("idbtnupdatesubmit").setEnabled(false);
							
						}
				});	
			}
			},*/

		//Table Search Filter
		handleChangeSearch: function(oEvent) {
			var tableId = this.getView().byId("idtable");
			var inputValue = oEvent.getParameter("query");
			var trimValue = inputValue.trim();
			var filterArr = [];
			var items = tableId.getBinding("items");
			var filter1 = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter2 = new sap.ui.model.Filter("Createdate", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter3 = new sap.ui.model.Filter("Startdate", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter4 = new sap.ui.model.Filter("Enddate", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter5 = new sap.ui.model.Filter("Location", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter6 = new sap.ui.model.Filter("Building", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter7 = new sap.ui.model.Filter("Confroom", sap.ui.model.FilterOperator.Contains, trimValue);
			filterArr = [filter1, filter2, filter3, filter4, filter5, filter6, filter7];

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			items.filter(finalFilter);
		},

		// Table Row select Confirmation
		onTableSelected: function(oEvt) {
			var that = this;
			var rowSelected = oEvt.getSource().getSelectedItem();
			if (rowSelected.length !== 0) {
				that.getView().getModel("localModel").setProperty("/DeleteBtn", true);
			} else {
				that.getView().getModel("localModel").setProperty("/DeleteBtn", false);
			}
		},
		//
		////Table Sorting
		onpresssorter: function() {
			this._oDialog = sap.ui.xmlfragment("sit.mng.mtng.view.Fragment.sort", this);
			this._oDialog.open();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		},

		handleConfirm: function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("idtable");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			//var vGroup;
			var sPath;
			var bDescending;
			var aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},

		// icon tab button visible	
		handleIconTabBarSelect: function(oEvent) {
			var skey = oEvent.getParameter("key");
			if (skey === "MyReservations") {
				this.getView().byId("idupdatebtn").setVisible(true);
				this.getView().byId("iddeletebtn").setVisible(true);
				this.getView().byId("idprintbtn").setVisible(true);
				this.getView().byId("idmailbtn").setVisible(true);
				this.getView().byId("idcheckbtn").setVisible(false);
				this.getView().byId("idbookbtn").setVisible(false);
				this.getView().byId("idtable").removeSelections(true);
			} else if (skey === "NewReservation") {

				this.getView().byId("idcheckbtn").setVisible(true);
				this.getView().byId("idbookbtn").setVisible(true);
				this.getView().byId("iddeletebtn").setVisible(false);
				this.getView().byId("idprintbtn").setVisible(false);
				this.getView().byId("idmailbtn").setVisible(false);
				this.getView().byId("idupdatebtn").setVisible(false);
			} else {
				this.getView().byId("idcheckbtn").setVisible(false);
				this.getView().byId("idbookbtn").setVisible(false);
				this.getView().byId("iddeletebtn").setVisible(false);
				this.getView().byId("idprintbtn").setVisible(false);
				this.getView().byId("idmailbtn").setVisible(false);
				this.getView().byId("idupdatebtn").setVisible(false);
			}
		},

		//Print Fragment open
		/*onPressPrint: function() {
			var SelectedRowdata = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
			getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);
			
			var array = [];
			array.push(SelectedRowdata);
			var dialogModel = new sap.ui.model.json.JSONModel();
			dialogModel.setData({"dialogArray":array});
			if(!this._Dialog){
				this._Dialog = sap.ui.xmlfragment("ConferenceRoom.view.Fragment.Print",this);
				//sap.ui.getCore().byId("id1").setText("")
				this._Dialog.setModel(dialogModel).open();	
			}else{
				this._Dialog.setModel(dialogModel).open();	
			}
			},
			*/
		// print fragment close
		/*onClose: function() {
			this._Dialog.close();
		},*/

		//Print page open
		/*onBtnprintSubmit:function(){	
			
			            var printContents = document.getElementById("idprintform").innerHTML;
			             var win = window.open("", "PrintWindow");
			             win.document.write("<div class='page'>" + printContents + "</div>");
			             win.print();
			                  
			      },*/
		onPressPrint: function() {

			/*                var printContents = document.getElementById("idprintform").innerHTML;*/
			var selectedrow = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
			getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);

			var header = "<center><table  style = 'padding-left: 100px; border: 2px solid grey;' width = '95%'>" +
				"<center><h1 ><u>Conference Room Booking Details</h1></u> </center>" +
				"<tr><td><p  style = 'padding-top: 18px;'><b>User Name   :</p></b></td> <td style ='padding-top: 18px; padding-left: 100px;'>" +
				selectedrow.Userid +
				"</td><tr>" +
				"<tr><td><p style = 'padding-top: 18px;'><b>Title   :</p></b></td><td style ='padding-top: 18px; padding-left: 100px;'> " +
				selectedrow.Title +
				"</td></tr><tr>" +
				"<td><p style = 'padding-top: 18px;'><b>Created Date   :</p></b></td><td style ='padding-top: 18px; padding-left: 100px;'>" + sit.mng
				.mtng.util.Formatter.changeDateFormat(selectedrow.Createdate) +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Meeting Start Date   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				this.formatter.changeDateFormat(selectedrow.Startdate) +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Meeting End Date   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				this.formatter.changeDateFormat(selectedrow.Enddate) +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Meeting Start Time   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				this.formatter.changeTimeFormat(selectedrow.Starttime) +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Meeting End Time   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				this.formatter.changeTimeFormat(selectedrow.Endtime) +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Location   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'> " +
				selectedrow.Location +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Building   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				selectedrow.Building +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Conference Room   :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				selectedrow.Confroom +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>E-Mail  :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				selectedrow.Email +
				"</td></tr><tr><td><p style = 'padding-top: 18px;'><b>Contact Number  :</p></b></td><td style ='padding-top: 18px;padding-left: 100px;'>" +
				selectedrow.Contactnum +
				"</td></tr><tr><td><p style = 'padding-top: 18px;padding-bottom: 10px;'><b>Meeting Description  :</p></b></td><td style ='padding-bottom: 10px;padding-top: 18px;padding-left: 100px;'>" +
				selectedrow.Description +
				"</td></tr> </table><center> <br>";

			var ctrlString = "width = 500px, height = 600px";
			var win = window.open("", "PrintWindow", ctrlString);
			win.document.write("<div class='page'>" + header + "</div>");
			win.print();
			win.close();
		},

		//send Email Button
		onPressEmail: function() {
			var selectedrow = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
			getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);

			var a = "Hi Team," + "\n" + "\n";
			a = a + "Meeting Id		:  " + selectedrow.Meetingid + "\n";
			a = a + "Meeting Title		:  " + selectedrow.Title + "\n";
			a = a + "Created Date		:  " + this.formatter.changeDateFormat(selectedrow.Createdate) + "\n";
			a = a + "Meeting Start Date	:  " + this.formatter.changeDateFormat(selectedrow.Startdate) + "\n";
			a = a + "Meeting End Date   	:  " + this.formatter.changeDateFormat(selectedrow.Enddate) + "\n";
			a = a + "Meeting Start Time	:  " + this.formatter.changeTimeFormat(selectedrow.Starttime) + "\n";
			a = a + "Meeting End Time	:  " + this.formatter.changeTimeFormat(selectedrow.Endtime) + "\n";
			a = a + "Location		:  " + selectedrow.Location + "\n";
			a = a + "Building		:  " + selectedrow.Building + "\n";
			a = a + "Conference Room	:  " + selectedrow.Confroom + "\n";
			a = a + "Contact Number	:  " + selectedrow.Contactnum + "\n";
			a = a + "Description		:  " + selectedrow.Description + "\n" + "\n" + "\n";
			a = a + "Thanks & Regards,";

			sap.m.URLHelper.triggerEmail(selectedrow.Email, "Conference Room Booking Details", a);
		},

		// Event Check Box
		handleSelect: function(oEvent) {

			var a = oEvent.getSource().getSelected();
			var strtdte = this.getView().byId("idstartdate").getValue().replace("-", "").replace("-", "");

			if (a === true) {
				this.getView().byId("idbookdate").setEnabled(true);
				this.getView().byId("idtimestart").setEnabled(false);
				this.getView().byId("idtimeend").setEnabled(false);
				this.getView().byId("idtimestart").setValue("00:01 AM");
				this.getView().byId("idtimeend").setValue("11:59 PM");
				this.getView().byId("idbookdate").setValue(strtdte);
				/*var startdate = this.getView().byId("idstartdate").getValue();
				var enddate =  this.getView().byId("idstartdate").getValue();
				if(startdate<enddate){
					sap.m.MessageToast.show("End date must be Greater than startdate");
					
				}*/

			} else {
				var dt = new Date();
				var sCurrentHours = dt.getHours();
				var sCurrentMinutes = dt.getMinutes();
				var sCurrenttime = "" + sCurrentHours + sCurrentMinutes + "00";
				this.getView().byId("idbookdate").setEnabled(false);
				this.getView().byId("idtimestart").setEnabled(true);
				this.getView().byId("idtimeend").setEnabled(true);
				this.getView().byId("idtimestart").setValue(sCurrenttime);
				this.getView().byId("idtimeend").setValue(sCurrenttime);
				this.getView().byId("idbookdate").setValue("");
				/*var dte= new Date();
				var yr=dte.getFullYear();
				var mnt=dte.getMonth();
				var dy=dte.getDate();
				var nwdte=yr+mnt+dy;*/

				/*this.getView().byId("idbookdate").setValue("");*/
				/*this.getView().byId("idbookdate").setDateValue(new Date());*/
			}

		},

		handleSelectfrag: function(oEvent) {
			var a = oEvent.getSource().getSelected();

			/*var selectedrow = this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").
				getModel().getProperty(this.getView().byId("idtable").getSelectedItem().getBindingContext("localModel").sPath);

			var fSelectedrow=[];
			fSelectedrow.push(selectedrow);*/

			if (a === true) {
				sap.ui.getCore().byId("idenddtefrag").setEnabled(true);
				/*sap.ui.getCore().byId("idtimestartfrag").setValue("00:01 AM");	
				sap.ui.getCore().byId("idtimeendfrag").setValue("11:59 PM");*/
				sap.ui.getCore().byId("idtimestartfrag").setEnabled(false);
				sap.ui.getCore().byId("idtimeendfrag").setEnabled(false);

			} else {
				sap.ui.getCore().byId("idenddtefrag").setEnabled(false);
				sap.ui.getCore().byId("idtimestartfrag").setEnabled(true);
				sap.ui.getCore().byId("idtimeendfrag").setEnabled(true);
				/*sap.ui.getCore().byId("idtimestartfrag").setValue(fSelectedrow[0].Starttime);
				sap.ui.getCore().byId("idtimeendfrag").setValue(fSelectedrow[0].Endtime);*/

				/*sap.ui.getCore().byId("idenddtefrag").setValue(selectedrow.Enddate);
				sap.ui.getCore().byId("idtimestartfrag").setValue("updateBookingData[0].Starttime");
				sap.ui.getCore().byId("idtimeendfrag").setValue("updateBookingData[0].Endtime");*/

			}

		},

		//Select location All
		onLocationSelectall: function(oEvent) {
			var that = this;
			var locationSelectedKey = oEvent.getSource().getSelectedKey();

			var oModel = that.getView().getModel("localModel");
			var buildingArray = [];
			var finalArray = [];
			if (locationSelectedKey !== "Select") {
				$.each(oModel.getProperty("/mainService"), function(index, element) {
					if (locationSelectedKey === element.Location) {
						if ($.inArray(element.Building, buildingArray) === -1) {
							buildingArray.push(element.Building);
						}
					}
				});
				$.each(buildingArray, function(i, e) {
					finalArray.push({
						"Building": e
					});
				});
				that.getView().byId("idBuildingselectall").setEnabled(true);
				finalArray.unshift({
					"Building": "Select"
				});
				oModel.setProperty("/BuildingData", finalArray);
			} else {
				that.getView().byId("idBuildingselectall").setEnabled(false);
				that.getView().byId("idBuildingselectall").setSelectedKey("Select");
				that.getView().byId("idroomselectall").setEnabled(false);
				that.getView().byId("idroomselectall").setSelectedKey("Select");
			}
		},

		//Select Building All
		onBuildingSelectall: function(oEvent) {
			var that = this;
			var buildingSelectedKey = oEvent.getSource().getSelectedKey();

			var buildingEnabled = that.getView().byId("idBuildingselectall").getEnabled();
			var oModel = that.getView().getModel("localModel");
			var confRoomArray = [];
			if (buildingSelectedKey !== "Select" && buildingEnabled === true) {
				$.each(oModel.getProperty("/mainService"), function(index, element) {
					if (buildingSelectedKey === element.Building) {
						confRoomArray.push(element);
					}
				});
				that.getView().byId("idroomselectall").setEnabled(true);
				confRoomArray.unshift({
					"Confroom": "Select"
				});
				oModel.setProperty("/ConfroomData", confRoomArray);
			} else {
				that.getView().byId("idroomselectall").setEnabled(false);
				that.getView().byId("idroomselectall").setSelectedKey("Select");
			}
		},
		onRoomSelectall: function(oEvent) {
			var that = this;

			if (that.getView().byId("idlocationselectall").getSelectedKey() !== "Select" && that.getView().byId("idBuildingselectall").getSelectedKey() !==
				"Select" && that.getView().byId("idroomselectall").getSelectedKey() !== "Select") {
				that.getView().byId("PC1").setVisible(true);
				that.onallreservation();
			} else {
				that.getView().byId("PC1").setVisible(false);
			}

		},
		//
		onallreservation: function() {
			var that = this;
			var mainModel = this.getOwnerComponent().getModel();

			//var Confroom=this.getView().byId("idroomselectall").getSelectedKey();
			var Confroom = that.getView().byId("idroomselectall").getSelectedKey();
			var allConfroomArray = [];
			var allreserArray = [];
			var finalreservArray = [];
			var sortArray = [];

			var afilters = [];
			var userFilter = new sap.ui.model.Filter({
				path: "Confroom",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: Confroom
			});
			afilters.push(userFilter);
			var mParameters = {
				filters: afilters,
				success: function(oData) {

					$.each(oData.results, function(index, element) {
						if ($.inArray(element.Confroom, allConfroomArray) === -1) {
							allConfroomArray.push(element.Confroom);
						}
						element.allStartdate = new Date(element.Startdate.slice(0, 4), (parseInt(element.Startdate.slice(4, 6)) - 1).toString(),
							element.Startdate.slice(6, 8), element.Starttime.slice(0, 2),
							element.Starttime.slice(2, 4), element.Starttime.slice(4, 6));
						element.allEnddate = new Date(element.Enddate.slice(0, 4), (parseInt(element.Enddate.slice(4, 6)) - 1).toString(), element.Enddate
							.slice(6, 8), element.Endtime.slice(0, 2),
							element.Endtime.slice(2, 4), element.Endtime.slice(4, 6));

						allreserArray.push(element);
					});

					$.each(allConfroomArray, function(index, element) {
						$.each(allreserArray, function(i, e) {
							if (element === e.Confroom) {
								sortArray.push(e);
							}
						});
						finalreservArray.push({
							"conferenceRoom": element,
							"appointments": sortArray
						});
					});

					that.getView().getModel("localModel").setProperty("/people", finalreservArray);

					//that.getView().getModel("localModel").setProperty("/people",testingArray);
					//that.getView().getModel("localModel").setProperty("/allreservations",allreserArray);
					that.getView().getModel("localModel").setProperty("/Startdate", new Date());

				},
				error: function(errorResponse) {

				},
				async: true
			};
			mainModel.read("/ReservationSet", mParameters);

		},
		//
		//Planing calendar select appointments alert
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			if (oAppointment) {
				var sSelected = oAppointment.getSelected() ? "selected" : "deselected";
				var oyearStart = oAppointment.getStartDate().getFullYear();
				var oMonthStart = (oAppointment.getStartDate().getMonth() + 1) < 10 ? "0" + (oAppointment.getStartDate().getMonth() + 1) : (
					oAppointment.getStartDate().getMonth() + 1);
				var oDateStart = (oAppointment.getStartDate().getDate()) < 10 ? "0" + (oAppointment.getStartDate().getDate()) : (oAppointment.getStartDate()
					.getDate());
				var oFullDateStart = oDateStart + "/" + oMonthStart + "/" + oyearStart;
				var ohoursStart = (oAppointment.getStartDate().getHours()) < 10 ? "0" + (oAppointment.getStartDate().getHours()) : (oAppointment.getStartDate()
					.getHours());
				var ominutesStart = (oAppointment.getStartDate().getMinutes()) < 10 ? "0" + (oAppointment.getStartDate().getMinutes()) : (
					oAppointment.getStartDate().getMinutes());
				var ofullTimeStart = ohoursStart + ":" + ominutesStart;

				var oyearEnd = oAppointment.getEndDate().getFullYear();
				var oMonthEnd = (oAppointment.getEndDate().getMonth() + 1) < 10 ? "0" + (oAppointment.getEndDate().getMonth() + 1) : (oAppointment
					.getEndDate().getMonth() + 1);
				var oDateEnd = (oAppointment.getEndDate().getDate()) < 10 ? "0" + (oAppointment.getEndDate().getDate()) : (oAppointment.getEndDate()
					.getDate());
				var oFullDateEnd = oDateEnd + "/" + oMonthEnd + "/" + oyearEnd;
				var ohoursEnd = (oAppointment.getEndDate().getHours()) < 10 ? "0" + (oAppointment.getEndDate().getHours()) : (oAppointment.getEndDate()
					.getHours());
				var ominutesEnd = (oAppointment.getEndDate().getMinutes()) < 10 ? "0" + (oAppointment.getEndDate().getMinutes()) : (oAppointment.getEndDate()
					.getMinutes());
				var ofulltimeend = ohoursEnd + ":" + ominutesEnd;

				sap.m.MessageBox.show("This Room was Created By User: " + oAppointment.getText() + ". \n Title: " + oAppointment.getTitle() +
					". \n Start Date: " + oFullDateStart + ". \n End Date : " + oFullDateEnd + ". \n Start Time: " + ofullTimeStart +
					". \n End Time : " + ofulltimeend);
			} else {
				var aAppointments = oEvent.getParameter("appointments");
				var sValue = aAppointments.length + " Appointments selected";
				MessageBox.show(sValue);
			}
		}

	});
});