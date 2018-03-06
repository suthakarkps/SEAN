//Level 1
import { Component, ElementRef, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { JqxGridService } from './jqxgrid.service';
import { SharedService } from '../../shared/service/shared.service';
import { BreadcrumbCSService } from '../../shared/breadcrumb-cs/breadcrumb-cs.service';

declare var $: any

@Component({
    selector: 'jqxgrid-compliance',
    templateUrl: './jqxgrid-template.html',
    providers: [JqxGridService]
})

export class JQXGridCompliance implements OnChanges {

    @Input() gridRefresh: any;
    @Input() refreshSpinner: any;
    gridData: any[];
    private el: HTMLElement;
    dashboardId;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    enableRefreshSpinner: boolean = false;
    getGridHeight: any;
    @Output() output_compliance = new EventEmitter();
    private source: any = {};
    private dataAdapter;
    //@Output() output_compliance_open_filter = new EventEmitter();


    constructor(el: ElementRef, private _gridData: JqxGridService,
        private _SharedService: SharedService,
        private breadcrumbCSService: BreadcrumbCSService) {
        this.el = el.nativeElement;
        this.serverErrorMsg = _SharedService.getServerError();
        this.getGridHeight = _SharedService.getGridValue();

    }

    ngOnChanges(gridRefresh) {
        this.getGridData();
    }
    getGridData() {
        if (this.refreshSpinner) {
            this.enableRefreshSpinner = this.refreshSpinner;
        }
        //this.output_compliance_open_filter.emit(true);
        this.dashboardId = this._SharedService.getNameValue('DashboardId');
        let SubmissionID = sessionStorage.getItem('SubmissionID');
        let ReportingID = sessionStorage.getItem('ReportingID');
        let ProductType = sessionStorage.getItem('ProductType');
        let ProductLine = sessionStorage.getItem('ProductLine');
        let RunDate = sessionStorage.getItem('RunDate');
        let practiceId = sessionStorage.getItem('practiceId');
        let providerId = sessionStorage.getItem('providerId');
        if ((ReportingID == "No data") || (ProductType == "No data") || (ProductLine == "No data") || (RunDate == "No data")) {
            this.gridData = [];
            this.gridForamatter(this.gridData);
        }
        //else if ((InstanceID != null) && (ReportingID != null && ReportingID != "No data") && (ProductType != null && ProductType != "No data") && (ProductLine != null) && (RunDate != null && RunDate != "No data") && (practiceId != null) && (providerId != null)) {
        else if ((SubmissionID != null) && (RunDate != null && RunDate != "No data")) {
            if (ReportingID == null || ReportingID != "No data")
                sessionStorage.setItem("ReportingID", "All");
            if (ProductType == null || ProductType == "No data")
                sessionStorage.setItem("ProductType", "All");
            if (ProductLine == null || ProductLine == "No data")
                sessionStorage.setItem("ProductLine", "All");
            if (practiceId == null || practiceId == "No data")
                sessionStorage.setItem("practiceId", "All");
            if (providerId == null || providerId == "No data")
                sessionStorage.setItem("providerId", "All");

            this._gridData.getComplianceData()
                .subscribe(
                gridData => {
                    this.gridData = gridData;
                    this.serverError = false;
                    this.gridForamatter(this.gridData);
                },
                error => {
                    this.error = <any>error;
                    this.serverError = true;
                    this.enableRefreshSpinner = false;
                }

                );
        }
        $(function () { $('.jqx-menu-vertical').css('top', '180px !important') })
    }

    destroy() {
        let that = this;
        $(that.el).find("div.gridContainer").jqxGrid('destroy');
        $(that.el).find("div.gridContainer").remove();
        that.source.localdata = null;
        that.source = null;
        that.dataAdapter = null;
    }

    gridForamatter(gridData) {
        let that = this;
        that.destroy();
        //that.output_compliance_open_filter.emit(false);        
        that.enableRefreshSpinner = false;
        let data: any = gridData;
        let dataJson = data;
        let _datafields = new Array();
        let _gridcolumns = new Array();

        function measureFormatter(row, cell, value) {
            return '<div style="margin-top:11px;text-align:center" >' + value + '</div>';
        }

        function subMeasureFormatter(row, cell, value) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var tabName = rowData.SubMDesc + rowData.SubMID + ')';
            var submeasure = '<div title="' + rowData.SubMDesc + ' (' + rowData.SubMId + ')' + '"  style="margin-top:10px;width:100%" class="subMeasure" id="' + rowData.SubMId + '" data-desc="' + rowData.SubMDesc + '" ><a >' + rowData.SubMDesc + ' (' + rowData.SubMId + ')</a></div>';
            return submeasure;
        }

        function hedisNumberFormatter(row, cell, value) {
            var number;
            if (value == "0") {
                number = "0";
            } else {
                number = commaSeparateNumber(value);
            }
            return "<div style='text-align: right;margin-top: 11px;'>" + number + "</div>";
        }
        function NcompliantFormatter(row, cell, value) {
            var number;
            if (value == "0") {
                //debugger;
                number = "0";
                var NCompliant = '<div style="text-align: right;margin-top: 11px;" class="NCompliant" ><span>' + number + '</span></div>';
                $('.NCompliant').click(function(){return false;});
            } else {
                 var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
                 var tabName = rowData.NCMemCnt + rowData.NCMemCnt + ')';
                 var NCompliant = '<div style="text-align: right;margin-top: 11px;" class="NCompliant" id="' + rowData.SubMId + '" data-desc="' + rowData.NCMemCnt + '" ><a >' + rowData.NCMemCnt + '</a></div>';
                 //title = "' + rowData.NCMemCnt + ' (' + rowData.NCMemCnt + ')' + '" 
            }
            return NCompliant;
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
            return "<div style='text-align: right;margin-top: 11px;'>" + number + "</div>";
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
            var percentile = '<div class="easy-pie-chart-percentage easyPieChart" id="' + row + 'Pie"   data-percent="' + percentiles + '"  data-row="' + row + '"  " data-size="29" title=""><span class="percent">' + percentiles + '</span></div>';
            return percentile;
        }

        // Sparkline Trend
        var TrendFormatter = function (row, column, value, defaulthtml) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var html = "<div   style='width:80px;text-align:center; margin-top: 8px'  id='Trend-Compliance" + row + "' data-row='" + row + "' data-value='" + value + "'  class= 'ColumnTrendCompliance' >" + value + "</div>";
            return html;

        };

        $(document).on('DOMNodeInserted', function (e) {
            if ($(e.target).is('.ColumnTrendCompliance')) {
                createColumnTrend($(e.target));
            }
            else if ($(e.target.children).is('.ColumnTrendCompliance')) {
                createColumnTrend($(e.target.children[0]));
            }
            /**/
            if ($(e.target).is('.easy-pie-chart-percentage')) {
                createHedisPiechart($(e.target));
            }
            /**/
            /**/
            $('.NCompliant').unbind().click(function () {
                var toggleLevels: any = {
                    ShowLevel1: "none",
                    level3: false,
                    ShowLevel3: "block"
                };
                that.breadcrumbCSService.addFriendlyNameBreadcrumb('Level3', $(this).attr('id'));
                //$(this).attr('data-desc')                
                if (that._SharedService.getNameValue('SubMeasureID') != $(this).attr('id') ||
                    that._SharedService.getNameValue('PrevSubmissionID') != sessionStorage.getItem('SubmissionID') ||
                    that._SharedService.getNameValue('PrevReportingID') != sessionStorage.getItem('ReportingID') ||
                    that._SharedService.getNameValue('PrevProductType') != sessionStorage.getItem('ProductType') ||
                    that._SharedService.getNameValue('PrevRunDate') != sessionStorage.getItem('RunDate') ||
                    that._SharedService.getNameValue('PrevTimePeriodId') != sessionStorage.getItem('TimePeriodId') ||
                    that._SharedService.getNameValue('PrevWorkflowId') != sessionStorage.getItem('WorkflowId') ||
                    that._SharedService.getNameValue('PrevWorkflowName') != sessionStorage.getItem('WorkflowName') ||
                    that._SharedService.getNameValue('PrevIPA') != sessionStorage.getItem('practiceId') ||
                    that._SharedService.getNameValue('PrevPhysicianProviderId') != sessionStorage.getItem('providerId')||
                    that._SharedService.getNameValue('PrevIPA') != that._SharedService.getNameValue('IPA') ||
                    that._SharedService.getNameValue('PrevPhysicianProviderId') != that._SharedService.getNameValue('PhysicianProviderId')
                    ) {
                    that._SharedService.setNameValue('SubMeasureID', $(this).attr('id'));
                    that._SharedService.setNameValue('IPA', sessionStorage.getItem('practiceId'));
                    that._SharedService.setNameValue('PhysicianProviderId', sessionStorage.getItem('providerId'));
                    that.output_compliance.emit(toggleLevels);
                    setTimeout(function () {
                        toggleLevels.level3 = true;
                        that.output_compliance.emit(toggleLevels);
                    }, 500);
                } else {
                    toggleLevels.level3 = true;
                    that.output_compliance.emit(toggleLevels);
                }
                that._SharedService.setNameValue('PrevSubmissionID', sessionStorage.getItem('SubmissionID'));
                that._SharedService.setNameValue('PrevReportingID', sessionStorage.getItem('ReportingID'));
                that._SharedService.setNameValue('PrevProductType', sessionStorage.getItem('ProductType'));
                that._SharedService.setNameValue('PrevRunDate', sessionStorage.getItem('RunDate'));
                that._SharedService.setNameValue('PrevTimePeriodId', sessionStorage.getItem('TimePeriodId'));
                that._SharedService.setNameValue('PrevWorkflowId', sessionStorage.getItem('WorkflowId'));
                that._SharedService.setNameValue('PrevWorkflowName', sessionStorage.getItem('WorkflowName'));
                that._SharedService.setNameValue('PrevIPA', sessionStorage.getItem('practiceId'));
                that._SharedService.setNameValue('PrevPhysicianProviderId', sessionStorage.getItem('providerId'));
            })
            /**/

            $('.subMeasure').unbind().click(function () {
                var toggleLevels: any = {
                       ShowLevel1: "none",
                       level2: false,
                       ShowLevel2: "block"
                  };
                that.breadcrumbCSService.addFriendlyNameBreadcrumb('Level2', $(this).attr('id'));
                //$(this).attr('data-desc')                
                if (that._SharedService.getNameValue('SubMeasureID') != $(this).attr('id') ||
                    that._SharedService.getNameValue('PrevSubmissionID') != sessionStorage.getItem('SubmissionID') ||
                    that._SharedService.getNameValue('PrevReportingID') != sessionStorage.getItem('ReportingID') ||
                    that._SharedService.getNameValue('PrevProductType') != sessionStorage.getItem('ProductType') ||
                    that._SharedService.getNameValue('PrevRunDate') != sessionStorage.getItem('RunDate') ||
                    that._SharedService.getNameValue('PrevTimePeriodId') != sessionStorage.getItem('TimePeriodId') ||
                    that._SharedService.getNameValue('PrevPracticeId') != sessionStorage.getItem('practiceId') ||
                    that._SharedService.getNameValue('PrevProviderId') != sessionStorage.getItem('providerId') ||
                    that._SharedService.getNameValue('PrevWorkflowId') != sessionStorage.getItem('WorkflowId') ||
                    that._SharedService.getNameValue('PrevWorkflowName') != sessionStorage.getItem('WorkflowName')) {
                    that._SharedService.setNameValue('SubMeasureID', $(this).attr('id'));
                    that.output_compliance.emit(toggleLevels);
                    setTimeout(function () {
                        toggleLevels.level2 = true;
                        that.output_compliance.emit(toggleLevels);
                    }, 500);
                } else {
                    toggleLevels.level2 = true;
                    that.output_compliance.emit(toggleLevels);
                }
                that._SharedService.setNameValue('PrevSubmissionID', sessionStorage.getItem('SubmissionID'));
                that._SharedService.setNameValue('PrevReportingID', sessionStorage.getItem('ReportingID'));
                that._SharedService.setNameValue('PrevProductType', sessionStorage.getItem('ProductType'));
                that._SharedService.setNameValue('PrevRunDate', sessionStorage.getItem('RunDate'));
                that._SharedService.setNameValue('PrevTimePeriodId', sessionStorage.getItem('TimePeriodId'));
                that._SharedService.setNameValue('PrevPracticeId', sessionStorage.getItem('practiceId'));
                that._SharedService.setNameValue('PrevProviderId', sessionStorage.getItem('providerId'));
                that._SharedService.setNameValue('PrevWorkflowId', sessionStorage.getItem('WorkflowId'));
                that._SharedService.setNameValue('PrevWorkflowName', sessionStorage.getItem('WorkflowName'));
            })
            /**/
        })

        function Trend(id, chartValue, charttype, ToolValue, heightValue, widthValue, TrendDate) {
            var trendArray = new Array;
            var newTrendDate = TrendDate.split('|');
            chartValue = chartValue.split(',');
            for (var i = 0; i < chartValue.length; i++) {
                var trendValue = parseFloat(chartValue[i]).toFixed(2);
                trendArray.push(trendValue);
            }
            $(id).empty().sparkline(trendArray, {
                fillColor: 'transparent', type: charttype,
                tooltipFormat: '{{offset:offset}} : {{value}}%',
                tooltipValueLookups: {
                    'offset': newTrendDate
                },
                chartRangeMin: 0, chartRangeMax: 100,
                height: heightValue, width: widthValue, barWidth: 8, barColor: '#3366cc', zeroColor: 'grey', zeroAxis: false
            });
        }

        function createColumnTrend($element) {
            var id = $element.attr('data-row');
            var chartValue = $('#Trend-Compliance' + id).attr('data-value');
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', id);
            Trend('#Trend-Compliance' + id, chartValue, 'bar', null, 25, 50, rowData.TrendDate);
        }

        function rateFormatter(row) {
            var rowData = $(that.el).find("div.gridContainer").jqxGrid('getrowdata', row);
            var rate2 = '<span style="color:Gray; font-size:10.45px;">' + rowData.MLogic + '</span>';
            var rate1 = '<span style="color:' + rowData.RColor + '"> ' + rowData.Rate + '</span></br>';
            return '<div style="margin-top: 3px;text-align: center;">' + rate1 + rate2 + '</div>';
        }

        function hTargetFormatter(row, cell, value) {
            return '<div style="margin-top: 11px;text-align: center;">' + value + '</div>';
        }

        var datainStatusBar = function () {
            var updateddatainfo = $(that.el).find("div.gridContainer").jqxGrid('getdatainformation');
            $('#sBar' + that.el).text('Total Records : ' + updateddatainfo.rowscount);
        };

        function createHedisPiechart($element) {
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


        that.source = {
            datatye: "json",
            //datafields: _datafields,
            datafields: [
                { name: 'MId', type: 'string' },
                { name: 'SubMId', type: 'string' },
                { name: 'SubMDesc' },
                { name: 'EMemCnt', type: 'number' },
                { name: 'CMemCnt', type: 'number' },
                { name: 'NCMemCnt', type: 'number' },
                { name: 'Trend', type: 'string' },
                { name: 'TrendDate' },
                { name: 'Rate', type: 'number' },
                { name: 'Target', type: 'number' },
                { name: 'Pmet' },
                { name: 'RColor' },
                { name: 'MLogic' }
            ],
            localdata: dataJson
        };
        that.dataAdapter = new $.jqx.dataAdapter(that.source);

        $(that.el).find('.gridContainerParent').append("<div class='gridContainer'></div>")
        $(that.el).find("div.gridContainer").jqxGrid({
            source: that.dataAdapter,
            sortable: true,
            columnsresize: true,
            enabletooltips: true,
            width: "100%",
            height: this.getGridHeight['grid-lg'] + 32,
            rowsheight: 40,
            filterable: true,
            pageable: true,
            showfilterrow: true,
            autoshowfiltericon: true,
            columns: [
                { text: "Measure", datafield: "MId", align: 'center', cellsalign: 'center', cellsrenderer: measureFormatter, width: 100, filtertype: 'textbox', enabletooltips: false },
                { text: "Sub-Measure", datafield: "SubMDesc", align: 'center', cellsalign: 'center', cellsrenderer: subMeasureFormatter,filtertype: 'textbox', enabletooltips: false },
                { text: "Eligible Members", datafield: "EMemCnt", align: 'center', cellsalign: 'center', cellsrenderer: hedisElgblNumberFormatter, width: 135, filtertype: 'number', enabletooltips: false },
                { text: "Compliant Members", datafield: "CMemCnt", align: 'center', cellsalign: 'center', cellsrenderer: hedisNumberFormatter, width: 145, filtertype: 'number', enabletooltips: false },
                { text: "Non-Compliant Members", datafield: "NCMemCnt", align: 'center', cellsalign: 'center', cellsrenderer: NcompliantFormatter, width: 178, filtertype: 'number', enabletooltips: false },
                { text: "Trend", datafield: "Trend", align: 'center', cellsalign: 'center', cellsrenderer: TrendFormatter, width: 80, filterable: false, sortable: false, menu: false, enabletooltips: false },
                { text: "Rate %", datafield: "Rate", align: 'center', cellsalign: 'center', cellsrenderer: rateFormatter, width: 100, filtertype: 'number', enabletooltips: false },
                { text: "Target", datafield: "Target", align: 'center', cellsalign: 'center', width: 100, cellsrenderer: hTargetFormatter, filtertype: 'number', enabletooltips: false },
                { text: "Percentile Met", datafield: "Pmet", align: 'center', cellsalign: 'center',width: 130,cellsrenderer: percintileFormatter, filtertype: 'checkedlist', menu: false, enabletooltips: false }
            ]
        });
    }
}
