import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ElementRef, trigger, state, style, transition, animate } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { FilterService } from './filters.service';
import { SharedService } from '../../shared/service/shared.service';

declare var $: any;

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'filters',
    templateUrl: './filters.template.html',
    animations: [
        trigger('enableFilter', [
            state('true', style({
                right: '0'
            })),
            transition('* => *', animate('500ms'))
        ])
    ]
})

export class Filters implements OnChanges {
    ReviewSetOptions: boolean = true;
    ProdTypeOptions: boolean = true;;
    SubmissionOptions: boolean= true;
    dynatree: boolean = true;
    ReviewSetRunDesc = "RunDescription";
    ReviewSetWorkflowName = "WorkflowName";
    ReviewSetRunDate = "RunDate";
    ReviewSetTimePeriodID = "Id";
    ReviewSetWorkflowID = "WorkflowId";
    _RunDescription;
    _WorkflowName;
    _RunDate;
    _TimePeriodId;
    _WorkflowId;
    ProductTypeName = "ProductType";    
    ProductLineName = "ProductLine";
    _ProductType;
    _ProductLine;
    SubmissionName = "SubmissionName";
    SubmissionID = "SubmissionID";
    _SubmissionName;
    _SubmissionID;
    Submission: any = {};
    _PracticeId = "All";
    _ProviderId = "All";
    //reportingProduct;
    filterService;
    filterApply;    
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    refreshGridValue: boolean = true;
    @Input() instanceid: any;
    @Input() setenvironment: boolean;
    @Input() open_filter: any;
    @Output() refreshGrid = new EventEmitter();
    loadingMsg = "Loading..!"
    vpath = $("#VirtualPath").val();
    state: boolean = false;
    private disableApplyBtn: boolean = true;
    autoApplyCountReview: number = 0;
    autoApplyCountProduct: number = 0
    autoApplyCountSubmission: number = 0
    private initRefresh: boolean;

    constructor(private _filterService: FilterService, private _SharedService: SharedService, private _href: ElementRef) {
        this.serverErrorMsg = _SharedService.getServerError();
    }

    onClick(event) {
        if (!this._href.nativeElement.contains(event.target)) {
            if (event.screenX < (window.innerWidth - 380)) {
                $(".filter-component").removeClass("show");
                this.state = false;
            }
        }
    }

    toggleState() {
        this.state = !this.state
        if (this.state)
            $(".filter-component").addClass("show");
        else
            $(".filter-component").removeClass("show"); 
    }

    ngOnChanges(changes) {
        if (changes.open_filter) {
            if (changes.open_filter.currentValue == false) {
                this.state = false;
            }
        }
        if (changes.setenvironment) {
            if (changes.setenvironment.currentValue=='true') {

                //Preventing Filters auto open by setting false
                this.state = false;
                //this.SubmissionOptions = {};
                //this.ProdTypeOptions = {};
                //this.ReviewSetOptions = {};
                //this.dynatree = false;


                //For submission ID
                for (let item of JSON.parse(sessionStorage["IntanceSubmission"])) {
                    let instancename = item.Key.split('|')[0];
                    instancename = instancename.replace(" ", "")
                    let _submission = item.Key.split('|')[1];
                    _submission = _submission.split('*');
                    let _submissionObj = {};
                    let temp = []
                    for (let _item of _submission) {
                        _item = _item.split(",");
                        _item[0] = _item[0].replace("[", "")
                        _item[1] = _item[1].replace("]", "")
                        _submissionObj['SubmissionID'] = _item[0];
                        _submissionObj['SubmissionName'] = _item[1];
                        temp.push(_submissionObj);
                        _submissionObj = {};
                    }
                    this.Submission[instancename] = temp;
                }
               // this["SubmissionOptions"] = this.Submission[sessionStorage["InstanceID"].replace(" ", "")];
                this.autoApplyCountSubmission = 0;
                this.autoApplyCountProduct = 0;
                this.autoApplyCountReview = 0;
                this.autoApplyCountSubmission++;
                this.initRefresh = true;
                //For submission ID

                //For Analysis Run
                let _dropDownUrl1 = sessionStorage["CommonServiceUrl"] + '/AnalysisRun';
                let url1Data = {"Module": sessionStorage["Module"], "DBKey":sessionStorage["InstanceID"] };
                //this.getdata(_dropDownUrl1, "ReviewSetOptions", url1Data, this.ReviewSetRunDesc);

                if (!sessionStorage.getItem('practiceId')) { sessionStorage.setItem("practiceId", this._PracticeId) }
                if (!sessionStorage.getItem('providerId')) { sessionStorage.setItem("providerId", this._ProviderId) }

                setTimeout(() => {
                   // this.dynatree = true;
                }, 500);
            }
        }
    }

    getdata(url, obj, data, displayname) {
        let temp = {};
        let tempArr = []
        temp[displayname] = this.loadingMsg;
        tempArr.push(temp);
        this[obj] = tempArr;
        if (displayname == "RunDescription") {
            this._filterService.getFilterData(url, data)
                .subscribe(
                filterService => {
                    this.autoApplyCountReview++;
                    this.filterService = filterService;
                    this[obj] = this.filterService;
                    this.serverError = false;
                },
                error => {
                    this.error = <any>error;
                    this.serverError = true;
                });
        }
        else {
            if (sessionStorage[displayname + 'Obj' + sessionStorage["Module"] + sessionStorage["SubmissionID"]] == undefined) {
                this._filterService.getFilterData(url, data)
                    .subscribe(
                    filterService => {
                        this.autoApplyCountProduct++;
                        this.filterService = filterService;
                        this[obj] = this.filterService;
                        sessionStorage[displayname + 'Obj' + sessionStorage["Module"] + sessionStorage["SubmissionID"]] = JSON.stringify(this.filterService);
                        this.serverError = false;
                    },
                    error => {
                        this.error = <any>error;
                        this.serverError = true;
                    });
            }
            else {
                this.serverError = false;
                this.autoApplyCountProduct++;
                this[obj] = JSON.parse(sessionStorage[displayname + 'Obj' + sessionStorage["Module"] + sessionStorage["SubmissionID"]]);
            }
        }
    }

