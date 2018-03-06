import { Component, ElementRef, OnInit, Input } from '@angular/core';
import {TinyService} from './tiny.service'
@Component({
    selector: 'tiny',
    templateUrl: './tiny-template.html',
    providers: [TinyService] 
})
export class Tiny implements OnInit{
    @Input() widget: any;
    @Input() basemeasureid: string;
    tinyData: any[];
    private el: HTMLElement;

    constructor(el: ElementRef, private _tinyData: TinyService) {
        this.el = el.nativeElement;
    }
    ngOnInit() {
        let WidgetId = this.widget.widgetId;
        let BaseMeasureId = this.basemeasureid;       
        this._tinyData.getTinyData(WidgetId, BaseMeasureId)
            .subscribe(
            tinyData => {
                this.tinyData = tinyData;                             
            });
        }        
}