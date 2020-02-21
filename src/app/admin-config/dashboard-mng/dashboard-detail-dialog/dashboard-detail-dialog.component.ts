import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { environment } from '../../../../environments/environment';
import { Principal } from '../../../shared/auth/principal.service';
import { Dashboard, DashboardService } from '../../../xm-dashboard';

declare let swal: any;

@Component({
    selector: 'xm-dashboard-detail-dialog',
    templateUrl: './dashboard-detail-dialog.component.html',
    styleUrls: ['./dashboard-detail-dialog.component.scss'],
})
export class DashboardDetailDialogComponent implements OnInit {

    @Input() public dashboard: Dashboard = new Dashboard();

    public configStringIn: string;
    public configStringOut: string;
    public layoutStringIn: string;
    public layoutStringOut: string;
    public showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private dashboardService: DashboardService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    public ngOnInit(): void {
        this.configStringIn = JSON.stringify(this.dashboard.config, null, 2);
        this.layoutStringIn = JSON.stringify(this.dashboard.layout, null, 2);
        this.configStringOut = this.configStringIn;
        this.layoutStringOut = this.layoutStringIn;
    }

    public onConfigChange(textChanged: string): void {
        if (!environment.production) {
            console.info(`Changed text ${textChanged}`); // tslint:disable-line
        }
        this.configStringOut = textChanged;
    }

    public onLayoutChange(textChanged: string): void {
        this.layoutStringOut = textChanged;
    }

    public onConfirmSave(): void {
        this.dashboard.config = this.configStringOut ? JSON.parse(this.configStringOut) : null;
        this.dashboard.layout = this.layoutStringOut ? JSON.parse(this.layoutStringOut) : null;
        this.showLoader = true;
        if (this.dashboard.id !== undefined) {
            this.dashboardService.update(this.dashboard).subscribe(
                () => this.onSaveSuccess('admin-config.dashboard-detail-dialog.edit.success'),
                // TODO: error processing
                (err) => console.info(err), // tslint:disable-line
                () => this.showLoader = false);
        } else {
            this.dashboard.owner = this.principal.getUserKey();
            this.dashboardService.create(this.dashboard).subscribe(
                () => this.onSaveSuccess('admin-config.dashboard-detail-dialog.add.success'),
                // TODO: error processing
                (err) => console.info(err), // tslint:disable-line
                () => this.showLoader = false);
        }
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
    }

    private onSaveSuccess(key: string): void {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'dashboardListModification'});
        this.activeModal.dismiss(true);
        this.alert('success', key);
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
