import { Component, OnInit, Pipe } from '@angular/core';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
//import 'rxjs/Rx';   // Load all features
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import {BreadcrumbService} from './breadcrumb.service';
import {BreadcrumbAnnotation} from './breadcrumb-annotation.component';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb-template.html'    
})

export class BreadcrumbComponent {

    private _urls: string[];
    name: boolean;

    constructor(private router: Router, private breadcrumbService: BreadcrumbService) {
        this._urls = new Array();      
        this.router.events.subscribe((navigationEnd: NavigationEnd) => {        
            this._urls.length = 0; //Fastest way to clear out array
            this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);           
        });
    }

    generateBreadcrumbTrail(url: string): void {       
        this._urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)        
        if (url.lastIndexOf('/') > 0) {
            this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
        }               
    }

    navigateTo(url: string): void {        
        this.router.navigateByUrl(url);
    }

    friendlyName(url: string): string {       
            return this.breadcrumbService.getFriendlyNameForRoute(url);               
    }

}