    output_ReviewSet(value) {
        this._RunDescription = value['c'];
        this._WorkflowName = value['a'];
        this._RunDate = value['d'];
        this._TimePeriodId = value['e'];
        this._WorkflowId = value['b'];        
        this.enableApplyBtn();
    }

    output_ProdType(value) {        
        this._ProductType = value[this.ProductTypeName];
        this._ProductLine = value[this.ProductLineName];
        this.enableApplyBtn();
    }

    output_Submission(value) {        
        this._SubmissionID = value[this.SubmissionID];
        this._SubmissionName = value[this.SubmissionName];
        //For Product Type
        let _dropDownUrl2 = sessionStorage["CommonServiceUrl"] + '/GetSubmissionFilters';
        let url2Data = { "SubmissionID": this._SubmissionID, "ReportingID": "All", "DBKey": sessionStorage["InstanceID"] };
        //this.getdata(_dropDownUrl2, "ProdTypeOptions", url2Data, this.ProductTypeName);
        this.enableApplyBtn();
    }

    // output_dynatreeValue(value) {
    //     if (value.facility != 'All' && value.pcpNode == "") {
    //         let practiceChanged: boolean = false;
    //         let provicerChanged: boolean = false;
    //         sessionStorage.setItem("practiceName", value.facility);
    //         sessionStorage.setItem("providerName", "All");
    //         //if (sessionStorage["practiceId"] != value.facility) {
    //             //practiceChanged = true;
    //             this._PracticeId = value.facility;                
    //         //}
    //        // if (sessionStorage["providerId"] != "All") {
    //            // provicerChanged = true;
    //             this._ProviderId = "All";
    //        // }
    //         //if (practiceChanged || provicerChanged)
    //             this.enableApplyBtn();
    //         //this.gridRefresh();
    //     }

    //     else if (value.facility != 'All' && value.pcpNode != "") {
    //         let practiceChanged: boolean = false;
    //         let provicerChanged: boolean = false;
    //         sessionStorage.setItem("practiceName", value.facility);
    //         sessionStorage.setItem("providerName", value.pcpNode.split('#')[0]);
    //         value.pcpNode = value.pcpNode.split('#')[1];
    //         //if (sessionStorage["practiceId"] != value.facility) {
    //             //practiceChanged = true;
    //             this._PracticeId = value.facility;
    //         //}
    //         //if (sessionStorage["providerId"] != value.pcpNode) {
    //            // provicerChanged = true;
    //             this._ProviderId = value.pcpNode;
    //         //}
    //         //if (practiceChanged || provicerChanged)
    //             this.enableApplyBtn();
    //         //this.gridRefresh();
    //     }

    //     else if (value.facility == 'All') {
    //         sessionStorage.setItem("providerName", "All");
    //         sessionStorage.setItem("practiceName", "All");
    //         //if (sessionStorage["practiceId"] != "All") {
    //             this._PracticeId = "All";
    //             this._ProviderId = "All";
    //             //this.gridRefresh();
    //             this.enableApplyBtn();
    //         //}
    //     }
    // }

    gridRefresh() {
        this.refreshGridValue = !this.refreshGridValue;
        this.refreshGrid.emit(this.refreshGridValue);
    }

    enableApplyBtn() {
        let RunDate = this._RunDate
        if (RunDate != null && this.initRefresh) {
            this.disableApplyBtn = true;
            this.initRefresh = false;
            this.autoApply();
        }
        else {
            this.disableApplyBtn = false;
            this.autoApply();
        }
    }

    applyValues() {
        sessionStorage.setItem(this.SubmissionID, this._SubmissionID);
        sessionStorage.setItem(this.SubmissionName, this._SubmissionName);

        sessionStorage.setItem(this.ReviewSetRunDesc, this._RunDescription);//run desc
        sessionStorage.setItem(this.ReviewSetRunDate, this._RunDate);//run date
        sessionStorage.setItem("TimePeriodId", this._TimePeriodId);//time period id
        sessionStorage.setItem(this.ReviewSetWorkflowName, this._WorkflowName); // workflow Name
        sessionStorage.setItem(this.ReviewSetWorkflowID, this._WorkflowId);// workflow Id

        sessionStorage.setItem(this.ProductTypeName, this._ProductType);
        sessionStorage.setItem(this.ProductLineName, this._ProductLine);

        sessionStorage.setItem("practiceId", this._PracticeId);
        sessionStorage.setItem("providerId", this._ProviderId);

        this.disableApplyBtn = true;
        this.gridRefresh();
        this.state = true;
    }

    autoApply() {
        if (this.autoApplyCountReview >= 1 && this.autoApplyCountProduct >= 1 && this.autoApplyCountSubmission >= 1) {
            this.disableApplyBtn = true;
            this.applyValues();
            this.state = false;
            this.autoApplyCountReview = 0;
            this.autoApplyCountProduct = 0;
            this.autoApplyCountSubmission = 0;
        }
    }

}
