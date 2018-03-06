import { Component, OnChanges, ElementRef, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'dynatree-local',
    templateUrl: './dynatree-local.template.html',
    styles: [':host /deep/ span.dynatree-active a{ border:0px none; background: transparent; cursor:default}']
})

export class DynaTreeLocal implements OnChanges {
    @Input() options: any;
    @Input() displayParentName: string; // workflow name
    @Input() displayname: string; // run desc
    @Input() operationParentName: string;//Workflow id
    @Input() operationName1: string; //run date
    @Input() operationName2: string; //Timeperiod id
    showtree = "none";
    i: number = 1;
    private el: HTMLElement;
    toggleArrow = 'fa-angle-down';
    private dynatreeValue = "Loading..!";
    @Output() output = new EventEmitter();
    private parentDetails;
    private treeData = [];


    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    dropdown() {
        if (this.i % 2) {
            this.showtree = "block";
            this.toggleArrow = 'fa-angle-up';
        }
        else {
            this.showtree = "none";
            this.toggleArrow = 'fa-angle-down';
            this.i = 0
        }
        this.i++;
    }
    onClick(event) {
        if (!this.el.contains(event.target)) {
            if (event.target.parentNode != null) {
                if (!event.target.parentNode.classList.contains("dynatree-container")) {
                    this.showtree = "none";
                    this.toggleArrow = 'fa-angle-down';
                    this.i = 1;
                }
            }
        }
    }

    dedupeByKey(arr, key) {
        const temp = arr.map(el => el[key]);
        return arr.filter((el, i) =>
            temp.indexOf(el[key]) === i
        );
    }

    ngOnChanges(changes) {
        //console.log(this.options)        
        //for (let option of this.options) {
        if (changes.options.currentValue.length == 0) {
            this.dynatreeValue = "No data";
            let output = {
                a: "No data", //workflow name
                b: "No data", //workflow id 
                c: "No data", //run desc
                d: "No data", //run date
                e: "No data" //time period id
            }           
            this.output.emit(output); 
        }
        else if (changes.options.currentValue != undefined && changes.options.currentValue[0][this.displayname] != 'Loading..!') {
            this.treeData = [];
            let parentIds = [];
            let parentDetails = this.dedupeByKey(this.options, this.operationParentName);
            for (let item of parentDetails) {
                let Parentobj = {};
                Parentobj['children'] = [];
                Parentobj['title'] = item[this.displayParentName];
                Parentobj['key'] = item[this.operationParentName];
                Parentobj['hideCheckbox'] = true;                 
                Parentobj['unselectable'] = true;
                Parentobj['icon'] = false;
                for (let option of changes.options.currentValue) {
                    if (option[this.operationParentName] == item[this.operationParentName]) {
                        let childobj = {};
                        childobj['title'] = option[this.displayname];
                        childobj['key'] = option[this.operationName1];
                        childobj['id'] = option[this.operationName2];
                        childobj['icon'] = false;
                        Parentobj['children'].push(childobj);
                    }
                }
                this.treeData.push(Parentobj);
            }
            this.treeData[0]['expand'] = true;
            this.treeData[0].children[0]['select'] = true;
            this.dynatreeValue = this.treeData[0]['title'] + ' - ' + this.treeData[0].children[0]['title'];            
            let output = {
                a: this.treeData[0]['title'], //workflow name
                b: this.treeData[0]['key'], //workflow id 
                c: this.treeData[0].children[0]['title'], //run desc
                d: this.treeData[0].children[0]['key'], //run date
                e: this.treeData[0].children[0]['id'] //time period id
            }
            this.output.emit(output);            
            this.treeFormat();
        }
    }


    treeFormat() {
        let that = this;
        if ($(that.el).find(".tree-start")[0].children.length > 0) {
            $(that.el).find(".tree-start").dynatree("destroy");
        }
        $(that.el).find(".tree-start").dynatree({
            checkbox: true,
            // Override class name for checkbox icon:
            classNames: { checkbox: "dynatree-radio" },
            selectMode: 1,
            children: that.treeData,
            onActivate: function (node) {
                //console.log(node.data.title);
                //$("#echoActive1").text();
            },
            onSelect: function (select, node) {
                // Display list of selected nodes
                //var s = node.tree.getSelectedNodes().join(", ");
                //console.log(s)
                // $("#echoSelection1").text(s);                
                that.dropdown();
                if (select) {
                    if (node.data.title != that.treeData[0].children[0].title)
                        $(that.el).find('.dynatree-radio').eq(0).css('background-position', '0px -48px');
                    else
                        $(that.el).find('.dynatree-radio').eq(0).css('background-position', '-48px -48px');
                    that.dynatreeValue = node.parent.data.title + ' - ' + node.data.title;
                    let output = {
                        a: node.parent.data.title, //workflow name
                        b: node.parent.data.key, //workflow id 
                        c: node.data.title, //run desc
                        d: node.data.key, //run date
                        e: node.data.id //time period id
                    }
                    that.output.emit(output)
                }
                else {
                    $(that.el).find('.dynatree-radio').eq(0).css('background-position', '-48px -48px');
                    that.dynatreeValue = that.treeData[0]['title'] + ' - ' + that.treeData[0].children[0]['title'];
                    let output = {
                        a: that.treeData[0]['title'], //workflow name
                        b: that.treeData[0]['key'], //workflow id 
                        c: that.treeData[0].children[0]['title'], //run desc
                        d: that.treeData[0].children[0]['key'], //run date
                        e: that.treeData[0].children[0]['id'] //time period id
                    }
                    that.output.emit(output)
                }
            },
            onDblClick: function (node, event) {
                node.toggleSelect();
            },
            onKeydown: function (node, event) {
                if (event.which == 32) {
                    node.toggleSelect();
                    return false;
                }
            },
            cookieId: "dynatree-Cb1",
            idPrefix: "dynatree-Cb1-"
        });        
    }
}