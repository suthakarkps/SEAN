import {Component} from '@angular/core';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {BreadcrumbAnnotation} from './breadcrumb-annotation.component';

declare var $: any

export class BreadcrumbService {
    private routeFriendlyNames: any = {};
    private workflow: boolean = false;
    /**
    * Specify a friendly name for the corresponding route. Please note this should be the full url of the route,
    * as in the same url you will use to call router.navigate().
    *
    * @param route
    * @param name
    */
    addFriendlyNameForRoute(route: string, name: string): void {
        if (name == 'Workflow')
            this.workflow = true;
        this.routeFriendlyNames[route] = name;
    }
    /**
 * Show the friendly name for a given url. If no match is found the url (without the leading '/') is shown.
 *
 * @param route
 * @returns {*}
 */
    getFriendlyNameForRoute(route: string): string {
        var val;
        if (route == "/list" && this.workflow != true) {
            val = "HEDIS Compliance";
        }
        else if (route == "/list" && this.workflow == true) {
            val = "Workflow";
        }
        else {
            val = this.routeFriendlyNames[route];
        }
        return val;
    }
}
