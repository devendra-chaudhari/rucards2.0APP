import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";


const httpOptions = {

    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
        // key: environment.key
    })
};

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {
    }

    get(url: string, type = 'get', params: Object = {}): Observable<any> {
        const path = this.getPath(params);
        if (type === 'get') {
            return this.http.get<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), this.setHeaders());
        } else {
            return this.http.delete<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), this.setHeaders());
        }
    }

    post(url: string, data, type = 'post', params: Object = {}): Observable<any> {
        const path = this.getPath(params);
        if (type === 'post') {
            return this.http.post<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), JSON.stringify(data), this.setHeaders());
        } else {
            return this.http.put<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), JSON.stringify(data), this.setHeaders());
        }
    }

    post_multipart(url: string, data: FormData, params: Object = {}) {
        const path = this.getPath(params);
        return this.http.post<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), data, this.setHeaders_multipart());
    }

    put_multipart(url: string, data: FormData, params: Object = {}) {
        const path = this.getPath(params);
        return this.http.put<any>(`${environment.api_url}${url}` + (path ? '?' + path : ''), data, this.setHeaders_multipart());
    }

    setHeaders_multipart() {
        if (httpOptions.headers.get('Content-Type')) {
            httpOptions.headers = httpOptions.headers.delete('Content-Type');
        }
        return httpOptions;
    }



    download(url: string, params: Object = {}, type: string = 'pdf') {
        const path = this.getPath(params);
        return this.http.get(`${environment.api_url}${url}` + (path ? '?' + path : ''), {
            headers: {
                Accept: `application/${type}`,
                // key: environment.key
            },
            responseType: 'arraybuffer'
        });
    }


    private getPath(params: Object = {}): string {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
    }

    private setHeaders(): { headers: HttpHeaders } {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        return { headers };
    }
}
