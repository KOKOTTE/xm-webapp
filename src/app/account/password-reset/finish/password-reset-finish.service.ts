import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

const CHECK_API = `${environment.serverApiUrl}/uaa/api/account/reset_password/check?key=`;

@Injectable()
export class PasswordResetFinish {

    constructor(private http: HttpClient) {
    }

    public save(keyAndPassword: any): Observable<any> {
        return this.http.post(`${environment.serverApiUrl}/uaa/api/account/reset_password/finish`, keyAndPassword);
    }

    public check(keyAndPassword: any): Observable<any> {
        return this.http.get(CHECK_API + keyAndPassword);
    }
}
