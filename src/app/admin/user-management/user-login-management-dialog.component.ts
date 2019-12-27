import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../shared';

@Component({
    selector: 'xm-user-login-mgmt-dialog',
    templateUrl: './user-login-management-dialog.component.html',
})
export class UserLoginMgmtDialogComponent implements OnInit {

    @Input() public user: User;

    constructor(public activeModal: NgbActiveModal) {}

    public ngOnInit(): void {
    }

    public close(): void {
        this.activeModal.dismiss();
    }
}
