import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { Principal } from '../../shared';
import { Password } from './password.service';
import { ChangePassword } from './password.model';

@Component({
    selector: 'xm-password',
    templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit {
    doNotMatch: string;
    error: string;
    success: string;
    account: any;
    password: ChangePassword;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private passwordService: Password,
        private principal: Principal
    ) {
        this.jhiLanguageService.addLocation('password');
        this.password = new ChangePassword();
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
    }

    changePassword() {
        if (this.password.newPassword !== this.password.confirmNewPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.passwordService.save(this.password).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        }
    }
}
