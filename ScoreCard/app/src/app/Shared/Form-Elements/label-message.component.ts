import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'label-message',
    templateUrl: './label-message.template.html'
})

export class LabelMessage implements OnChanges {
    @Input() option: any;
    private message;
    private label;

    ngOnChanges(changes) {
        if (changes.option.currentValue != undefined){           
            if (changes.option.currentValue.label != undefined) 
                this.label = changes.option.currentValue.label+':';
            if (changes.option.currentValue.message != undefined)
                this.message = changes.option.currentValue.message;
            }
    }
}