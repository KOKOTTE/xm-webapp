import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable ,  Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { I18nNamePipe, JhiLanguageHelper, Principal, XmConfigService } from '../shared';
import { LIST_DEFAULT_FIELDS } from '../shared/constants/default-lists-fields.constants';
import { DashboardWrapperService } from '../xm-dashboard';
import { Spec, XmEntitySpec, XmEntitySpecWrapperService } from '../xm-entity';
import { EntityListCardOptions } from '../xm-entity/entity-list-card/entity-list-card-options.model';

@Component({
    selector: 'xm-entity',
    templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit, OnDestroy {

    private routeData: any;
    private routeDataSubscription: Subscription;
    private routeParamsSubscription: Subscription;
    private routeQueryParamsSubscription: Subscription;

    options: EntityListCardOptions;

    isSearch = false;
    searchQuery: string;

    currentAccount: any;
    error: any;
    success: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    typeKey: string;
    entityType: any;
    types: any;
    spec: Spec;
    searchParams: any;

    spec$: Observable<Spec>;

    uiConfig: any;
    defaultFieldsKeys: string[] = [
        LIST_DEFAULT_FIELDS['name'],
        LIST_DEFAULT_FIELDS['typeKey'],
        LIST_DEFAULT_FIELDS['startDate'],
        LIST_DEFAULT_FIELDS['stateKey']
    ];

    constructor(protected jhiLanguageHelper: JhiLanguageHelper,
                protected translateService: TranslateService,
                protected xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                protected xmConfigService: XmConfigService,
                protected principal: Principal,
                protected activatedRoute: ActivatedRoute,
                protected router: Router,
                protected modalService: NgbModal,
                protected eventManager: JhiEventManager,
                protected i18nNamePipe: I18nNamePipe,
                protected dashboardWrapperService: DashboardWrapperService) {
        this.searchQuery = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    ngOnInit() {

        if (!environment.production) {
            console.log('ApplicationComponent.ngOnInit')
        }

        this.spec$ = this.xmEntitySpecWrapperService.specv2();

        this.xmConfigService.getUiConfig().subscribe(result => {
            this.uiConfig = result;
            this.xmEntitySpecWrapperService.spec().then(spec => {
                this.spec = spec;
                this.routeDataSubscription = this.activatedRoute.data.subscribe((data) => {
                    if (data['pagingParams']) {
                        this.itemsPerPage = data['pagingParams'].size;
                        this.page = data['pagingParams'].page;
                        this.previousPage = data['pagingParams'].page;
                        this.reverse = data['pagingParams'].ascending;
                        this.predicate = data['pagingParams'].predicate;
                        this.routeData = data;
                        if (this.entityType && this.entityType.name) {
                            this.routeData.pageSubTitle = this.i18nNamePipe.transform(this.entityType.name, this.principal);
                            this.jhiLanguageHelper.updateTitle();
                        }
                    }
                });
                this.routeParamsSubscription = this.activatedRoute.params.subscribe((params) => {
                    if (params['key']) {
                        this.typeKey = params['key'];
                        this.spec$.subscribe((s) => {
                            this.entityType = this.getTypeFromSpec(s, this.typeKey);
                            this.load();

                            if (this.entityType && this.entityType.name) {
                                this.routeData.pageSubTitle = this.i18nNamePipe.transform(this.entityType.name, this.principal);
                                this.jhiLanguageHelper.updateTitle();
                            }
                        });
                    }
                });
                this.routeQueryParamsSubscription = this.activatedRoute.queryParams.subscribe((params) => {
                    if (params['query']) {
                        this.isSearch = true;
                        this.searchQuery = params['query'];
                        this.getSearchConfig(params.dashboardId)
                            .subscribe((config) => {
                                this.searchParams = config;
                                this.load();
                            });

                        this.routeData.pageSubTitle = `[${params['query']}]`;
                        this.jhiLanguageHelper.updateTitle();
                    }
                });
            });
        }, (err) => {
            console.log(err);
        });

        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    load() {
        this.translateService.get(this.defaultFieldsKeys).subscribe(() => {
            const defaultFields = this.buildDefaultFields();
            this.searchParams && this.searchParams.fields
                ? this.buildOptions(this.searchParams.fields)
                : this.buildOptions(defaultFields);
        });
    }

    private buildDefaultFields(): Array<Object> {
        return ['name', 'typeKey', 'startDate', 'stateKey'].map(item => this.newField(item));
    }

    private newField(name: string) {
        return {
            field: name,
            title: this.translateService.instant(LIST_DEFAULT_FIELDS[name])
        }
    }

    protected buildOptions(defaultFields): void {
        const config = this.getListConfig();

        const fields = config && config.fields ? config.fields : defaultFields;

        if (this.isSearch) {
            this.options = {
                hideDelete: config && config.hideDelete,
                entities: [
                    {
                        currentQuery: (config ? config.query : '') + this.searchQuery,
                        name: `[${this.searchQuery}]`,
                        fields,
                        routerLink: config && config.routerLink ? config.routerLink : null,
                    },
                ],
            };
        } else {
            this.entityType = this.getTypeFromSpec(this.spec, this.typeKey) || '';
            this.options = {
                hideDelete: config && config.hideDelete,
                entities: [
                    {
                        typeKey: this.typeKey,
                        name: this.entityType.pluralName ? this.entityType.pluralName : this.entityType.name,
                        fastSearch: config && config.fastSearch ? config.fastSearch : this.entityType.fastSearch,
                        fields,
                        routerLink: config && config.routerLink ? config.routerLink : null,
                        filter: config && config.filter ? config.filter : null,
                        noData: config && config.noData ? config.noData : null,
                    },
                ],
            };
        }
    }

    private getSearchPattern() {
        if (this.uiConfig.search && this.uiConfig.search.patterns) {
            for (const pattern of this.uiConfig.search.patterns) {
                const re = new RegExp(pattern.regexp);
                if (re.test(this.searchQuery)) {
                    return pattern;
                }
            }
        }
        return null;
    }

    protected getListConfig() {
        if (this.isSearch) {
            return this.getSearchPattern();
        } else {
            const entitiesConfig = this.uiConfig.applications && this.uiConfig.applications.config &&
                this.uiConfig.applications.config.entities;
            if (entitiesConfig) {
                return entitiesConfig.filter((c) => c.typeKey === this.typeKey).shift();
            }
        }
        return null;
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate([`/application`, this.typeKey], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.searchQuery,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            },
        }).then(() => this.load());
    }

    clear() {
        this.page = 0;
        this.searchQuery = '';
        this.router.navigate(['/application', this.typeKey], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            },
        }).then(() => this.load());
    }

    ngOnDestroy() {
        if (this.routeParamsSubscription) {
            this.routeParamsSubscription.unsubscribe();
        }
        if (this.routeDataSubscription) {
            this.routeDataSubscription.unsubscribe();
        }
        if (this.routeQueryParamsSubscription) {
            this.routeQueryParamsSubscription.unsubscribe();
        }
    }

    private getTypeFromSpec(spec: Spec, typeKey: string): XmEntitySpec | undefined {
        return spec.types.filter((t) => t.key === typeKey).shift();
    }

    private getSearchConfig(idOrSlug: any): Observable<any> {
        return this.dashboardWrapperService.getDashboardByIdOrSlug(idOrSlug).pipe(
            map( (dash) => dash && dash.config),
            map( (config) => config && config.search),
        );
    }
}
