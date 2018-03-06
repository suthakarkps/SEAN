import { Component, Input, OnInit, Pipe, ElementRef } from '@angular/core';
import 'rxjs/Rx';  
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HCService } from './hc.service';
import {SharedService} from '../service/shared.service';
 
declare var $: any

@Component({
    selector: 'hc-fixed-column',
    templateUrl: './hc-template.html',
    providers: [HCService]
})

export class HcFixedColumn {    

    @Input() widget: any;
    widgetHC: any;
    private el: HTMLElement;
    enableHC: boolean = true;
    getNoDataValue: string;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;

    constructor(
        private _widgetHC: HCService,
        el: ElementRef,       
        private _SharedService: SharedService,
        private route: ActivatedRoute,
        private router: Router)
    {
        this.el = el.nativeElement;
        this.getNoDataValue = _SharedService.getValue();
        this.serverErrorMsg = _SharedService.getServerError(); 
    }

    ngOnInit(): void {
            
        let that = this;        
        let dashboardId;
        let _Level1HCUrl = sessionStorage["Analytics"] + that.widget.dataUrl;  

        this.route.params.forEach((params: Params) => {
            dashboardId = params['dashboardId'];
        });            
            let routeValue = '/list/' + dashboardId+'/'+ that.widget.widgetId;                        
            that._widgetHC.getLevel1HCData(_Level1HCUrl,that.widget.widgetId)
                .subscribe(widgetHC => {
                    that.widgetHC = widgetHC;                    
                    this.serverError = false;          

                    let size = { 'sm': 150, 'md': 200, 'mdlg': 250, 'lg': 300 }
                    let height = that.widget.rowClassSettings;
                    if ((this.widgetHC.series).length >= 2) {
                        this.enableHC = true;
                        that.widgetHC.series[0].data.forEach((value, index) => {
                            if (value != null)
                                that.widgetHC.series[0].data[index] =parseFloat(value);
                            else
                                that.widgetHC.series[0].data[index]= null;
                        });
                        that.widgetHC.series[1].data.forEach((value, index) => {
                            if (value != null)
                                that.widgetHC.series[1].data[index] = parseFloat(value);
                            else
                                that.widgetHC.series[1].data[index] = null;;
                        });
                        $(that.el).find('div.highchart-container').highcharts({
                            chart: { type: 'column', height: size[height] },
                            credits: false,
                            title: {
                                text: ''
                            },
                            legend: {
                                enabled: true
                            },
                            yAxis: {

                                title: {
                                    text: that.widgetHC.yAxisText
                                }
                            },
                            tooltip: {
                                shared: true
                            },
                            xAxis: {
                                categories: that.widgetHC.xAxisData,
                            },
                            plotOptions: {
                                column: {
                                    grouping: false,
                                    shadow: false,
                                    borderWidth: 0
                                },
                                series: {
                                    cursor: 'pointer',
                                    point: {
                                        events: {
                                            click: function (event) {
                                                //sessionStorage.setItem('bcLevel2', that.widget.description);
                                                that._SharedService.setNameValue('bcLevel2Name', that.widget.description);   
                                                that._SharedService.setNameValue('HcXAxisname', this.category);                                                         
                                             //   that._SharedService.setHcXAxisname(this.category);
                                                that.router.navigate([routeValue]);
                                            }
                                        }
                                    }
                                }
                            },
                            series: [{
                                name: that.widgetHC.series[0].name,
                                color: '#00728f',
                                data: that.widgetHC.series[0].data,
                                pointPadding: 0.3


                            }, {
                                    name: that.widgetHC.series[1].name,
                                    color: '#72ccf5',
                                    data: that.widgetHC.series[1].data,
                                    pointPadding: 0.4


                                }]
                        });
                    }
                    else {
                        this.enableHC = false;
                    }
            },
                error => {
                    this.error = <any>error;
                    this.serverError = true;
                }
            );
    }
}