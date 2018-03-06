import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HCService {
  
    constructor(private http: Http) { }
    
    getLevel1HCData(url: string, widgetID: number): Observable<any[]> { 
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = { "WidgetID": widgetID, "SubmissionID": sessionStorage["SubmissionID"]};               
       
        return this.http.post(url, body, options)
            .map((res: Response) => res.json()).catch(this.handleError);
    }


    private handleError(error: Response) {
        console.error(error.status + ',' + error.statusText);
        return Observable.throw(error.json().error || 'Server Error');

    }
}

