import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { filter, map } from 'rxjs/operators';

import { XmConfigService } from '../../shared';
import { XmEntitySpec } from '../index';
import { LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { LinkService } from '../shared/link.service';
import { Spec } from '../shared/spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let swal: any;

@Component({
    selector: 'xm-link-detail-search-section',
    templateUrl: './link-detail-search-section.component.html',
    styleUrls: ['./link-detail-search-section.component.scss'],
})
export class LinkDetailSearchSectionComponent implements OnInit {

    @Input() public linkSpec: LinkSpec;
    @Input() public sourceXmEntity: XmEntity;
    @Input() public spec: Spec;

    public xmEntity: XmEntity = {};
    public searchQuery: string;
    public searchXmEntities: XmEntity[];
    public total: number;
    public showLoader: boolean;
    private page: number;
    private linkSpecQuery: any;

    constructor(private activeModal: NgbActiveModal,
                private xmEntityService: XmEntityService,
                private linkService: LinkService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                private configService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.getLinkSpecConfig().subscribe((res) => this.linkSpecQuery = res || null);
        this.onSearch();
    }

    public getEntitySpec(typeKey: string): XmEntitySpec {
        return this.spec.types.filter( (t) => t.key === typeKey).shift();
    }

    public onShowMore(): void {
        this.page++;
        this.load();
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
    }

    public onAdd(targetXmEntity: XmEntity): void {
        this.showLoader = true;
        const link: Link = {};
        link.target = targetXmEntity;
        link.source = this.sourceXmEntity;
        link.typeKey = this.linkSpec.key;
        link.startDate = new Date().toISOString();

        this.linkService.create(link).subscribe(() => {
                this.eventManager.broadcast({name: 'linkListModification'});
                this.alert('success', 'xm-entity.link-detail-dialog.add.success');
            }, () => {
                this.alert('error', 'xm-entity.link-detail-dialog.add.error');
                this.showLoader = false;
            },
            () => this.activeModal.dismiss(true));
    }

    private load(): void {
        this.showLoader = true;
        this.xmEntityService.search({
            query: `(typeKey:${this.linkSpec.typeKey}* OR typeKey:${this.linkSpec.typeKey})`
                + (this.linkSpecQuery ? ` AND ${this.linkSpecQuery}` : '')
                + (this.searchQuery ? ` AND ${this.searchQuery}` : ''),
            size: 5,
            page: this.page,
        }).subscribe((xmEntities: HttpResponse<XmEntity[]>) => {
                this.total = parseInt(xmEntities.headers.get('X-Total-Count'), 10);
                this.searchXmEntities.push(...xmEntities.body);
            },
            (err) => console.log(err), // tslint:disable-line
            () => this.showLoader = false);
    }

    private getLinkSpecConfig(): any {
        return this.configService.getUiConfig().pipe(
            map((res) => res.applications.config.entities
                .find((entity) => entity.typeKey === this.sourceXmEntity.typeKey) || {}),
            filter((entity) => entity.hasOwnProperty('links')),
            map((entity) => entity.links.find((link) => link.key === this.linkSpec.key)['filterQuery']),
        );
    }

    private onSearch(): void {
        this.searchXmEntities = [];
        this.page = 0;
        this.load();
    }

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
