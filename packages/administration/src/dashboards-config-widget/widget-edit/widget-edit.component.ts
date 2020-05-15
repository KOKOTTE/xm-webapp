import { Component, HostListener, Input } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { DashboardWrapperService, PageService, Widget } from '@xm-ngx/dynamic';
import { XmToasterService } from '@xm-ngx/toaster';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES, EDIT_DASHBOARD_EVENT } from '../const';
import { DashboardEditComponent, EditType } from '../dashboard-edit/dashboard-edit.component';
import { DashboardEditorService } from '../dashboard-editor.service';
import { DashboardCollection, WidgetCollection } from '../injectors';

@Component({
    selector: 'xm-widget-edit',
    templateUrl: './widget-edit.component.html',
    styleUrls: ['./widget-edit.component.scss'],
})
export class WidgetEditComponent {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public EditType: typeof EditType = EditType;
    public formGroup: Widget = {
        name: '',
        selector: '',
        config: '',
    };
    public loading$: Observable<boolean>;
    public disabled: boolean;

    public aceEditorOptions: { title: string; height: string } = {title: '', height: 'calc(100vh - 280px)'};

    public editType: EditType;

    constructor(
        protected readonly widgetService: WidgetCollection,
        protected dashboardService: DashboardCollection,
        protected readonly editorService: DashboardEditorService,
        protected readonly eventManager: XmEventManager,
        protected readonly alertService: XmAlertService,
        protected readonly wrapperService: DashboardWrapperService,
        protected readonly pageService: PageService,
        protected readonly principal: Principal,
        protected readonly toasterService: XmToasterService) {
        this.loading$ = this.widgetService.loading$.pipe(tap((i) => this.disabled = i));
    }

    private _value: Widget;

    public get value(): Widget {
        return this._value;
    }

    @Input()
    public set value(value: Widget) {
        this.formGroup = this._value = value as any;

        if (value && value.id) {
            this.editType = EditType.Edit;
        } else {
            this.editType = EditType.Create;
        }
    }

    public onCancel(): void {
        this.editorService.close();
    }

    public onAdd(): void {
        const req: any = this.formGroup;

        this.widgetService.create(req).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.created,
                    textOptions: {value: res.name},
                }).subscribe();
                this.value = res;
                this.editType = EditType.Edit;
                this.eventManager.broadcast({name: EDIT_DASHBOARD_EVENT, id: this.value.id, add: true});
            }),
        ).subscribe(() => this.updateView());
    }

    public onSave(): void {
        this.widgetService.update(this.formGroup).pipe(
            tap((res) => this.toasterService.create({
                type: 'success',
                text: DASHBOARDS_TRANSLATES.updated,
                textOptions: {value: res.name},
            }).subscribe()),
        ).subscribe(() => this.updateView());
    }

    public onDelete(): void {
        this.alertService.delete({textOptions: {value: this.value.name}}).pipe(
            filter((i) => i.value),
            switchMap(() => this.widgetService.delete(this.value.id)),
            tap(() => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.deleted,
                    textOptions: {value: this.value.name},
                }).subscribe();
                this.editorService.close();
                this.eventManager.broadcast({name: EDIT_DASHBOARD_EVENT, id: this.value.id, delete: true});
            }),
        ).subscribe(() => this.updateView());
    }

    @HostListener('keydown.control.s', ['$event'])
    public onCtrlS($event: KeyboardEvent): boolean {
        this.onSave();
        $event.preventDefault();
        return false;
    }

    public backToOrganisation(): void {
        const id = this.value.dashboard.id;
        this.dashboardService.getById(id).subscribe((i) => {
            this.editorService.editDashboard(DashboardEditComponent, i);
        });
    }

    private updateView(): void {
        this.wrapperService.forceReload();
        this.pageService.load(this.value.dashboard.id);
    }
}
