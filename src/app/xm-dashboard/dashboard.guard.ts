import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '@xm-ngx/core/environment';
import { DashboardWrapperService } from './shared/dashboard-wrapper.service';
import { DefaultDashboardService } from './shared/default-dashboard.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanActivateChild {

    constructor(
        private dashboardWrapperService: DashboardWrapperService,
        private defaultDashboardService: DefaultDashboardService,
        private router: Router,
    ) {
    }

    public canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next.params.id);
    }

    public canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next.params.id);
    }

    public resolve(idOrSlug: number | string | null): Observable<boolean | UrlTree> {
        return this.isDashboardAvailable(idOrSlug).pipe(
            switchMap((available) => {
                if (available) {
                    return of(available);
                }
                return this.getFirstAvailableDashboard();
            }));
    }

    public isDashboardAvailable(idOrSlug: number | string): Observable<boolean> {
        return this.dashboardWrapperService.getByIdOrSlug(idOrSlug).pipe(map(Boolean));
    }

    public getFirstAvailableDashboard(): Observable<UrlTree> {
        return this.defaultDashboardService.getDefaultOrFirstAvailable().pipe(
            map((d) => {
                const nUrl = d ? `/dashboard/${d.config?.slug || d.id}`: environment.notFoundUrl;
                console.info(`DashboardGuard redirect to ${nUrl}`);
                return this.router.parseUrl(nUrl);
            }),
        );
    }

}
