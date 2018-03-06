import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';
import {SharedService} from '../shared/service/shared.service';

@Component({
    selector: 'scorecard-level2',
    templateUrl: './scorecard-level2-template.html',   
})

export class ScorecardLevel2Component implements OnInit { 
    
    private physician: boolean;
    private serverError: boolean = false;
    private serverErrorMsg: any;
    private error: any;
    private widgetLists: any[];
    @Output() output_level2 = new EventEmitter();

    constructor(      
        private _widgetLists: AppService,
        private _SharedService: SharedService
    ) { this.serverErrorMsg = _SharedService.getServerError(); }

    ngOnInit(): void {
        
            let dashboardId = this._SharedService.getNameValue('DashboardId');
            let subMeasureID = this._SharedService.getNameValue('SubMeasureID')
            let serviceType = "Widget";
            let baseMeasureId = this._SharedService.getNameValue('HcXAxisname');      
                    
            if (isNaN(subMeasureID)) {
                this.physician = true;
            }
            else {
                this.physician = false;                 

                this._widgetLists.getWidgets(dashboardId, serviceType, baseMeasureId)
                    .subscribe(widgetLists => {                       
                        this.widgetLists = widgetLists;
                        this.serverError = false;
                        },
                    error => {
                        this.error = <any>error;
                        this.serverError = true;
                    });
              }
        
    }
    output_physician(value) {
        this.output_level2.emit(value);
    } 

   
}