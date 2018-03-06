import { Component, OnChanges, Input } from '@angular/core';
import { SharedService } from '../../shared/service/shared.service';
import { BreadcrumbService } from '../../shared/breadcrumb/breadcrumb.service';


@Component({
    selector: 'selected-filters',
    templateUrl: './selected-filters.template.html'

})
export class SelectedFilters implements OnChanges {
    private selectedItems: any;
    @Input() refresh: any;
    constructor() {
        sessionStorage.setItem("providerName", "All");
        sessionStorage.setItem("practiceName", "All");
    }
    ngOnChanges() {
        this.selectedItems = [
            { key: "Submission", value: sessionStorage.getItem('SubmissionName') },
            //{ key: "Reporting Population", value: sessionStorage.getItem('ReportingID') },
            //{ key: "Reporting Product", value: sessionStorage.getItem('ProductLine') },
            { key: "Product Type", value: sessionStorage.getItem('ProductType') },
            { key: "Review Set", value: sessionStorage.getItem('WorkflowName') + ' - ' + sessionStorage.getItem('RunDescription') },
            { key: "Group/Provider", value: sessionStorage.getItem('practiceName') + ' / ' + sessionStorage.getItem('providerName') }
        ]
        if (sessionStorage.getItem('RunDescription') == "No data") {
            this.selectedItems[2].value = sessionStorage.getItem('RunDescription');
        }
    }

}