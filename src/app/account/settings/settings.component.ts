import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService, LANGUAGES, Principal } from '../../shared';
import { XmConfigService } from '../../shared/spec/config.service';
import { DEFAULT_LANG, XM_EVENT_LIST } from '../../xm.constants';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'xm-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {

    public error: string;
    public success: string;
    public securityChanged: boolean;
    public settingsAccount: any;
    public languages: any[];
    public tfaEnabled: boolean;
    public autoLogoutEnabled: boolean;
    public autoLogoutTime: number;
    public clock: Observable<Date>;
    public time: any;
    public utcTime: any;
    public timeZoneOffset: string;

    private _clockSubscription: Subscription;

    constructor(private accountService: AccountService,
                private principal: Principal,
                private translateService: TranslateService,
                private jhiLanguageService: JhiLanguageService,
                private $sessionStorage: SessionStorageService,
                private eventManager: JhiEventManager,
                private xmConfig: XmConfigService) {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
            this.tfaEnabled = this.settingsAccount.tfaEnabled;
            this.autoLogoutTime = this.settingsAccount.autoLogoutTime;
            this.autoLogoutEnabled = this.settingsAccount.autoLogoutEnabled;
            this.securityChanged = false;
            this.updateLang();
            this.timeZoneOffset = account.timeZoneOffset || '';
        });
    }

    public ngOnInit(): void {
        this.xmConfig.getUiConfig().subscribe(
            (data) => {
                this.languages = (data && data.langs) ? data.langs : [DEFAULT_LANG];
            },
            (err) => {
                // tslint:disable-next-line
                console.error(err);
                this.languages = [DEFAULT_LANG];
            }, () => console.log('Languages: %o', this.languages),// tslint:disable-line
        );
        this.clock = interval(1000).pipe(map(() => new Date()));
        this._clockSubscription = this.getClock().subscribe((time) => {
            this.time = this.utcTime = time;
        });
    }

    public ngOnDestroy(): void {
        this._clockSubscription.unsubscribe();
    }

    public getClock(): Observable<Date> {
        return this.clock;
    }

    public ngAfterViewInit(): void {
        this.updateLang();
    }

    public updateLang(): void {
        if (!this.languages || !this.settingsAccount) {
            return;
        }

        for (const lang of this.languages) {
            if (lang === this.settingsAccount.langKey) {
                return;
            }
        }

        this.settingsAccount.langKey = this.languages[0];
    }

    public save(): void {
        this.accountService.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
                this.setLanguage(this.settingsAccount.langKey);
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    public updateSecuritySettings(): void {

        // LOGIN.EMAIL
        if (this.tfaEnabled) {
            this.accountService.enableTFA('email', this.findEmail(this.settingsAccount)).subscribe(() => {
                this.securityChanged = true;
                this.updatePrincipalIdentity();
            });
        } else {
            this.accountService.disableTFA().subscribe(() => {
                this.securityChanged = true;
                this.updatePrincipalIdentity();
            });
        }

    }

    private findEmail(account: any): string {
      if (account && account.logins) {
        for (const entry of account.logins) {
          if (entry.typeKey === 'LOGIN.EMAIL') {
            return entry.login;
          }
        }
      }
      return '';
    }

    private updatePrincipalIdentity(): void {
      this.principal.identity(true).then((account) => {
        this.settingsAccount = this.copyAccount(account);
      });
    }

    private copyAccount(account: any): any {
        return {
            id: account.id,
            userKey: account.userKey,
            activated: account.activated,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            logins: account.logins,
            imageUrl: account.imageUrl,
            accessTokenValiditySeconds: account.accessTokenValiditySeconds,
            refreshTokenValiditySeconds: account.refreshTokenValiditySeconds,
            tfaEnabled: account.tfaEnabled,
            autoLogoutEnabled: account.autoLogoutEnabled,
            autoLogoutTime: account.autoLogoutTimeoutSeconds,
        };
    }

    private setLanguage(lang: string): void {
        this.jhiLanguageService.changeLanguage(lang);
        this.translateService.setDefaultLang(lang);
        this.principal.setLangKey(lang);
        this.storeTranslates(lang);
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_CHANGE_LANGUAGE, content: lang});
    }

    private storeTranslates(langKey: string): void {
        this.translateService.getTranslation(langKey).subscribe((res) => {
            LANGUAGES.forEach((lang) => {
                this.$sessionStorage.clear(lang);
            });
            this.$sessionStorage.store(langKey, JSON.stringify(res));
            this.$sessionStorage.store('currentLang', langKey);
        });
    }
}
