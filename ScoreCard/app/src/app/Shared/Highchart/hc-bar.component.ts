import { Component, Input, OnInit, Pipe, ElementRef } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { HCService } from './hc.service';
import {SharedService} from '../service/shared.service';

declare var $: any

@Component({
    selector: 'hc-bar',
    templateUrl: './hc-template.html',
    providers: [HCService]
})

export class HcBar implements OnInit {

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
       
        this._widgetHC.getLevel1HCData(_Level1HCUrl, that.widget.widgetId)
            .subscribe(widgetHC => {
                that.widgetHC = widgetHC;
                this.serverError = false;
                let size = { 'sm': 150, 'md': 200, 'mdlg': 250, 'lg': 300 }
                let height = this.widget.rowClassSettings;

                if ((this.widgetHC.series)) {
                     
                    this.enableHC = true;
                    for (var i = 0; i < (this.widgetHC.series).length; i++) {
                        this.widgetHC.series[i].data.forEach((value, index) => {
                            this.widgetHC.series[i].data[index] = parseFloat(value);
                        });
                    }

                    $(that.el).find('div.highchart-container').highcharts({
                        colors: ['#50B3CF', '#6DB33F', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
                        chart: { type: 'bar', height: size[height] },
                        credits: false,
                        title: {
                            text: ''
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: this.widgetHC.yAxisText
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

                                var s;

                                if ((that.widgetHC.series).length >= 2) {
                                    s = '<b>' + this.x + '</b>';
                                    $.each(this.points, function (i, point) {
                                        s += '<br/>' + point.series.name + ': ' + point.y;
                                    });
                                }
                                else {
                                    s = this.x + ': ' + commaSeparateNumber(this.y);
                                }
                                return s;
                            },
                            shared: true
                            //positioner: function (boxWidth, boxHeight, point) {
                            //    return { x: point.plotX, y: point.plotY };
                            //}
                        },
                        xAxis: {
                            categories: this.widgetHC.xAxisData,
                        },
                        plotOptions: {
                            column: {
                                colorByPoint: true
                            },
                            series: {
                                pointWidth: 40
                            }
                        },
                        series: this.widgetHC.series
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

