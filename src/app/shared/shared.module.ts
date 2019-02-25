import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { MarkdownModule } from 'ngx-markdown';
import { CovalentTextEditorModule } from '@covalent/text-editor';

import {
    AccountService,
    AuthServerProvider,
    AuthService,
    ClientService,
    ContextService,
    CSRFService,
    FocusDirective,
    HasAnyAuthorityDirective,
    I18nJsfPipe,
    I18nNamePipe,
    JhiSocialComponent,
    LoaderComponent,
    LoginComponent,
    LoginService,
    NoDataComponent,
    ParseByPathService,
    PermitDirective,
    PerPageComponent,
    PrivilegeService,
    RegisterComponent,
    RegisterService,
    StateStorageService,
    UserLoginFormComponent,
    UserLoginService,
    UserService,
    WordAutocompleteDirective,
    XmConfigService,
    XmConfirmDialogComponent,
    XmPasswordNeededComponent,
    XmPrivilegeDirective
} from './';
import { PrivacyAndTermsDialogComponent } from './components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { AceEditorDirective } from './directives/ace-editor.directive';
import { SafeNamePipe } from './helpers/safe-name.pipe';
import { XmDateTimePipe } from './helpers/xm-date-time.pipe';
import { XmEntityStateSpecPipe } from './helpers/xm-entity-state-spec.pipe';
import { MultilingualInputComponent } from './jsf-extention/widgets/multilingual-input/multilingual-input.component';
import { DatetimeUtcComponent } from './jsf-extention/widgets/datetime-utc/datetime-utc.component';
import { CurrentLocationComponent } from './jsf-extention/widgets/current-location/current-location.component';
import { ExtAutocompleteService } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete.component';
import { ExtMultiSelectComponent } from './jsf-extention/widgets/ext-multi-select/ext-multi-select.component';
import { ExtSelectService } from './jsf-extention/widgets/ext-select/ext-select-service';
import { ExtSelectComponent } from './jsf-extention/widgets/ext-select/ext-select.component';
import { ExtMdEditorComponent } from './jsf-extention/widgets/ext-md-editor/ext-md-editor.component';
import { ExtTextareaComponent } from './jsf-extention/widgets/ext-textarea/ext-textarea.component';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { RoleService } from './role/role.service';
import { GateSharedCommonModule } from './shared-common.module';
import { GateSharedLibsModule } from './shared-libs.module'
import { MatModule } from '../mat.module';
import { ValidationComponent } from './jsf-extention/widgets/validation-component/validation-component.component';
import { XmCondition } from './helpers/xm-condition';
import { DigitOnlyDirective } from './directives/digit-only.directive';

@NgModule({
    imports: [
        GateSharedLibsModule,
        GateSharedCommonModule,
        ReCaptchaModule,
        MarkdownModule.forChild(),
        MatModule,
        CovalentTextEditorModule
    ],
    declarations: [
        AceEditorDirective,
        JhiSocialComponent,
        LoginComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmEntityStateSpecPipe,
        XmDateTimePipe,
        UserLoginFormComponent,
        LoaderComponent,
        WordAutocompleteDirective,
        FocusDirective,
        DigitOnlyDirective,
        PerPageComponent,
        NoDataComponent,
        PermitDirective,
        XmPrivilegeDirective,
        PasswordStrengthBarComponent,
        XmPasswordNeededComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ValidationComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        PrivacyAndTermsDialogComponent
    ],
    entryComponents: [
        LoginComponent,
        RegisterComponent,
        UserLoginFormComponent,
        PasswordStrengthBarComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        PrivacyAndTermsDialogComponent
    ],
    providers: [
        CookieService,
        { provide: CookieOptions, useValue: {} },
        ContextService,
        LoginService,
        RegisterService,
        AccountService,
        StateStorageService,
        CSRFService,
        AuthServerProvider,
        AuthService,
        UserService,
        ClientService,
        ExtSelectService,
        ExtAutocompleteService,
        UserLoginService,
        DatePipe,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmDateTimePipe,
        RoleService,
        PrivilegeService,
        ParseByPathService,
        PasswordStrengthBarComponent,
        XmConfigService
    ],
    exports: [
        AceEditorDirective,
        GateSharedCommonModule,
        JhiSocialComponent,
        LoginComponent,
        UserLoginFormComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmEntityStateSpecPipe,
        XmDateTimePipe,
        LoaderComponent,
        PerPageComponent,
        NoDataComponent,
        WordAutocompleteDirective,
        FocusDirective,
        DigitOnlyDirective,
        PermitDirective,
        XmPrivilegeDirective,
        PasswordStrengthBarComponent,
        XmPasswordNeededComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        MatModule,
        DatetimeUtcComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class XmSharedModule {
}
