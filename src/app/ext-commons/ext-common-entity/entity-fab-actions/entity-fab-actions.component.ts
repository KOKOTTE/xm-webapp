import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Principal } from '../../../shared';
import { XmEntitySpecWrapperService, EntityDetailDialogComponent, Spec, XmEntity } from '../../../xm-entity';
import { FunctionCallDialogComponent } from '../../../xm-entity/function-call-dialog/function-call-dialog.component';
import { XM_EVENT_LIST } from '../../../xm.constants';

declare let swal: any;

const ENTITY_SELECTED = 'xm-entity-selected';

@Component({
    selector: 'xm-entity-fab-actions',
    templateUrl: './entity-fab-actions.component.html',
    styleUrls: ['./entity-fab-actions.component.scss']
})
export class EntityFabActionsComponent implements OnInit, OnDestroy {

    selectedEntity: Subscription;
    config: any;
    buttons: any [] = [];
    mainButton: any;
    role: string;
    spec: Spec;
    selectedNode: XmEntity;
    fabButtonContext: any;

    constructor(
        public principal: Principal,
        private router: Router,
        private translateService: TranslateService,
        private modalService: NgbModal,
        private eventManager: JhiEventManager,
        protected xmEntitySpecWrapperService: XmEntitySpecWrapperService,
    ) {
        this.spec = null;
    }

    ngOnInit() {
        this.selectedEntity = this.eventManager.subscribe(ENTITY_SELECTED, (entity) => {
            if (entity) {
                this.selectedNode = entity.body;
                this.fabButtonContext = this.selectedNode;
            }
        });
        this.principal.identity().then(role => {
            this.role = role.roleKey;
            this.buttons = this.config ? this.config.buttons : this.config;
            this.mainButton = this.config ? this.config.mainButton : null;
            this.xmEntitySpecWrapperService.spec().then(spec => {
                this.spec = spec;
            });
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.selectedEntity);
    }

    public onAddNew(item) {
        if (!item.typeKey || !this.spec) {
            return false;
        }
        if (item.funcKey && item.typeKey) {
            this.callFunctionAction(item.typeKey, item.funcKey);
        } else {
            this.callEntityDetailAction(item.typeKey);
        }
    }

    public onRouterAction(button) {
        const path = button.routerPath;
        const options = button.routerData;
        if (button && button.routerPath) {
            this.navigate(path, options);
        }
    }

    getType(typeKey: string) {
        return this.spec.types.filter(t => t.key === typeKey).shift();
    }

    callEntityDetailAction(key: string): any {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntitySpec = this.getType(key);
        modalRef.componentInstance.spec = this.spec;
        modalRef.componentInstance.onSuccess = () => {
            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION });
            swal({
                type: 'success',
                text: this.translateService.instant('ext-common-entity.entity-fab-actions.operation-success'),
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
            });
        };
        return modalRef;
    }

    callFunctionAction(key: string, funcName: string): any {
        const entitySpec = this.spec.types.filter(x => x.key === key).shift();
        console.log('%o', entitySpec);

        /*if (!entitySpec || !this.selectedNode) {
            console.log('No selected node');
            return false;
        }*/

        const functionSpecArray = entitySpec.functions || [];
        const functionSpec = functionSpecArray.filter(x => x.key === funcName).shift();
        console.log("spec %o", functionSpec);
        const title = functionSpec.actionName ? functionSpec.actionName : functionSpec.name;
        const modalRef = this.modalService.open(FunctionCallDialogComponent, {backdrop: 'static'});

        // setup xmEntity only if selected
        if (this.selectedNode) {
            modalRef.componentInstance.xmEntity = this.selectedNode;
        }

        modalRef.componentInstance.functionSpec = functionSpec;
        modalRef.componentInstance.dialogTitle = title;
        modalRef.componentInstance.buttonTitle = title;
        modalRef.componentInstance.onSuccess = (funcResult) => {
            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS });
            swal({
                type: 'success',
                text: this.translateService.instant('ext-common-entity.entity-fab-actions.operation-success'),
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
            });
        };

        return modalRef;
    }

    private navigate(path, options) {
        this.router.navigate([path], {queryParams: options});
    }
}
