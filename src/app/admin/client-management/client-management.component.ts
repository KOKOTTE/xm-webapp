import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { Client, ClientService } from '../../shared';
import { BaseAdminListComponent } from '../admin.service';
import { ClientMgmtDeleteDialogComponent } from './client-management-delete-dialog.component';
import { ClientMgmtDialogComponent } from './client-management-dialog.component';

@Component({
    selector: 'xm-client-mgmt',
    templateUrl: './client-management.component.html',
})
export class ClientMgmtComponent extends BaseAdminListComponent {

    list: Client[];
    eventModify = 'clientListModification';
    navigateUrl = 'administration/client-management';
    basePredicate = 'lastModifiedDate';

    constructor(
        protected clientService: ClientService,
        protected activatedRoute: ActivatedRoute,
        protected alertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        private modalService: NgbModal,
        protected router: Router,
    ) {
        super(activatedRoute, alertService, eventManager, parseLinks, router);
        this.itemsPerPage = 10;
    }

    loadAll() {
        this.showLoader = true;
        this.clientService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
        }).subscribe(
            (res) => this.list = this.onSuccess(res.body, res.headers),
            (err) => {
                console.log(err);
                this.onError(err);
                this.showLoader = false;
            },
            () => this.showLoader = false);
    }

    trackIdentity(index, item: Client) {
        return item.id;
    }

    private onDelete(client) {
        const modalRef = this.modalService.open(ClientMgmtDeleteDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedClient = client;
    }

    private onEdit(client) {
        const modalRef = this.modalService.open(ClientMgmtDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedClient = client;
    }

    private onAdd() {
        this.modalService.open(ClientMgmtDialogComponent, { backdrop: 'static' });
    }
}
