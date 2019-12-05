import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LANGUAGES } from './language.constants';
import { ModulesLanguageHelper } from './modules-language.helper';

@Injectable()
export class JhiLanguageHelper {
    renderer: Renderer2 = null;
    private _language: BehaviorSubject<string>;

    constructor(
        private translateService: TranslateService,
        // tslint:disable-next-line: no-unused-variable
        private rootRenderer: RendererFactory2,
        private modulesLangHelper: ModulesLanguageHelper,
        private titleService: Title,
        private router: Router,
    ) {
        this._language = new BehaviorSubject<string>(this.modulesLangHelper.getLangKey());
        this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => this.handleLanguageChangeEvent(event));
    }

    getAll(): Promise<any> {
        return Promise.resolve(LANGUAGES);
    }

    get language(): Observable<string> {
        return this._language.asObservable();
    }

    /**
     * Update the window title using params in the following
     * order:
     * 1. titleKey parameter
     * 2. $state.$current.data.pageTitle (current state page title)
     * 3. 'global.title'
     */
    updateTitle(titleKey?: string) {
        if (!titleKey) {
            titleKey = this.getPageTitle(this.router.routerState.snapshot.root);
        }

        this.translateService.get(titleKey).subscribe((title) => {
            this.titleService.setTitle(title);
        });
    }

    private handleLanguageChangeEvent(event: LangChangeEvent): void {
        if (!environment.production) {
            // tslint:disable-next-line
            console.log('DBG JhiLanguageHelper  onLangChange: event=%o _language: %s',
                event, this._language.getValue());
        }
        this._language.next(event.lang);
        this.renderer.setAttribute(document.querySelector('html'), 'lang', event.lang);
        this.updateTitle();
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string =
            routeSnapshot.data &&
            routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'jhipsterSampleApplicationApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }
}
