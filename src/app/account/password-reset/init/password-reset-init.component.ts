import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { PasswordResetInit } from './password-reset-init.service';
import { MatInput } from '@angular/material';

@Component({
    selector: 'xm-password-reset-init',
    templateUrl: './password-reset-init.component.html'
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;

    @ViewChild('emailInputElement', {static: false}) emailInputElement: MatInput;

    constructor(private passwordResetInit: PasswordResetInit) {
    }

    ngOnInit() {
        this.resetAccount = {};
    }

    ngAfterViewInit() {
        this.emailInputElement.focus();
    }

    requestReset() {
        this.error = null;
        this.errorEmailNotExists = null;

        this.passwordResetInit.save(this.resetAccount.email).subscribe(() => {
            this.success = 'OK';
        }, (response) => {
            this.success = null;
            if (response.status === 400 && response.data === 'email address not registered') {
                this.errorEmailNotExists = 'ERROR';
            } else {
                this.error = 'ERROR';
            }
        });
    }
}
