import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class AppService {
    private _dashboardListUrl = sessionStorage["Analytics"] + "/AnalyticsTiles?ProductID=1"; 
    private _Level1WidgetsUrl = sessionStorage["Analytics"] + "/AnalyticsWidgets";
      
    constructor(private http: Http) {  }

    getList(): Observable<any[]> {        
        return this.http.get(this._dashboardListUrl)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    getData(url): Observable<any[]> {
        return this.http.get(url)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    getWidgets(DashboardId2: number, serviceType: string, baseMeasureId: string): Observable<any[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = { "AnalyticsID": DashboardId2, "ServiceType": serviceType, "MeasureID": baseMeasureId };                      
        return this.http.post(this._Level1WidgetsUrl, body, options)
            .map((res: Response) => res.json()).catch(this.handleError);
    }    
    private handleError(error: Response) {
          console.error(error.status + ',' + error.statusText);
        return Observable.throw(error.json().error || 'Server Error');
    }
}

