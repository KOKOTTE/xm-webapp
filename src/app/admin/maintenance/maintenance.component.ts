import { Component } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';


import swal from 'sweetalert2';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-maintenance',
    templateUrl: './maintenance.component.html',
    styles: [],
})
export class MaintenanceComponent {

    public isTenantCfgUpdating: boolean;

    constructor(
        private service: XmConfigService,
        private alertService: XmToasterService,
    ) {
    }

    public reindexElastic(): void {
        swal({
            title: 'Warning. Elastic index will be re-indexed. Time consuming operation.',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reindex!',
        }).then((result) => {
            if (result.value) {
                this.service.reindexTenantElastic().subscribe(
                    null,
                    null,
                    () => this.alertService.success('global.actionPerformed'),
                );
            }
        });
    }

    public updateTenantsConfiguration(): void {

        swal({
            title: 'Reload configuration for ALL tenants?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => {
            if (result.value) {
                this.service.updateTenantsConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.alertService.success('global.actionPerformed');
                        window.location.reload();
                    },
                );
            }
        });

    }

    public updateTenantConfiguration(): void {
        swal({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => {
            this.isTenantCfgUpdating = true;
            if (result.value) {
                this.service.updateTenantConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.isTenantCfgUpdating = false;
                        this.alertService.success('global.actionPerformed');
                        window.location.reload();
                    });
            }
        });
    }

}
