//Level 3
import { Component, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JqxGridService } from './jqxgrid.service'
import { SharedService } from '../../shared/service/shared.service';
import { BreadcrumbCSService } from '../../shared/breadcrumb-cs/breadcrumb-cs.service';

declare var $: any

@Component({
    selector: 'jqxgrid-member-compliance',
    templateUrl: './jqxgrid-template.html',
    providers: [JqxGridService]
})

export class JQXGridMemberCompliance implements OnInit{

    gridData: any[];
    private el: HTMLElement;
    dashboardId1;
    dashboardId2;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    getGridHeight: any;
    enableRefreshSpinner: boolean;
    @Output() output_member = new EventEmitter();
    private postData: any = {
        "DBKey": sessionStorage["InstanceID"],
        "SubmissionID": sessionStorage.getItem('SubmissionID'),
        "ReportingID": sessionStorage.getItem('ReportingID'),
        "ProductType": sessionStorage.getItem('ProductType'),
        "ProductLine": sessionStorage.getItem('ProductLine'),
        "RunDate": sessionStorage.getItem('RunDate'),
        "TimePeriodId": sessionStorage.getItem('TimePeriodId'),
        "PracticeId": this._SharedService.getNameValue('IPA'),
        "ProviderId": this._SharedService.getNameValue('PhysicianProviderId'),
        //"pagesize": "10",
        //"pagenum": "0",
        "SubMeasureId": this._SharedService.getNameValue('SubMeasureID'),
        "WorkflowID": sessionStorage.getItem('WorkflowId'),
        "WorkflowName": sessionStorage.getItem('WorkflowName'),
        "Module": sessionStorage["Module"]
    };

