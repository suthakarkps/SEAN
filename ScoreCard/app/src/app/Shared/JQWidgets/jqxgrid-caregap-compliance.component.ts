//Level 4
import { Component, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JqxGridService} from './jqxgrid.service'
import {SharedService} from '../../shared/service/shared.service';
import {BreadcrumbCSService} from '../../shared/breadcrumb-cs/breadcrumb-cs.service';

declare var $: any

@Component({
    selector: 'jqxgrid-caregap-compliance',
    templateUrl: './jqxgrid-template.html',
    providers: [JqxGridService]
})

export class JQXGridCaregapCompliance implements OnInit {
    gridData: any[];
    private el: HTMLElement;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    getGridHeight: any;
    enableRefreshSpinner: boolean;
    @Output() output_caregap = new EventEmitter();

    constructor(el: ElementRef, private _gridData: JqxGridService,
        private _SharedService: SharedService,
        private breadcrumbCSService: BreadcrumbCSService) {
        this.el = el.nativeElement;
        this.serverErrorMsg = _SharedService.getServerError();
        this.getGridHeight = _SharedService.getGridValue();
    }
    ngOnInit() {
        let that = this;
        let MemberID = that._SharedService.getNameValue('MemberId');
        let SubMeasureID = that._SharedService.getNameValue('SubMeasureID');
        sessionStorage.setItem('MemberId', MemberID)
        sessionStorage.setItem('SubMeasureID', SubMeasureID)
        that.enableRefreshSpinner = true;

        that._gridData.getCaregapComplianceData(SubMeasureID, MemberID)
            .subscribe(
            gridData => {
                that.enableRefreshSpinner = false;
                that.gridData = gridData;
                that.serverError = false;
                let data: any = that.gridData;
                let dataJson = data;
                let _datafields = new Array();
                let _gridcolumns = new Array();

                let source = {
                    datatye: "json",
                    datafields: [
                        { name: 'DomainID' },
                        { name: 'MeasureDescription' },
                        { name: 'SubMeasureDescription' },
                        { name: 'SubMeasureStatus', type: 'number' },
                        { name: 'SubMeasureId' },
                        { name: 'BaseMeasureID' },
                        { name: 'Age' },
                        { name: 'Gender' }
                    ],
                    localdata: dataJson
                };

                function Status_formatter(row, cell, value) {
                    var status;
                    if (value == "0") {
                        status = "<i class='fa fa-thumbs-down bigger-140 red' style='margin: 10px auto 0; display: block; height: 24px; width: 24px' title='Non-Compliant'></i>";
                    }
                    else {
                        status = "<i class='fa fa-thumbs-up bigger-140 green' style='margin: 10px auto 0; display: block; height: 24px; width: 24px' title='Compliant'></i>";
                    }
                    return status;
                };
                function Measure(row, cell, value) {

                    var measureValue0 = value.split(" - ")[0];
                    var measureValue1 = value.split(" - ")[1];
                    var measureValue1 = measureValue1.replace(/\s/g, '-')
                    var rowData = $(that.el).jqxGrid('getrowdata', row);
                    var measure;
                    measure = '<div style="margin-top:10px;" data-measureValue0=' + measureValue0 + '  data-measureValue1=' + measureValue1 + '  class="measure" ><a href="javascript:void(0)">' + value + '</a></div>';
                    return measure;
                }

                $(document).on('DOMNodeInserted', function (e) {

                    $('.measure').unbind().click(function () {
                        let toggleLevels: any = {
                            ShowLevel4: "none",
                            level5: false,
                            ShowLevel5: "block"
                        };
                        
                        that.breadcrumbCSService.addFriendlyNameBreadcrumb('Level5', $(this).attr('data-measureValue1').replace(/-/g, ' ') + ' - Visit Details');
                        if (that._SharedService.getNameValue('CareGapMeasure') != $(this).attr('data-measureValue0') ||
                            that._SharedService.getNameValue('PrevMemberId') != that._SharedService.getNameValue('MemberId') ||
                            that._SharedService.getNameValue('L4PrevSubmissionID') != sessionStorage.getItem('SubmissionID') ||
                            that._SharedService.getNameValue('L4PrevReportingID') != sessionStorage.getItem('ReportingID') ||
                            that._SharedService.getNameValue('L4PrevProductType') != sessionStorage.getItem('ProductType') ||
                            that._SharedService.getNameValue('L4PrevRunDate') != sessionStorage.getItem('RunDate') ||
                            that._SharedService.getNameValue('L4TimePeriodId') != sessionStorage.getItem('TimePeriodId') ||
                            that._SharedService.getNameValue('L4PrevPracticeId') != sessionStorage.getItem('practiceId') ||
                            that._SharedService.getNameValue('L4PrevProviderId') != sessionStorage.getItem('providerId') ||
                            that._SharedService.getNameValue('L4PrevWorkflowId') != sessionStorage.getItem('WorkflowId') ||
                            that._SharedService.getNameValue('L4PrevWorkflowName') != sessionStorage.getItem('WorkflowName')) {
                            that._SharedService.setNameValue('CareGapMeasure', $(this).attr('data-measureValue0'));
                            that.output_caregap.emit(toggleLevels);
                            setTimeout(function () {
                                toggleLevels.level5 = true;
                                that.output_caregap.emit(toggleLevels);
                            }, 500);
                        }
                        else {
                            toggleLevels.level5 = true;
                            that.output_caregap.emit(toggleLevels);
                        }
                        that._SharedService.setNameValue('PrevMemberId', that._SharedService.getNameValue('MemberId'));

                        that._SharedService.setNameValue('L4PrevSubmissionID', sessionStorage.getItem('SubmissionID'));
                        that._SharedService.setNameValue('L4PrevReportingID', sessionStorage.getItem('ReportingID'));
                        that._SharedService.setNameValue('L4PrevProductType', sessionStorage.getItem('ProductType'));
                        that._SharedService.setNameValue('L4PrevRunDate', sessionStorage.getItem('RunDate'));
                        that._SharedService.setNameValue('L4TimePeriodId', sessionStorage.getItem('TimePeriodId'));
                        that._SharedService.setNameValue('L4PrevPracticeId', sessionStorage.getItem('practiceId'));
                        that._SharedService.setNameValue('L4PrevProviderId', sessionStorage.getItem('providerId'));
                        that._SharedService.setNameValue('L4PrevWorkflowId', sessionStorage.getItem('WorkflowId'));
                        that._SharedService.setNameValue('L4PrevWorkflowName', sessionStorage.getItem('WorkflowName'));
                    })
                });

                let dataAdapter = new $.jqx.dataAdapter(source);

                $(that.el).jqxGrid({
                    source: dataAdapter,
                    sortable: true,
                    columnsresize: true,
                    enabletooltips: true,
                    width: "100%",
                    height: this.getGridHeight['grid-lg-filter'],
                    rowsheight: 30,
                    filterable: true,
                    columns: [
                        { text: 'Measure', datafield: 'BaseMeasureID', width: 200, align: 'center', cellsalign: 'center', filtertype: 'textbox', filtercondition: 'contains' },
                        { text: 'Sub-Measure Name', align: 'center', datafield: 'SubMeasureDescription', filtercondition: 'contains', filtertype: 'textbox', cellsrenderer: Measure },
                        { text: 'Status', datafield: 'SubMeasureStatus', align: 'center', width: 100, cellsalign: 'center', filterable: false, sortable: false, menu: false, cellsrenderer: Status_formatter }
                    ],
                    pageable: true,
                    showfilterrow: true,
                    autoshowfiltericon: true
                });
            },
            error => {
                that.error = <any>error;
                that.serverError = true;
                that.enableRefreshSpinner = false;
            });

    }
}