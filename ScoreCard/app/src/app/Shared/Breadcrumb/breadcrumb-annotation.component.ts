import { Router } from '@angular/router';
import {BreadcrumbService} from './breadcrumb.service';

export declare class BreadcrumbAnnotation {
    private router;
    private breadcrumbService;
    private _urls;
    constructor(router: Router, breadcrumbService: BreadcrumbService);
    generateBreadcrumbTrail(url: string): void;
    navigateTo(url: string): void;
    friendlyName(url: string): string;
}
