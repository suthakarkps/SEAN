import { Component,Output, EventEmitter} from '@angular/core';
import {BreadcrumbCSService} from './breadcrumb-cs.service';

@Component({
    selector: 'breadcrumb-cs',
    templateUrl: './breadcrumb-cs.template.html'    
})

export class BreadcrumbCSComponent{
    private levels: any;
    @Output() output_breadcrumb = new EventEmitter();
    @Output() display_level = new EventEmitter();

    constructor(private breadcrumbService: BreadcrumbCSService) { }     

    breadcrumbLevel() {        
        return this.breadcrumbService.breadcrumbLevel()
    }
    
    breadcrumbName(level) {        
        return this.breadcrumbService.breadcrumbName(level);
    }

    navigateTo(level: number) {                                  
        let toggleLevels = {
            ShowLevel0: "none",
            ShowLevel1: "none",
            ShowLevel2: "none",
            ShowLevel3: "none",
            ShowLevel4: "none",
            ShowLevel5: "none"            
        }        
        toggleLevels["Show" + this.breadcrumbLevel()[level]] = "block";
        this.output_breadcrumb.emit(toggleLevels);
        this.display_level.emit(this.breadcrumbLevel()[level]);
        this.breadcrumbService.resetBreadcrumb(level);       
    }
}
