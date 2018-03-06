//Level 5
import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { JqxGridService} from './jqxgrid.service';
import {SharedService} from '../../shared/service/shared.service';

declare var $: any

@Component({
    selector: 'jqxgrid-visit-compliance',
    templateUrl: './jqxgrid-template.html',
    providers: [JqxGridService]
})

export class JQXGridVisitCompliance implements OnInit {    
    gridData: any[];
    private el: HTMLElement;   
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;
    getGridHeight: any;
    enableRefreshSpinner: boolean;

    constructor(el: ElementRef, private _gridData: JqxGridService,        
        private _SharedService: SharedService) {
        this.el = el.nativeElement;
        this.serverErrorMsg = _SharedService.getServerError();
        this.getGridHeight = _SharedService.getGridValue();
    }
    ngOnInit() {
        let that = this;       
        let SubMeasureID = that._SharedService.getNameValue('CareGapMeasure');
        let MemberID = that._SharedService.getNameValue('MemberId'); 
        sessionStorage.setItem('MemberId', MemberID)
        sessionStorage.setItem('SubMeasureID', SubMeasureID)
        that.enableRefreshSpinner = true;        
            
            that._gridData.getVisitComplianceData(SubMeasureID, MemberID)
                .subscribe(
                gridData => {
                    that.enableRefreshSpinner = false;
                    that.gridData = gridData;
                    that.serverError = false;
                    let data: any = that.gridData;
                    let dataJson = data;
                    let _datafields = new Array();
                    let _gridcolumns = new Array();

                    function readyFunction() {
                        //source.totalrecords = 20;
                        //console.log(dataJson);
                        //if (dataJson.length == 399)
                        //    $(that.el).find('.jqx-grid-pager').append('<span style="padding:6px; float: left">Showing top 400 records</span>');
                    }

                    let source = {
                        datatye: "json",
                        //totalrecords: 0,
                        datafields: [
                            { name: 'Origin', type: 'string' },
                            { name: 'Desc', type: 'string' },
                            { name: 'ServiceDate', type: 'string' },
                            { name: 'ClaimType', type: 'string' },
                            { name: 'ClaimId', type: 'string' },
                            { name: 'ProvId', type: 'string' },
                            { name: 'ProvName', type: 'string' },
                        ],
                        //url: sessionStorage["EBMCompliance"] + "/GetHedisMemberDetails",
                        localdata: dataJson
                    };
                
                    let dataAdapter = new $.jqx.dataAdapter(source);

                    $(that.el).jqxGrid({ 
                        source: dataAdapter,
                        sortable: true,
                        enabletooltips: true,
                        columnsresize: true,
                        width: "100%",
                        height: this.getGridHeight['grid-lg-filter'],  
                        rowsheight: 30,
                        filterable: true,
                        pagesize:10,
                        ready: function () {
                            readyFunction();
                        },
                        columns: [
                            { text: 'Origin', datafield: 'Origin', width: 100, align: 'center', cellsalign: 'center', filterable: false, sortable: false, menu: false},
                            { text: 'Service Date', datafield: 'ServiceDate', width: 150, align: 'center', cellsalign: 'center'},
                            { text: 'Description', datafield: 'Desc', width: 300, align: 'center', filterable: false, sortable: false, menu: false},
                            { text: 'Claim ID', datafield: 'ClaimId', width: 150, align: 'center', cellsalign: 'center', filterable: false, sortable: false, menu: false},
                            { text: 'Qualified for', datafield: 'ClaimType', width: 150, align: 'center', cellsalign: 'center', filterable: false, sortable: false, menu: false },
                            { text: 'Servicing Provider ID', datafield: 'ProvId', width: 200, align: 'center', cellsalign: 'center', filterable: false, sortable: false, menu: false},
                            { text: 'Servicing Provider Name', datafield: 'ProvName', align: 'center', filterable: false, sortable: false, menu: false}
                        ],
                        pageable: true,
                        showfilterrow: true,
                        autoshowfiltericon: true,
                        //virtualmode: false,
                        //rendergridrows: function (obj) {
                        //    return obj.data;
                        //},
                    });
                },
                error => {
                    that.error = <any>error;
                    that.serverError = true;
                    that.enableRefreshSpinner = false;
                }
            );
       
    }
}
