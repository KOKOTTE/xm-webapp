import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable, of, zip} from 'rxjs';

import {XmUIConfig} from './xm-ui-config-model';
import {takeUntilOnDestroy} from '@xm-ngx/shared/operators';
import {XmSessionService} from './xm-session.service';
import {RequestCache} from './cache/request-cache';
import {XM_CORE_CONFIG, XmCoreConfig} from './xm-core-config';
import {catchError, map} from 'rxjs/operators';
import {merge} from 'lodash';

@Injectable({providedIn: 'root'})
export class XmUiConfigService<T = XmUIConfig> implements OnDestroy {

    protected requestCache: RequestCache<T>;

    constructor(protected httpClient: HttpClient,
                @Inject(XM_CORE_CONFIG) protected xmCoreConfig: XmCoreConfig,
                protected sessionService: XmSessionService) {
        const publicAPI = (): Observable<T> => this.httpClient.get<T>(xmCoreConfig.UI_CONFIG_PUBLIC_URL);
        const privateAPI = (): Observable<T> => this.httpClient.get<T>(xmCoreConfig.UI_CONFIG_PRIVATE_URL);

        const privateAndPublicAPI = (): Observable<T> => zip(
            privateAPI().pipe(catchError(() => of(null))),
            publicAPI().pipe(catchError(() => of(null))),
        ).pipe(map(([pr, pu]) => merge(pu, pr)));

        this.requestCache = new RequestCache(publicAPI);

        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.requestCache.request = privateAndPublicAPI;
            } else {
                this.requestCache.request = publicAPI;
            }
            this.requestCache.forceReload();
        });
    }

    public get cache$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public next(value: T | null): Observable<T | null> {
        this.requestCache.next(value);
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

}
