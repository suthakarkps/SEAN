import { Component, Output, EventEmitter} from '@angular/core';
import {SharedService} from '../shared/service/shared.service';

@Component({
    selector: 'scorecard-level3',
    templateUrl: './scorecard-level3-template.html'
})

export class ScorecardLevel3Component{
    @Output() output_level3 = new EventEmitter;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;  

    constructor(private _SharedService: SharedService) {
        this.serverErrorMsg = _SharedService.getServerError();
    }
        
    output_member(value) {         
        this.output_level3.emit(value);
    }
}