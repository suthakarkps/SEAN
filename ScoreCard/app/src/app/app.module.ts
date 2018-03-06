import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { HeaderComponent } from './header/header.component';
import { ScorecardLevel0Component } from './levels/scorecard-level0.component';
import { ScorecardLevel1Component } from './levels/scorecard-level1.component';
import { ScorecardLevel2Component } from './levels/scorecard-level2.component';
import { ScorecardLevel3Component } from './levels/scorecard-level3.component';
import { ScorecardLevel4Component } from './levels/scorecard-level4.component';
import { ScorecardLevel5Component } from './levels/scorecard-level5.component';

import { Filters } from './shared/filters/filters.component';
import { SelectedFilters } from './shared/filters/selected-filters.component';
import { FilterService } from './shared/filters/filters.service';
import { DropdownSearchFilterPipe } from './shared/form-elements/dropdown-search.pipe';
import { DropdownSearch } from './shared/form-elements/dropdown-search.component';

import { DynaTree } from './shared/dynatree/dynatree.component';
import { DynaTreeLocal } from './shared/dynatree/dynatree-local.component';
import { SparkLine } from './shared/sparkline/sparkline.component';
import { JQXGridCompliance } from './shared/jqwidgets/jqxgrid-compliance.component'
import { JQXGridPhysicianCompliance } from './shared/jqwidgets/jqxgrid-physician-compliance.component'
import { JQXGridMemberCompliance } from './shared/jqwidgets/jqxgrid-member-compliance.component'
import { JQXGridCaregapCompliance } from './shared/jqwidgets/jqxgrid-caregap-compliance.component'
import { JQXGridVisitCompliance } from './shared/jqwidgets/jqxgrid-visit-compliance.component'


import { BreadcrumbCSComponent } from './shared/breadcrumb-cs/breadcrumb-cs.component';
import { BreadcrumbCSService } from './shared/breadcrumb-cs/breadcrumb-cs.service';

import { SharedService } from './shared/service/shared.service';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        ScorecardLevel0Component,
        ScorecardLevel1Component,
        ScorecardLevel2Component,
        ScorecardLevel3Component,
        ScorecardLevel4Component,
        ScorecardLevel5Component,
        Filters,
        SelectedFilters,
        DropdownSearch,
        DropdownSearchFilterPipe,
        DynaTree,
        DynaTreeLocal,
        SparkLine,
        JQXGridCompliance,
        JQXGridPhysicianCompliance,
        JQXGridMemberCompliance,
        JQXGridCaregapCompliance,
        JQXGridVisitCompliance,
        BreadcrumbCSComponent,
        FooterComponent
    ],
    providers: [AppService, BreadcrumbCSService, SharedService, FilterService],
    bootstrap: [AppComponent]
})
export class AppModule { }
