//Level 2
import { Component, ElementRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { JqxGridService } from './jqxgrid.service';
import { SharedService } from '../../shared/service/shared.service';
import { BreadcrumbCSService } from '../../shared/breadcrumb-cs/breadcrumb-cs.service';

declare var $: any

@Component({
    selector: 'jqxgrid-physician-compliance',
    templateUrl: './jqxgrid-template.html',
    providers: [JqxGridService]
})

export class JQXGridPhysicianCompliance implements OnInit {

    subMeasureID: any;
    enableRefreshSpinner: boolean;
    gridData: any[];
    private el: HTMLElement;
    dataarray: any[];
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    getGridHeight: any;
    @Output() output_physician = new EventEmitter();
    private postData: any = {
        "DBKey": sessionStorage["InstanceID"],
        "SubmissionID": sessionStorage.getItem('SubmissionID'),
        "ReportingID": sessionStorage.getItem('ReportingID'),
        "ProductType": sessionStorage.getItem('ProductType'),
        "ProductLine": sessionStorage.getItem('ProductLine'),
        "RunDate": sessionStorage.getItem('RunDate'),
        "TimePeriodId": sessionStorage.getItem('TimePeriodId'),
        "PracticeId": sessionStorage.getItem('practiceId'),
        "ProviderId": sessionStorage.getItem('providerId'),
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
        that.serverError = false;


        function hedisNumberFormatter(row, cell, value) {
            var number;
            if (value == "0") {
                number = "0";
            } else {
                number = commaSeparateNumber(value);
            }
            return "<div style='text-align: right;margin-top: 11px;'>" + number + "</div>";
        }

        function hedisElgblNumberFormatter(row, cell, value) {
            var number;
            if (value == "0") {
                number = "0";
            }
            else {
                number = value;
                number = commaSeparateNumber(value);
            }
            return "<div style='text-align: right;margin-top: 11px;'>" + number + "</div>";;
        }

        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return val;
        }

        function percintileFormatter(row, columnfield, value) {
            var bencmark = value;
            var percentiles = bencmark.split('th')[0];
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var percentile = '<div class="easy-pie-chart-percentage" id="' + rowData.Indicator + 'Pie"   data-percent="' + percentiles + '"  data-row="' + row + '"  " data-size="29" title="" style = "margin-left: 45px;margin-top:3px" > <span class="percent" > ' + percentiles + '</span></div > ';
            return percentile;
        }

        // Sparkline Trend
        var TrendFormatter = function (row, column, value, defaulthtml) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var html = "<div  style='width:80px;text-align:center; margin-top:8px' id='Trend-Physician" + row + "' data-row='" + row + "' data-value='" + value + "' data-date='" + rowData.TrendDate + "'  class= 'ColumnTrendPhysician' >" + value + "</div>";
            return html;
        };

        function Trend(id, chartValue, charttype, ToolValue, heightValue, widthValue, TrendDate) {
            if (TrendDate != undefined) {
                var trendArray = new Array;
                var newTrendDate = TrendDate.split('|');
                chartValue = chartValue.split(',');
                for (var i = 0; i < chartValue.length; i++) {
                    var trendValue = parseFloat(chartValue[i]).toFixed(2);
                    trendArray.push(trendValue);
                }
            }

            $(id).empty().sparkline(trendArray, {
                fillColor: 'transparent', type: charttype,
                tooltipFormat: '{{offset:offset}} : {{value}}%',
                tooltipValueLookups: {
                    'offset': newTrendDate
                },
                chartRangeMin: 0, chartRangeMax: 100,
                height: heightValue, width: widthValue, barWidth: 8, barColor: '#3366cc',

                zeroColor: 'grey', zeroAxis: false
            });
        }

        function createColumnTrend($element) {
            var id = $element.attr('data-row');
            var chartValue = $('#Trend-Physician' + id).attr('data-value');
            var chartDate = $('#Trend-Physician' + id).attr('data-date');
            Trend('#Trend-Physician' + id, chartValue, 'bar', null, 25, 50, chartDate);
        }

        function rateFormatter(row) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var rate2 = '<span style="color:Gray; font-size:10.45px;">' + rowData.MLogic + '</span>';
            var rate1 = '<span style="color:' + rowData.RColor + '">' + rowData.Rate + '</span></br>';
            return '<div style="margin-top: 3px;text-align: center;">' + rate1 + rate2 + '</div>';
        }

        function ncmFormatter(row, cell, value) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var lnk;
            rowData.OId = rowData.OId.replace(/\s/g, '-');
            rowData.PName = rowData.PName.replace(/\s/g, '-');
            if (value != 0) {
                lnk = '<div style="margin-top:10px;text-align: right; margin-right: 10px" data-ipa = ' + rowData.OId + ' data-pid=' + rowData.PId + '   data-pname=' + rowData.PName + '   data-NCM=' + rowData.NCMemCnt + ' class="ncm" > <a href="javascript:void(0)" > ' + commaSeparateNumber(value) + ' </a></div> ';
            } else {
                lnk = '<div  style="text-align: right;margin-top: 10px; margin-right:10px"><span>' + value + '</span></div>';
            }
            return lnk;
        }

        function hTargetFormatter(row, cell, value) {
            return '<div style="margin-top: 11px;text-align: center;">' + value + '</div>';
        }
        function PNameFormatter(row, cell, value) {
            value = value.replace(/-/g, ' ');
            return '<div style="margin-top: 11px;">' + value + '</div>';
        }

        $(document).on('DOMNodeInserted', function (e) {
            if ($(e.target).is('.ColumnTrendPhysician')) {
                createColumnTrend($(e.target));
            }
            /**/
            $('.ncm').unbind().click(function () {

                let toggleLevels: any = {
                    ShowLevel2: "none",
                    level3: false,
                    ShowLevel3: "block"
                };
                that.breadcrumbCSService.addFriendlyNameBreadcrumb('Level3', $(this).attr('data-pname').replace(/-/g, ' '));
                if (that._SharedService.getNameValue('IPA') != $(this).attr('data-ipa').replace(/-/g, ' ') ||
                    that._SharedService.getNameValue('PhysicianProviderId') != $(this).attr('data-pid') ||
                    that._SharedService.getNameValue('PrevSubmeasureID') != that._SharedService.getNameValue('SubMeasureID') ||
                    that._SharedService.getNameValue('L2PrevSubmissionID') != sessionStorage.getItem('SubmissionID') ||
                    that._SharedService.getNameValue('L2PrevReportingID') != sessionStorage.getItem('ReportingID') ||
                    that._SharedService.getNameValue('L2PrevProductType') != sessionStorage.getItem('ProductType') ||
                    that._SharedService.getNameValue('L2PrevRunDate') != sessionStorage.getItem('RunDate') ||
                    that._SharedService.getNameValue('L2PrevTimePeriodId') != sessionStorage.getItem('TimePeriodId') ||
                    that._SharedService.getNameValue('L2PrevPracticeId') != sessionStorage.getItem('practiceId') ||
                    that._SharedService.getNameValue('L2PrevProviderId') != sessionStorage.getItem('providerId') ||
                    that._SharedService.getNameValue('L2PrevWorkflowId') != sessionStorage.getItem('WorkflowId') ||
                    that._SharedService.getNameValue('L2PrevWorkflowName') != sessionStorage.getItem('WorkflowName')) {
                    that._SharedService.setNameValue('IPA', $(this).attr('data-ipa').replace(/-/g, ' '));
                    that._SharedService.setNameValue('PhysicianProviderId', $(this).attr('data-pid'));
                    that._SharedService.setNameValue('DataNCM', $(this).attr('data-NCM'));
                    that.output_physician.emit(toggleLevels);
                    setTimeout(function () {
                        toggleLevels.level3 = true;
                        that.output_physician.emit(toggleLevels);
                    }, 500);
                }
                else {
                    toggleLevels.level3 = true;
                    that.output_physician.emit(toggleLevels);
                }
                that._SharedService.setNameValue('PrevSubmeasureID', that._SharedService.getNameValue('SubMeasureID'));
                that._SharedService.setNameValue('L2PrevSubmissionID', sessionStorage.getItem('SubmissionID'));
                that._SharedService.setNameValue('L2PrevReportingID', sessionStorage.getItem('ReportingID'));
                that._SharedService.setNameValue('L2PrevProductType', sessionStorage.getItem('ProductType'));
                that._SharedService.setNameValue('L2PrevRunDate', sessionStorage.getItem('RunDate'));
                that._SharedService.setNameValue('L2PrevTimePeriodId', sessionStorage.getItem('TimePeriodId'));
                that._SharedService.setNameValue('L2PrevPracticeId', sessionStorage.getItem('practiceId'));
                that._SharedService.setNameValue('L2PrevProviderId', sessionStorage.getItem('providerId'));
                that._SharedService.setNameValue('L2PrevWorkflowId', sessionStorage.getItem('WorkflowId'));
                that._SharedService.setNameValue('L2PrevWorkflowName', sessionStorage.getItem('WorkflowName'));
            })
        });

        function piechart() {
            $('.easy-pie-chart-percentage').each(function (i, val) {
                var $box = $(this);
                var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
                var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
                var size = parseInt($(this).data('size')) || 50;
                var percentile = parseInt(val.innerText);
                if (percentile >= 75) {
                    $(this).easyPieChart({
                        barColor: '#387c2c',
                        trackColor: trackColor,
                        scaleColor: false,
                        lineCap: 'butt',
                        lineWidth: (size / 11),
                        animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
                        size: size
                    });
                }
                if (percentile < 75 && percentile > 50) {
                    $(this).easyPieChart({
                        barColor: '#df7a1c',
                        trackColor: trackColor,
                        scaleColor: false,
                        lineCap: 'butt',
                        lineWidth: (size / 11),
                        animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
                        size: size
                    });
                } else {
                    $(this).easyPieChart({
                        barColor: '#e1523d',
                        trackColor: trackColor,
                        scaleColor: false,
                        lineCap: 'butt',
                        lineWidth: (size / 11),
                        animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
                        size: size
                    });
                }
            });
        }

        var changingProp = {};
        var _changingProp = [];
        var _lastFilter = [];

        let source = {
            datatype: "json",
            totalrecords: 0,
            datafields: [
                { name: 'MId', type: 'string' },
                { name: 'SubMId', type: 'string' },
                { name: 'SubMDesc' },
                { name: 'EMemCnt', type: 'number' },
                { name: 'Trend', type: 'string' },
                { name: 'TrendDate' },
                { name: 'CMemCnt', type: 'number' },
                { name: 'Rate', type: 'number' },
                { name: 'Pmet' },
                { name: 'RColor' },
                { name: 'MLogic' },
                { name: 'Target', type: 'number' },
                { name: 'Benchmark' },
                { name: 'OId', type: 'string' },
                { name: 'PId', type: 'string' },
                { name: 'PName', type: 'string' },
                { name: 'NCMemCnt', type: 'number' }

            ],
            url: sessionStorage["Compliance"] + "/GetHedisPhysicianDetails",
            type: 'post',
            data: that.postData,
            filter: function () {
                var _temp = [];
                var model = {
                    Group: "PracticeId",
                    ProviderID: "ProviderId",
                    Provider: "ProviderName"
                };
                var filterinfo = $(that.el).find("div.gridContainer").jqxGrid('getfilterinformation');
                if (filterinfo.length != 0) {
                    for (var i = 0; i < filterinfo.length; i++) {
                        var eventData = filterinfo[i].filtercolumntext;
                        eventData = eventData.replace("-", "");
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
            sort: function () {
                // update the grid and send a request to the server.
                $(that.el).find("div.gridContainer").jqxGrid('updatebounddata', 'sort');
            },
            beforeSend: function (data) {
                that.enableRefreshSpinner = true;
            },
            beforeprocessing: function (data) {
                $(that.el).find("div.gridContainer").find('.jqx-grid-pager').find('.recordsInfo').remove();
                if (data.ProviderCompliance != null && data.ProviderCompliance[0] != null) {
                    source.totalrecords = parseInt(data.ProviderCompliance[0].GridCount);
                    //if (data.ProviderCompliance.length == 400)
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
        //$(that.el).find("div.gridContainer").jqxGrid.on("pagechanged", function (event) {
        //    alert(1);
        //    var args = event.args;
        //    var pagenum = args.pagenum;
        //    var pagesize = args.pagesize;
        //    var paginginfo = $(that.el).find("div.gridContainer").jqxGrid('getpaginginformation');
        //    alert(paginginfo);
        //    var getpagerRightBtn = $(this).find('#pager').find('.jqx-icon-arrow-right').parent(),
        //        getpagerLeftBtn = $(this).find('#pager').find('.jqx-icon-arrow-left').parent()
        //});

        $(that.el).find("div.gridContainer").bind('bindingcomplete', function () {
            var localizationobj = {};
            //let filterstringcomparisonoperators = ['empty', 'not empty', 'contains', 'contains(match case)', 'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)', 'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'];
            var stringcomparisonoperators = ['contains'];
            var numericcomparisonoperators = ['equal', 'less than or equal', 'greater than or equal'];
            //filterdatecomparisonoperators = ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'];
            //filterbooleancomparisonoperators = ['equal', 'not equal'];

            localizationobj["filterstringcomparisonoperators"] = stringcomparisonoperators;
            localizationobj["filternumericcomparisonoperators"] = numericcomparisonoperators;
            //localizationobj.filterdatecomparisonoperators = filterdatecomparisonoperators;
            //localizationobj.filterbooleancomparisonoperators = filterbooleancomparisonoperators;

            // apply localization.
            $(that.el).find("div.gridContainer").jqxGrid('localizestrings', localizationobj);
        });


        //********************************FILTER ON ENTER KEY***************************//

        // $(that.el).find("div.gridContainer").keypress(function (event) {
        //    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
        //    if (key == 13) {
        //        var model = {
        //            IPA: "PracticeId",
        //            ProviderID: "ProviderId",
        //            Provider: "ProviderName"                    
        //        };
        //        var filterinfo =  $(that.el).find("div.gridContainer").jqxGrid('getfilterinformation');
        //        for (var i = 0; i < filterinfo.length; i++) {
        //            var eventData = filterinfo[i].filtercolumntext;
        //            var value = filterinfo[i].filter.getfilters()[0].value;
        //            var condition = filterinfo[i].filter.getfilters()[0].condition;                    
        //            that.postData[eventData] = eventData + '|' + value + '|' + condition;
        //            console.log(that.postData);
        //        }
        //         $(that.el).find("div.gridContainer").jqxGrid('updatebounddata', 'filter');
        //    }
        //});

        $(that.el).find("div.gridContainer").jqxGrid({
            source: dataAdapter,
            sortable: true,
            columnsresize: true,
            enabletooltips: true,
            width: "100%",
            height: this.getGridHeight['grid-lg'] + 32,
            rowsheight: 40,
            filterable: true,


            updatefilterconditions: function (type, defaultconditions) {
                //var stringcomparisonoperators = ['EMPTY', 'NOT_EMPTY', 'CONTAINS', 'CONTAINS_CASE_SENSITIVE','DOES_NOT_CONTAIN', 'DOES_NOT_CONTAIN_CASE_SENSITIVE', 'STARTS_WITH', 'STARTS_WITH_CASE_SENSITIVE','ENDS_WITH', 'ENDS_WITH_CASE_SENSITIVE', 'EQUAL', 'EQUAL_CASE_SENSITIVE', 'NULL', 'NOT_NULL'];
                var stringcomparisonoperators = ['CONTAINS'];
                var numericcomparisonoperators = ['EQUAL', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN_OR_EQUAL'];
                //var datecomparisonoperators = ['EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'NULL', 'NOT_NULL'];
                //var booleancomparisonoperators = ['EQUAL', 'NOT_EQUAL'];
                switch (type) {
                    case 'stringfilter':
                        return stringcomparisonoperators;
                    case 'numericfilter':
                        return numericcomparisonoperators;
                    //case 'datefilter':
                    // return datecomparisonoperators;
                    //case 'booleanfilter':
                    // return booleancomparisonoperators;
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
            virtualmode: true,
            rendergridrows: function (obj) {                return obj.data;            },
            showfilterrow: false,
            showfiltercolumnbackground: true,
            autoshowfiltericon: true,
            columns: [
                { text: "Group", datafield: "OId", align: 'center', cellsalign: 'left', filtertype: 'stringfilter' },
                { text: "Provider ID", datafield: "PId", align: 'center', cellsalign: 'left', width: 100, filtertype: 'stringfilter' },
                { text: "Provider", datafield: "PName", align: 'center', cellsalign: 'left', width: 180, cellsrenderer: PNameFormatter, filtertype: 'stringfilter' },
                { text: "Eligible Members", datafield: "EMemCnt", align: 'center', cellsalign: 'center', width: 135, cellsrenderer: hedisElgblNumberFormatter, filtertype: 'numericfilter', enabletooltips: false },
                { text: "Compliant Members", datafield: "CMemCnt", align: 'center', cellsalign: 'center', width: 165, cellsrenderer: hedisNumberFormatter, filtertype: 'numericfilter', enabletooltips: false },
                { text: "Trend", datafield: "Trend", align: 'center', cellsalign: 'center', width: 80, cellsrenderer: TrendFormatter, filterable: false, sortable: false, menu: false, enabletooltips: false },
                { text: "Rate (%)", datafield: "Rate", align: 'center', cellsalign: 'center', width: 125, cellsrenderer: rateFormatter, filtertype: 'numericfilter', enabletooltips: false },
                { text: "Target", datafield: "Target", align: 'center', cellsalign: 'center', width: 90, cellsrenderer: hTargetFormatter, filtertype: 'numericfilter', enabletooltips: false },
                { text: "Percentile Met", datafield: "Pmet", align: 'center', cellsalign: 'center', width: 125, cellsrenderer: percintileFormatter, filterable: false, sortable: false, menu: false, enabletooltips: false },
                { text: "Non-Compliant Members", datafield: "NCMemCnt", align: 'center', cellsalign: 'center', width: 180, cellsrenderer: ncmFormatter, filtertype: 'numericfilter', enabletooltips: false }
            ]


        });


    }
}
