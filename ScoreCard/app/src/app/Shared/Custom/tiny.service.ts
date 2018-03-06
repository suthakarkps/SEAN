import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TinyService {
    private _tinyDataUrl = sessionStorage["Analytics"] + "/TinyControl";

    constructor(private http: Http) {   }

    getTinyData(WidgetId: number, BaseMeasureId: string): Observable<any[]> {
        let params: any = new URLSearchParams();
        params.set('WidgetId', WidgetId);
        params.set('BaseMeasureId', BaseMeasureId);
         return this.http.get(this._tinyDataUrl, { search: params })
         .map((res: Response) => res.json());
    }
}
