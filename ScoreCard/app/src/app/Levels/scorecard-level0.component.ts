import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';
import {BreadcrumbCSService} from '../shared/breadcrumb-cs/breadcrumb-cs.service';
import {SharedService} from '../shared/service/shared.service';

@Component({
    selector: 'scorecard-level0',
    templateUrl: './scorecard-level0-template.html'
})

export class ScorecardLevel0Component implements OnInit {
    dashboardLists: any[];    
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    private spinner: boolean = false;

    @Output() output_level0= new EventEmitter;

    constructor(private breadcrumbCSService: BreadcrumbCSService, private _dashboardLists: AppService, private _SharedService: SharedService) {
        this.serverErrorMsg = _SharedService.getServerError();
    }

    ngOnInit(): void {
        //this.spinner = true;
        //this._dashboardLists.getList()
        //    .subscribe(
        //    dashboardLists => {       
        //        this.serverError = false;         
        //        this.dashboardLists = dashboardLists;
        //        if (this.dashboardLists.length == 1) {
        //            let enableLevels = {
        //                ShowLevel0: "none",
        //                level1: true,
        //                ShowLevel1: "block"
        //            }
        //            this.output_level0.emit(enableLevels);
        //            this.breadcrumbCSService.addFriendlyNameBreadcrumb('Level1', 'EBM Compliance');
        //            this.spinner = false;
        //        }
        //        else {
        //            this.spinner = false;
        //            this.breadcrumbCSService.addFriendlyNameBreadcrumb('Level0', 'EBM');
        //        }             
        //    },
        //    error => {
        //        //this.error = <any>error;
        //        //this.serverError = true;
        //        let enableLevels = {
        //            ShowLevel0: "none",
        //            level1: true,
        //            ShowLevel1: "block"
        //        }
        //        this.output_level0.emit(enableLevels);
        //        this.breadcrumbCSService.addFriendlyNameBreadcrumb('Level1', 'EBM Compliance');
        //        this.spinner = false;
        //    });        

        let enableLevels = {
            ShowLevel0: "none",
            level1: true,
            ShowLevel1: "block"
        }
        this.output_level0.emit(enableLevels);
        this.breadcrumbCSService.addFriendlyNameBreadcrumb('Level1', 'Scorecard');
        this.spinner = false;
    }

    next(DashboardId: number, DashboardName: string): void {        
        this._SharedService.setNameValue('Level1Name', DashboardName)
        this._SharedService.setNameValue('DashboardId', DashboardId);
        this.breadcrumbCSService.addFriendlyNameBreadcrumb('Level1', this._SharedService.getNameValue('Level1Name'));        
        let enableLevels = {
            ShowLevel0: "none",
            level1: true,
            ShowLevel1:"block"
        }
        this.output_level0.emit(enableLevels);
    }
}