import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';
import { SharedService } from '../shared/service/shared.service';
//import { JqxGridService } from '../shared/jqwidgets/jqxgrid.service';
declare var $: any;

@Component({
    selector: 'scorecard-level1',
    templateUrl: './scorecard-level1-template.html'
    //,providers: [JqxGridService]
})

export class ScorecardLevel1Component implements OnInit {
    widgetLists: any[];
    InstanceID: any;
    SetEnvironment;
    refreshGridValue: boolean;
    enableFilter: boolean = false;
    refreshSpinner: boolean;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    openFilter: boolean;
    compliance: boolean = false;
    @Output() output_level1 = new EventEmitter();
    @Output() output_level1_filter = new EventEmitter();
    private _downloadComplianceUrl = sessionStorage["Compliance"] + "/DownloadMeasureDetails";

    constructor(
        private _widgetLists: AppService,
        //private _gridData: JqxGridService,
        private _SharedService: SharedService
    ) {
        this.serverErrorMsg = _SharedService.getServerError();
        setInterval(() => {
            this.InstanceID = sessionStorage["InstanceID"];
            this.SetEnvironment = sessionStorage['SetEnvironment'];
        }, 100);
    }
    ngOnInit(): void {
        let dashboardId = this._SharedService.getNameValue('DashboardId');
        if (dashboardId == undefined) {
            dashboardId = 4;
            this._SharedService.setNameValue('DashboardId', dashboardId);
        }
        let serviceType = "Dashboard";
        let baseMeasureId = null;
        if (dashboardId == 4) {
            this.enableFilter = true;
            this.compliance = true;
            this.refreshSpinner = true;
        }
        else {
            this._widgetLists.getWidgets(dashboardId, serviceType, baseMeasureId)
                .subscribe(widgetLists => {
                    this.widgetLists = widgetLists;
                },
                error => {
                    this.error = <any>error;
                    this.serverError = true;
                });
        }
    }

    refreshGrid(value) {
        this.refreshSpinner = true;
        this.refreshGridValue = value;
        this.output_level1_filter.emit(value);
    }
    open_filter(value) {
        this.openFilter = value;
    }

    output_compliance(value) {
        this.output_level1.emit(value);
    }

    exportExcel() {
        var FileErrorSummary = {}, $this = $(event.target).closest("a");
        var $jsForm = $('<form></form>').attr('action', this._downloadComplianceUrl).attr('method', 'post');
        $jsForm.append(fnGetInputCtl("DBKey", sessionStorage["InstanceID"]));
        $jsForm.append(fnGetInputCtl("SubmissionID", sessionStorage.getItem('SubmissionID')));
        $jsForm.append(fnGetInputCtl("ReportingID", sessionStorage.getItem('ReportingID')));
        $jsForm.append(fnGetInputCtl("ProductType", sessionStorage.getItem('ProductType')));
        $jsForm.append(fnGetInputCtl("ProductLine", sessionStorage["ProductLine"]));
        $jsForm.append(fnGetInputCtl("RunDate", sessionStorage.getItem('RunDate')));
        $jsForm.append(fnGetInputCtl("TimePeriodId", sessionStorage["TimePeriodId"]));
        $jsForm.append(fnGetInputCtl("PracticeId", sessionStorage.getItem('practiceId')));
        $jsForm.append(fnGetInputCtl("ProviderId", sessionStorage["providerId"]));
        $jsForm.append(fnGetInputCtl("WorkflowID", sessionStorage.getItem('WorkflowId')));
        $jsForm.append(fnGetInputCtl("WorkflowName", sessionStorage["WorkflowName"]));
        $jsForm.append(fnGetInputCtl("Module", sessionStorage.getItem('Module')));
        $jsForm.append(fnGetInputCtl("Submission", sessionStorage["SubmissionName"]));
        $jsForm.append(fnGetInputCtl("ReviewSet", sessionStorage.getItem('WorkflowName') + ' - ' + sessionStorage.getItem('RunDescription')));
        $jsForm.append(fnGetInputCtl("GroupProvider", sessionStorage.getItem('practiceName') + ' / ' + sessionStorage.getItem('providerName')));
        $jsForm.appendTo('body').submit().remove();
        function fnGetInputCtl(name, val) {
            var $jInp = $("<input>");
            $jInp.attr('name', name);
            $jInp.attr('value', val);
            return $jInp;
        }


        //this._gridData.downloadComplianceData()
        //    .subscribe(data => {                
        //        this.serverError = false;
        //    },
        //    error => {                
        //        this.error = <any>error;
        //    });
    }
}
