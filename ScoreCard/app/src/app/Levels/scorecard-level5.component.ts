import { Component} from '@angular/core';
import {SharedService} from '../shared/service/shared.service';
declare var $: any;
@Component({
    selector: 'scorecard-level5',
    templateUrl: './scorecard-level5-template.html'
})

export class ScorecardLevel5Component {
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    private _downloadComplianceUrl = sessionStorage["Compliance"] + "/DownloadVisitDetails";    

    constructor(private _SharedService: SharedService) {
        this.serverErrorMsg = _SharedService.getServerError();
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
        $jsForm.append(fnGetInputCtl("pagesize", "10"));
        $jsForm.append(fnGetInputCtl("pagenum", "0"));
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