    constructor(el: ElementRef, private _gridData: JqxGridService,
        private _SharedService: SharedService,
        private breadcrumbCSService: BreadcrumbCSService) {
        this.el = el.nativeElement;
        this.serverErrorMsg = _SharedService.getServerError();
        this.getGridHeight = _SharedService.getGridValue();
    }
    ngOnInit() {
        let that = this;
        that.enableRefreshSpinner = true;

        function memberName(row, cell, value) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var lnk;
            var mname = value.replace(/\s/g, '-');
            var tip = mname;
            tip = tip.split("-");
            //debugger;
            lnk = '<div style="margin-top:10px; width: 100%" data-mid=' + rowData.MId + ' data-ptype=' + rowData.PType + '  data-mname=' + mname + '  class="mid" title=' + tip[0]+"\u00A0"+tip[1]+'> <a href="javascript:void(0)" > ' + value + ' </a></div > ';
            return lnk;
        }
        function tooltiprenderer(row, cell, value) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var lnk;
            //debugger;
            lnk = '<div style="text-align: center;margin-top: 11px;" title=" '+ value +'"> <span> ' + value + ' </span></div > ';
            return lnk;
        }

        $(document).on('DOMNodeInserted', function (e) {
            $('.mid').unbind().click(function () {

                let toggleLevels: any = {
                    ShowLevel3: "none",
                    level4: false,
                    ShowLevel4: "block"
                };

                that.breadcrumbCSService.addFriendlyNameBreadcrumb('Level4', $(this).attr('data-mname').replace(/-/g, ' '));
                if (that._SharedService.getNameValue('MemberId') != $(this).attr('data-mid') ||
                    that._SharedService.getNameValue('L3PrevSubmissionID') != sessionStorage.getItem('SubmissionID') ||
                    that._SharedService.getNameValue('L3PrevReportingID') != sessionStorage.getItem('ReportingID') ||
                    that._SharedService.getNameValue('L3PrevProductType') != sessionStorage.getItem('ProductType') ||
                    that._SharedService.getNameValue('L3PrevRunDate') != sessionStorage.getItem('RunDate') ||
                    that._SharedService.getNameValue('L3TimePeriodId') != sessionStorage.getItem('TimePeriodId') ||
                    that._SharedService.getNameValue('L3PrevPracticeId') != sessionStorage.getItem('practiceId') ||
                    that._SharedService.getNameValue('L3PrevProviderId') != sessionStorage.getItem('providerId')||
                    that._SharedService.getNameValue('L3PrevWorkflowId') != sessionStorage.getItem('WorkflowId')||
                    that._SharedService.getNameValue('L3PrevWorkflowName') != sessionStorage.getItem('WorkflowName')) {
                    that._SharedService.setNameValue('MemberId', $(this).attr('data-mid'));
                    that.output_member.emit(toggleLevels);
                    setTimeout(function () {
                        toggleLevels.level4 = true;
                        that.output_member.emit(toggleLevels);
                    }, 500);
                }
                else {
                    toggleLevels.level4 = true;
                    that.output_member.emit(toggleLevels);
                }
                that._SharedService.setNameValue('L3PrevSubmissionID', sessionStorage.getItem('SubmissionID'));
                that._SharedService.setNameValue('L3PrevReportingID', sessionStorage.getItem('ReportingID'));
                that._SharedService.setNameValue('L3PrevProductType', sessionStorage.getItem('ProductType'));
                that._SharedService.setNameValue('L3PrevRunDate', sessionStorage.getItem('RunDate'));
                that._SharedService.setNameValue('L3TimePeriodId', sessionStorage.getItem('TimePeriodId'));
                that._SharedService.setNameValue('L3PrevPracticeId', sessionStorage.getItem('practiceId'));
                that._SharedService.setNameValue('L3PrevProviderId', sessionStorage.getItem('providerId'));
                that._SharedService.setNameValue('L3PrevWorkflowId', sessionStorage.getItem('WorkflowId'));
                that._SharedService.setNameValue('L3PrevWorkflowName', sessionStorage.getItem('WorkflowName'));
            })
        });        

        var changingProp = {};
        var _changingProp = [];
        var _lastFilter = [];
        let source = {
            datatype: "json",
            totalrecords: 0,
            datafields: [
                { name: 'MId', type: 'string' },
                { name: 'MActive' },
                { name: 'MName' },
                { name: 'Gen' },
                { name: 'Age', type: 'number' },
                { name: 'Phone' },
                { name: 'PType' },
                { name: 'PId' },
                { name: 'OId' },
            ],
            url: sessionStorage["Compliance"] + "/GetHedisMemberDetails",
            type: 'post',
            data: that.postData,
            filter: function () {
                var _temp = [];
                var model = {
                    Group: "AdvPracticeId",
                    ProviderID: "AdvProviderId"                    
                };
                var filterinfo = $(that.el).find("div.gridContainer").jqxGrid('getfilterinformation');
                if (filterinfo.length != 0) {
                    for (var i = 0; i < filterinfo.length; i++) {
                        var eventData = filterinfo[i].filtercolumntext;
                        eventData = eventData.replace(/ /g, '').split("(")[0];
                        eventData = model[eventData] != undefined ? model[eventData] : eventData;
                        if (changingProp[eventData] == undefined && !(_changingProp.indexOf(eventData) > -1))
                            changingProp[eventData] = that.postData[eventData];
                        _temp.push(eventData);
                        if (!(_changingProp.indexOf(eventData) > -1))
                            _changingProp.push(eventData);

                        var value = filterinfo[i].filter.getfilters()[0].value;
                        var condition = filterinfo[i].filter.getfilters()[0].condition;
                        that.postData[eventData] = eventData + '|' + value + '|' + condition;
                        if (i + 1 == filterinfo.length) {
                            if (_changingProp.length > _temp.length) {
                                for (var j = 0; j < _changingProp.length; j++) {
                                    if (!(_temp.indexOf(_changingProp[j]) > -1)) {
                                        that.postData[_changingProp[j]] = undefined;
                                        that.postData[_changingProp[j]] = changingProp[_changingProp[j]];
                                        _changingProp.splice(j, 1);
                                    }
                                }
                            }
                            if (_temp.length == 1) {
                                _lastFilter = [];
                                _lastFilter.push(_temp[0]);
                            }
                        }

                    }
                }
                else {
                    that.postData[_lastFilter[0]] = changingProp[_lastFilter[0]];
                }
                $(that.el).find("div.gridContainer").jqxGrid('updatebounddata', 'filter');
            },
            beforeSend: function (data) {                
                that.enableRefreshSpinner = true;
            },
            sort: function () {
                // update the grid and send a request to the server.
                $(that.el).find("div.gridContainer").jqxGrid('updatebounddata', 'sort');
            },
            beforeprocessing: function (data) {               
                $(that.el).find("div.gridContainer").find('.jqx-grid-pager').find('.recordsInfo').remove();
                if (data.memberInfo != null) {
                    //source.totalrecords = that._SharedService.getNameValue('DataNCM'); 
                    if (data.memberInfo[0]!=null)                  
                    source.totalrecords = parseInt(data.memberInfo[0].GridCount);
                    //if (data.memberInfo.length == 400)
                    //    $(that.el).find("div.gridContainer").find('.jqx-grid-pager').append('<span class="recordsInfo" style="padding:6px; float:left">Showing top 400 records</span>');
                }
            },
            cache: false
        };

        let dataAdapter = new $.jqx.dataAdapter(source, {            
            downloadComplete: function (data, status, xhr) {
                that.serverError = false;
                that.enableRefreshSpinner = false;
            },
            loadError: function (xhr, status, error) {
                that.serverError = true;
                that.enableRefreshSpinner = false;
            }
        });

        $(that.el).find("div.gridContainer").bind('bindingcomplete', function () {
            var localizationobj = {};            
            var stringcomparisonoperators = ['contains'];
            var numericcomparisonoperators = ['equal', 'less than or equal', 'greater than or equal'];            
            localizationobj["filterstringcomparisonoperators"] = stringcomparisonoperators;
            localizationobj["filternumericcomparisonoperators"] = numericcomparisonoperators;            
            $(that.el).find("div.gridContainer").jqxGrid('localizestrings', localizationobj);
        });

        $(that.el).find("div.gridContainer").jqxGrid({
            source: dataAdapter,
            sortable: true,
            columnsresize: true,
            width: "100%",
            height: this.getGridHeight['grid-lg-filter'],
            rowsheight: 32,
            filterable: true,
            updatefilterconditions: function (type, defaultconditions) {                
                var stringcomparisonoperators = ['CONTAINS'];
                var numericcomparisonoperators = ['EQUAL', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN_OR_EQUAL'];               
                switch (type) {
                    case 'stringfilter':
                        return stringcomparisonoperators;
                    case 'numericfilter':
                        return numericcomparisonoperators;                    
                }
            },
            updatefilterpanel: function (filtertypedropdown1, filtertypedropdown2, filteroperatordropdown, filterinputfield1, filterinputfield2, filterbutton, clearbutton,
                columnfilter, filtertype, filterconditions) {
                var index1 = 0;
                if (columnfilter != null) {
                    var filter1 = columnfilter.getfilterat(0);
                    if (filter1) {
                        index1 = filterconditions.indexOf(filter1.comparisonoperator);
                        var value1 = filter1.filtervalue;
                        filterinputfield1.val(value1);
                    }

                }
                if (filtertype == "stringfilter") {
                    filtertypedropdown1.hide();
                }
                else if (filtertype == "numericfilter") {
                    filtertypedropdown1.show();
                }
                filterinputfield1.unbind().on('keypress', function (event) {
                    var restricted = "~`!@#$%^&*()+=-[]\\\';,./{}|\":<>?";
                    if (restricted.indexOf(event.key) !== -1) {
                        return false;
                    }
                    if (filtertype == "numericfilter") {
                        var charCode = (event.which) ? event.which : event.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                            return false;
                        }
                        else {
                            return true
                        }
                    }
                    else if (filtertype == "stringfilter") {
                        return true
                    }

                });

                filtertypedropdown1.jqxDropDownList({ autoDropDownHeight: true, selectedIndex: index1 });
                filtertypedropdown2.hide();
                filteroperatordropdown.hide();
                filterinputfield2.hide();
            },
            ready: function () {
                that.enableRefreshSpinner = false;
            },
            pageable: true,
            showfilterrow: false,
            showfiltercolumnbackground: true,
            autoshowfiltericon: true,
            virtualmode: true,
            rendergridrows: function (obj) {
                return obj.data;
            },
            columns: [
                { text: 'Member ID', datafield: 'MId', align: 'center', filtertype: 'stringfilter' },
                { text: 'Member Name', datafield: 'MName', align: 'center', filtertype: 'stringfilter', cellsrenderer: memberName, width: 230 },
                { text: 'Gender', datafield: 'Gen', align: 'center', cellsalign: 'center',filtertype: 'stringfilter' },
                { text: 'Age', datafield: 'Age', align: 'center', cellsalign: 'center', filtertype: 'numericfilter'},
                { text: 'Rule Description', datafield: 'Phone', align: 'center', filtertype: 'stringfilter',cellsrenderer: tooltiprenderer },
                { text: 'Enrollment', datafield: 'MActive', align: 'center', cellsalign: 'center', filtertype: 'stringfilter', hidden: true },
                { text: 'Product Type', datafield: 'PType', align: 'center', cellsalign: 'center', filtertype: 'stringfilter',width: 230,cellsrenderer: tooltiprenderer  },
                { text: 'Provider ID', datafield: 'PId', align: 'center', cellsalign: 'center', filtertype: 'stringfilter',cellsrenderer: tooltiprenderer },
                { text: 'Group', datafield: 'OId', align: 'center', cellsalign: 'center', filtertype: 'stringfilter',cellsrenderer: tooltiprenderer }
            ]            
        });



    }
}
