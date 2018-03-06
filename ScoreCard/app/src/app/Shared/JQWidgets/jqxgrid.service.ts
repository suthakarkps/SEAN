import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {SharedService} from '../../shared/service/shared.service'; 

@Injectable()
export class JqxGridService {
    //private _gridDataUrl = sessionStorage["EBMAnalytics"] + "/GridControl";
    //private _downloadExcelUrl = sessionStorage["EBMAnalytics"] + "/DownloadReport";
    private _gridComplianceUrl = sessionStorage["Compliance"] + "/GetMeasureDetails";
    private _gridProviderComplianceUrl = sessionStorage["Compliance"] + "/GetHedisPhysicianDetails";
    private _gridMemberComplianceUrl = sessionStorage["Compliance"] + "/GetHedisMemberDetails";
    private _gridCaregapComplianceUrl = sessionStorage["Compliance"] + "/GetHedisCareGapDetails";
    private _gridVisitComplianceUrl = sessionStorage["Compliance"] + "/RetrieveMemberVisitDetails"; 
    private _downloadComplianceUrl = sessionStorage["Compliance"] + "/DownloadMeasureDetails";    

    constructor(private http: Http, private _SharedService: SharedService) { }

    //getGridData(WidgetId: number, BaseMeasureId: string): Observable<any[]> {
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });
    //    let body = { "WidgetId": WidgetId, "BaseMeasureId": BaseMeasureId };        
    //    return this.http.post(this._gridDataUrl, body, headers)
    //        .map((res: Response) => res.json()).catch(this.handleError);
    //}

    //downloadExcel(columnName: string, IPA: string, BaseMeasureId: string): Observable<any[]> {
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });
    //    let body = { "columnName": columnName, "IPA": IPA, "BaseMeasureId": BaseMeasureId };             
    //    return this.http.post(this._downloadExcelUrl, body, headers)
    //        .map((res: Response) => res.json()).catch(this.handleError);
    //}


    getComplianceData(): Observable<any[]> {       
      
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = {
            "DBKey": sessionStorage["InstanceID"],
            "SubmissionID": sessionStorage.getItem('SubmissionID'),
            "ReportingID": sessionStorage.getItem('ReportingID'),
            "ProductType": sessionStorage.getItem('ProductType'),
            "ProductLine": sessionStorage.getItem('ProductLine'),
            "RunDate": sessionStorage.getItem('RunDate'),
            "TimePeriodId": sessionStorage.getItem('TimePeriodId'),            
            "PracticeId": sessionStorage.getItem('practiceId'),
            "ProviderId": sessionStorage.getItem('providerId'),
            "WorkflowID": sessionStorage.getItem('WorkflowId'),
            "WorkflowName": sessionStorage.getItem('WorkflowName'),
            //"pagesize": "1",
            //"pagenum": "1",
            "Module": sessionStorage["Module"]
        };            
        return this.http.post(this._gridComplianceUrl, body, options).map((res: Response) => res.json()).catch(this.handleError);
    }

    //downloadComplianceData(): Observable<any[]> {

    //    let headers = new Headers({ 'Content-Type': 'application/octet-stream', 'Accept': 'application/xls' });
    //    let options = new RequestOptions({ headers: headers });
    //    let body = {
    //        "DBKey": sessionStorage["InstanceID"],
    //        "SubmissionID": sessionStorage.getItem('SubmissionID'),
    //        "ReportingID": sessionStorage.getItem('ReportingID'),
    //        "ProductType": sessionStorage.getItem('ProductType'),
    //        "ProductLine": sessionStorage.getItem('ProductLine'),
    //        "RunDate": sessionStorage.getItem('RunDate'),
    //        "TimePeriodId": sessionStorage.getItem('TimePeriodId'),
    //        "PracticeId": sessionStorage.getItem('practiceId'),
    //        "ProviderId": sessionStorage.getItem('providerId'),
    //        "WorkflowID": sessionStorage.getItem('WorkflowId'),
    //        "WorkflowName": sessionStorage.getItem('WorkflowName'),
    //        //"pagesize": "1",
    //        //"pagenum": "1",
    //        "Module": sessionStorage["Module"],
    //        "Submission": sessionStorage.getItem('SubmissionName'),
    //        "ReviewSet": sessionStorage.getItem('WorkflowName') + ' - ' + sessionStorage.getItem('RunDescription'),
    //        "GroupProvider": sessionStorage.getItem('practiceName') + ' / ' + sessionStorage.getItem('providerName')
    //    };
    //    debugger;
    //    return this.http.post(this._downloadComplianceUrl, body, {responseType: ResponseContentType.Blob })
    //        .map((res: Response) => {
    //            var fileBlob = new Blob([res['_body']], { type: 'application/vnd.ms-excel' })
    //            if (navigator.appVersion.toString().indexOf('.NET') > 0)
    //                window.navigator.msSaveBlob(fileBlob, 'compliance report.xls');
    //            else{
    //                let link = document.createElement("a");
    //                document.body.appendChild(link);
    //                link.style.display = "none";                    
    //                //var blob = new Blob([res['_body']], { type: 'text/csv' })                
    //                var url = window.URL.createObjectURL(fileBlob);
    //                //window.open(url);
    //                link.href = url;
    //                link.download = "compliance report.xls";
    //                link.click();
    //            }
    //        }).catch(this.handleError);
    //    //return this.http.post(this._downloadComplianceUrl, body, options).map((res: Response) => res.json()).catch(this.handleError);
    //}

    //getProviderComplianceData(SubMeasureID: any): Observable<any[]> {
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });
    //    let body = {
    //        "SubmissionID": sessionStorage.getItem('SubmissionID'), "ReportingID": sessionStorage.getItem('ReportingID'),
    //        "ProductType": sessionStorage.getItem('ProductType'), "ProductLine": sessionStorage.getItem('ProductLine'),
    //        "RunDate": sessionStorage.getItem('RunDate'), "PracticeId": sessionStorage.getItem('practiceId'),
    //        "ProviderId": sessionStorage.getItem('providerId'), "pagesize": "1",
    //        "pagenum": "1", "SubMeasureId": SubMeasureID
    //    };       
        
    //    return this.http.post(this._gridProviderComplianceUrl, body, headers)
    //        .map((res: Response) => res.json()).catch(this.handleError);
    //}

    //getMemberComplianceData(SubMeasureID: any): Observable<any[]> {
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });
    //    let body = {
    //        "SubmissionID": sessionStorage.getItem('SubmissionID'), "ReportingID": sessionStorage.getItem('ReportingID'),
    //        "ProductType": sessionStorage.getItem('ProductType'), "ProductLine": sessionStorage.getItem('ProductLine'),
    //        "RunDate": sessionStorage.getItem('RunDate'), "PracticeId": this._SharedService.getNameValue('IPA'),
    //        "ProviderId": this._SharedService.getNameValue('PhysicianProviderId'), "pagesize": "1",
    //        "pagenum": "1", "SubMeasureId": SubMeasureID
    //    };         
    //    return this.http.post(this._gridMemberComplianceUrl, body, headers)
    //        .map((res: Response) => res.json()).catch(this.handleError);
    //}

    getCaregapComplianceData(SubMeasureID: any, MemberID: any): Observable<any[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = {
            "DBKey": sessionStorage["InstanceID"],
            "SubmissionID": sessionStorage.getItem('SubmissionID'),
            "ReportingID": sessionStorage.getItem('ReportingID'),
            "ProductType": sessionStorage.getItem('ProductType'),
            "ProductLine": sessionStorage.getItem('ProductLine'),
            "RunDate": sessionStorage.getItem('RunDate'),
            "TimePeriodId": sessionStorage.getItem('TimePeriodId'),
            "PracticeId": this._SharedService.getNameValue('IPA'),
            "ProviderId": this._SharedService.getNameValue('PhysicianProviderId'),
            "WorkflowID": sessionStorage.getItem('WorkflowId'),
            "WorkflowName": sessionStorage.getItem('WorkflowName'),
            "Module": sessionStorage["Module"],
            "pagesize": "1",
            "pagenum": "1",
            "SubMeasureId": SubMeasureID,
            "MemberID": MemberID            
        };            
        return this.http.post(this._gridCaregapComplianceUrl, body, options)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    getVisitComplianceData(SubMeasureID: any, MemberID: any): Observable<any[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = {
            "DBKey": sessionStorage["InstanceID"],
            "SubmissionID": sessionStorage.getItem('SubmissionID'),
            "ReportingID": sessionStorage.getItem('ReportingID'),
            "ProductType": sessionStorage.getItem('ProductType'),
            "ProductLine": sessionStorage.getItem('ProductLine'),
            "RunDate": sessionStorage.getItem('RunDate'),
            "TimePeriodId": sessionStorage.getItem('TimePeriodId'),
            "PracticeId": this._SharedService.getNameValue('IPA'),
            "ProviderId": this._SharedService.getNameValue('PhysicianProviderId'),
            "pagesize": "10",
            "pagenum": "0",
            "SubMeasureId": SubMeasureID,
            "MemberID": MemberID,
            "Module": sessionStorage["Module"],
            "WorkflowID": sessionStorage.getItem('WorkflowId'),
            "WorkflowName": sessionStorage.getItem('WorkflowName')
        };        
        return this.http.post(this._gridVisitComplianceUrl, body, options)
            .map((res: Response) => res.json()).catch(this.handleError);
    }    

    private handleError(error: Response) {
        console.error(error.status + ',' + error.statusText);
        return Observable.throw(error.json().error || 'Server Error');

    }
} 
