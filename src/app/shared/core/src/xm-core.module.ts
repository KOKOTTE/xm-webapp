import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {XmSessionService} from './xm-session.service';
import {XmUiConfigService} from './xm-ui-config.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class XmCoreModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: XmCoreModule,
            providers: [XmSessionService, XmUiConfigService],
        }
    }

}
