import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({ 
    host: {
        '(document:click)': 'onClick($event)',
    }, 
    selector: 'dropdown-search',
    templateUrl: './dropdown-search.template.html'
})

export class DropdownSearch implements OnChanges {
    @Input() options: any;
    @Input() displayname: any;
    @Input() operationName: any;
    enableOptions: boolean; 
    private dropdownValue = "Loading..!"; 
    searchkey: any = '';
    enableIcon: boolean;
    i: number = 1;
    tickPosition: number;
    dropdownOptions;
    toggleArrow = 'fa-angle-down';

    @Output() output = new EventEmitter();

    constructor(private _href: ElementRef) { }

    dropdown() {       
        this.searchkey = '';
        if (this.i % 2) {
            if ((this.dropdownOptions).length > 0) {
                for (var j = 0; j < (this.dropdownOptions).length; j++) {
                    if (this.dropdownOptions[j].hasOwnProperty(this.displayname) && this.dropdownOptions[j][this.displayname] === this.dropdownValue) {
                        this.tickPosition = j;
                    }
                }
                this.enableOptions = true;
                this.toggleArrow = 'fa-angle-up';
            }
        }
        else
        {
            this.enableOptions = false;
            this.toggleArrow = 'fa-angle-down';
            this.i = 0
        }
        this.i++;

    }

    onClick(event) {
        if (!this._href.nativeElement.contains(event.target)) {
            if (event.target.parentNode != null) {
                if (!(event.target.parentNode).classList.contains("dropdown-search")) {
                    this.enableOptions = false;
                    this.toggleArrow = 'fa-angle-down';
                    this.i = 1;
                }
            }
        }

    }

    search(value) {
        if (value.length == 0) {
            for (var j = 0; j < (this.dropdownOptions).length; j++) {
                if (this.dropdownOptions[j].hasOwnProperty(this.displayname) && this.dropdownOptions[j][this.displayname] === this.dropdownValue) {
                    this.tickPosition = j;
                }
            }
        }
        else {
            this.tickPosition = -1;
        }
    }
    selectOption(option) {
        let key = this.displayname;
        if (this.dropdownValue != option[this.displayname]) {
            this.dropdownValue = option[this.displayname];            
            this.output.emit(option);
        }        
        this.i++;
        this.enableOptions = false;
        this.enableIcon = true;
    }
    
    ngOnChanges(value) {                
        this.dropdownOptions = this.options;
        if (((this.options).length == 0)) {
            this.dropdownValue = "No data";           
            let obj = {};
            obj[this.displayname] = "No data";
            obj[this.operationName] = "No data";
            this.options.push(obj);
            this.output.emit(this.options[0]);             
        }                  
        else {
            for (var i = 0; i < (this.options).length; i++) {
                if (sessionStorage[this.operationName] == this.options[i][this.operationName]) {
                    this.dropdownValue = this.options[i][this.displayname];
                    if (this.dropdownValue != "Loading..!")
                    this.output.emit(this.options[i]);
                    break;
                }
                else {
                    if (i + 1 == (this.options).length) {
                        this.dropdownValue = this.options[0][this.displayname];
                        if (this.dropdownValue != "Loading..!")
                        this.output.emit(this.options[0]);
                    }
                }

            }
        }        
        this.enableOptions = false;

    }

}