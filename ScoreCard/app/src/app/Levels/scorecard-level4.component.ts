import { Component, Output, EventEmitter } from '@angular/core';
import {SharedService} from '../shared/service/shared.service';
declare var $: any;

@Component({
    selector: 'scorecard-level4',
    templateUrl: './scorecard-level4-template.html'
}) 

export class ScorecardLevel4Component{     
    @Output() output_level4 = new EventEmitter(); 
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;    
    private _downloadComplianceUrl = sessionStorage["Compliance"] + "/DownloadCareGapDetails";
     
    constructor(private _SharedService: SharedService) {
        this.serverErrorMsg = _SharedService.getServerError();
    }

    output_caregap(value) {
        this.output_level4.emit(value);
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
        $jsForm.append(fnGetInputCtl("PracticeId", this._SharedService.getNameValue('IPA')));
        $jsForm.append(fnGetInputCtl("ProviderId", this._SharedService.getNameValue('PhysicianProviderId')));
        $jsForm.append(fnGetInputCtl("WorkflowID", sessionStorage.getItem('WorkflowId')));
        $jsForm.append(fnGetInputCtl("WorkflowName", sessionStorage["WorkflowName"]));
        $jsForm.append(fnGetInputCtl("Module", sessionStorage.getItem('Module')));
        $jsForm.append(fnGetInputCtl("SubMeasureId", sessionStorage["SubMeasureID"]));
        $jsForm.append(fnGetInputCtl("MemberID", sessionStorage.getItem('MemberId')));
        $jsForm.append(fnGetInputCtl("pagesize", "1"));
        $jsForm.append(fnGetInputCtl("pagenum", "1"));
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
    }
}