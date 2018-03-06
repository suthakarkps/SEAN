import { Component, ElementRef, OnInit, Input  } from '@angular/core';
import {SharedService} from '../service/shared.service';

declare var $: any

@Component({
    selector: 'sparkline',
    templateUrl: './sparkline-template.html'
})

export class SparkLine implements OnInit {
    @Input() tinyData: any;     
    private el: HTMLElement;
    enableSL: boolean = true;
    getNoDataValue: string;

    constructor(el: ElementRef, _SharedService: SharedService) {
        this.el = el.nativeElement; 
        this.getNoDataValue = _SharedService.getValue();        
    }
    
    ngOnInit() {              
        if (typeof (this.tinyData.sparkLine.value) != "undefined") {
            this.enableSL = true;
            $(this.el).sparkline(this.tinyData.sparkLine.value, {
                type: this.tinyData.sparkLineType,
                barColor: '#6db33f',
                width: 200,
                height: '50',
                barWidth: 20,
                barSpacing: 5,
                sliceColors: ['#3595ab', '#5bcffe', '#153463', '#83c049', '#85d9c9', '#4d8b7c', '#d8bc2c', '#ad7250', '#a76e58'],
                colorMap: ['#50B3CF', '#6DB33F', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
                chartRangeMin: 0,
                tooltipFormat: '{{offset:offset}} : {{value}}',
                tooltipValueLookups: {
                    'offset': this.tinyData.sparkLine.key
                }

            });
        }
        else {
            this.enableSL = false;
        }
    }
}