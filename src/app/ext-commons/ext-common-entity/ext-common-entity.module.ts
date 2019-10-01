import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { JhiLanguageHelper } from '../../shared';
import { ModulesLanguageHelper } from '../../shared/language/modules-language.helper';
import { XmSharedModule } from '../../shared/shared.module';
import { XmBalanceModule } from '../../xm-balance/xm-balance.module';
import { XmEntityModule } from '../../xm-entity/xm-entity.module';
import { XmTimelineModule } from '../../xm-timeline/xm-timeline.module';
import {
    AvailableOfferingsWidgetComponent,
    ChartistLineWidgetComponent,
    CustomerInfoWidgetComponent,
    EntityFabActionsComponent,
    EntityListWidgetComponent,
    EntityWidgetComponent,
    LocationCountriesWidgetComponent,
    LocationMapWidgetComponent,
    MdTableComponent,
    StatsWidgetComponent,
    TasksWidgetComponent,
} from './';
import { EntityStateCardComponent } from './entity-state-card/entity-state-card.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmEntityModule,
        XmBalanceModule,
        XmTimelineModule,
    ],
    declarations: [
        AvailableOfferingsWidgetComponent,
        ChartistLineWidgetComponent,
        CustomerInfoWidgetComponent,
        EntityFabActionsComponent,
        EntityListWidgetComponent,
        EntityWidgetComponent,
        LocationCountriesWidgetComponent,
        LocationMapWidgetComponent,
        MdTableComponent,
        StatsWidgetComponent,
        TasksWidgetComponent,
        EntityStateCardComponent,
    ],
    entryComponents: [
        AvailableOfferingsWidgetComponent,
        ChartistLineWidgetComponent,
        CustomerInfoWidgetComponent,
        EntityFabActionsComponent,
        EntityListWidgetComponent,
        EntityWidgetComponent,
        LocationCountriesWidgetComponent,
        LocationMapWidgetComponent,
        MdTableComponent,
        StatsWidgetComponent,
        TasksWidgetComponent,
        EntityStateCardComponent,
    ],
    providers: [
        {provide: 'xm-widget-available-offerings', useValue: AvailableOfferingsWidgetComponent},
        {provide: 'xm-widget-chartist-line', useValue: ChartistLineWidgetComponent},
        {provide: 'xm-widget-provide-customer-info', useValue: CustomerInfoWidgetComponent},
        {provide: 'xm-widget-entity-fab-actions', useValue: EntityFabActionsComponent},
        {provide: 'xm-widget-entities-list', useValue: EntityListWidgetComponent},
        {provide: 'xm-widget-entity', useValue: EntityWidgetComponent},
        {provide: 'xm-widget-general-map', useValue: LocationMapWidgetComponent},
        {provide: 'xm-widget-general-countries', useValue: LocationCountriesWidgetComponent},
        {provide: 'xm-widget-stats', useValue: StatsWidgetComponent},
        {provide: 'xm-widget-tasks', useValue: TasksWidgetComponent},
        {provide: 'xm-widget-entity-state-card', useValue: EntityStateCardComponent},
    ],
})
export class ExtCommonEntityModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey)});
    }
}
