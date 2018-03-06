import { Component, Input, OnInit, ElementRef } from '@angular/core';
import 'rxjs/Rx';  
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { HCService } from './hc.service';
import {SharedService} from '../service/shared.service';

declare var $: any

@Component({
    selector: 'hc-pie',    
    templateUrl: './hc-template.html',
    providers: [HCService]   
})

export class HcPie implements OnInit {   
    @Input() widget: any;
    widgetHC: any;
    private el: HTMLElement;
    chart: any;
    enableHC: boolean = true;
    getNoDataValue: string;
    serverError: boolean = false;
    serverErrorMsg: any;
    error: any;

    constructor(private _widgetHC: HCService, el: ElementRef, _SharedService: SharedService) {
        this.el = el.nativeElement;
        this.getNoDataValue = _SharedService.getValue();
        this.serverErrorMsg = _SharedService.getServerError(); 
    }

    ngOnInit(): void {
        let that = this;
        let _Level1HCUrl = sessionStorage["Analytics"] + this.widget.dataUrl;        
        that._widgetHC.getLevel1HCData(_Level1HCUrl, this.widget.widgetId)
            .subscribe(widgetHC => {
                that.widgetHC = widgetHC;
                this.serverError = false;          

                let size = { 'sm': 150, 'md': 200, 'mdlg':250, 'lg': 300 }
                let height = this.widget.rowClassSettings;    

             
                if ((that.widgetHC.xAxisData)) {

                    var name = that.widgetHC.xAxisData;
                    var data = that.widgetHC.series[0].data.map(Number);
                    var chartData = [];

                    for (var i = 0; i < name.length; i++) {
                        chartData.push({
                            name: name[i],
                            y: data[i]
                        });
                    }
                }
                 
             
                              /**/
                if ((that.widgetHC.series)) {
                    this.enableHC = true;
                    that.widgetHC.series[0].data.forEach((value, index) => {
                        that.widgetHC.series[0].data[index] = parseFloat(value);
                      //  this.widgetHC.series[0].name[index] = this.widgetHC.xAxisData[0];
                    });
                    //console.log(this.widgetHC.series); 
                    $(that.el).find('div.highchart-container').highcharts({

                        colors: ['#50B3CF', '#6DB33F', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
                        chart: { type: 'pie', height: size[height] },
                        credits: false,
                        title: {
                            text: ''
                        },
                        xAxis: {                            
                            title: {
                                text: that.widgetHC.XAxisText
                            }
                        }, 
                        tooltip: {
                            formatter: function () {

                                function commaSeparateNumber(val) {
                                    while (/(\d+)(\d{3})/.test(val.toString())) {
                                        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                                    }
                                    return val;
                                }

                                var s = this.point.name + ': ' + commaSeparateNumber(this.y);
                                return s;
                            },
                            positioner: function (boxWidth, boxHeight, point) {
                                return { x: point.plotX + 20, y: point.plotY };
                            }
                        },
                        plotOptions: {
                            pie: {         
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,                    
                                dataLabels: {
                                    enabled: true,                                  
                                    format: '{point.name}'                                   
                            
                                },
                                   
                            },
                            column: {
                                colorByPoint: true
                            },
                            series: {
                                pointWidth: 40
                            }
                        },                
                        legend: {
                            enabled: false
                        },
                        series: [{
                            data: chartData
                        }]
                    });
                }
                else {
                    this.enableHC = false;
                }
                /**/
           },
            error => {
                this.error = <any>error;
                this.serverError = true;
            }
            
        );

    }


}