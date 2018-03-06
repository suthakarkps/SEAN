import { Component, ElementRef, OnInit  } from '@angular/core';

declare var $: any

@Component({
    selector: 'sparkline-line',
    template: `<span>Loading...</span>`
})

export class sparklineLine implements OnInit {   
    private el: HTMLElement;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }
    ngOnInit() {
        $(this.el).sparkline([5, 6, 7, 2, 14], {
            type: 'pie',
            width: '100%',
            height: '42',
            lineColor: '#6db33f',
            fillColor: '#dcf5fb',
            lineWidth: 2
        });       
    }
}