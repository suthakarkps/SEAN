import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private refreshSelectedFilters: any;
    private level0: boolean = true;
    private level1 = false;
    private level2; level3; level4; level5: boolean = false;
    private selectedFiltersOn: boolean = false;
    private ShowLevel0: string = "block";
    private ShowLevel1; ShowLevel2; ShowLevel3; ShowLevel4; ShowLevel5: string = "none";
    serverError: boolean = false;
    error: any;
   
ngOnInit() {}
    output_level0(value) {
        sessionStorage['helpVariable'] = "compliance";
        this.level1 = value.level1;
        this.toggleLevel(value);
    }
    output_level1_filter(value) {
        this.selectedFiltersOn = true;
        this.refreshSelectedFilters = value;
    }
    output_level1(value) {
        if (value.level2) {
            sessionStorage['helpVariable'] = "physician";
            this.level2 = value.level2;
            this.toggleLevel(value);
        }
        else{
            this.level2 = value.level2;
        }
        if (value.level3) {
            sessionStorage['helpVariable'] = "member";
            this.level3 = value.level3;
            this.toggleLevel(value);
        }
        else{
            this.level3 = value.level3;
        }
    }
    output_level2(value) {
        sessionStorage['helpVariable'] = "member";
        this.level3 = value.level3;
        this.toggleLevel(value);
    }
    output_level3(value) {
        sessionStorage['helpVariable'] = "caregap";
        this.level4 = value.level4;
        this.toggleLevel(value);
    }
    output_level4(value) {
        sessionStorage['helpVariable'] = "visit";
        this.level5 = value.level5;
        this.toggleLevel(value);
    }

    toggleLevel(value) {
        this.ShowLevel0 = value.ShowLevel0 || "none";
        this.ShowLevel1 = value.ShowLevel1 || "none";
        this.ShowLevel2 = value.ShowLevel2 || "none";
        this.ShowLevel3 = value.ShowLevel3 || "none";
        this.ShowLevel4 = value.ShowLevel4 || "none";
        this.ShowLevel5 = value.ShowLevel5 || "none";
    }

    output_breadcrumb(value) {
        this.toggleLevel(value);
    }
    display_level(value) {
        if (value == "Level1") {
            sessionStorage['helpVariable'] = "compliance";  
        }
        if (value == "Level2") {
            sessionStorage['helpVariable'] = "physician";    
        }
        if (value == "Level3") {
            sessionStorage['helpVariable'] = "member";  
        }
        if (value == "Level4") {
            sessionStorage['helpVariable'] = "caregap"; 
        }
        if (value == "Level5") {
            sessionStorage['helpVariable'] = "visit";
        }
    }
}
