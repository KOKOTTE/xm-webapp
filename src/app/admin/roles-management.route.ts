import { Injectable } from '@angular/core';
import { CanActivate, Routes } from '@angular/router';

import { Principal } from '@xm-ngx/core/auth';
import { RoleMgmtDetailComponent } from '@xm-ngx/administration/roles-management/roles-management-detail.component';
import { RolesMgmtComponent } from '@xm-ngx/administration/roles-management/roles-management.component';

@Injectable()
export class RolesResolve implements CanActivate {

    constructor(private principal: Principal) {
    }

    public canActivate(): Promise<boolean> {
        return this.principal.identity().then(() => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

export const rolesMgmtRoute: Routes = [
    {
        path: 'roles-management',
        children: [
            {
                path: '',
                component: RolesMgmtComponent,
                data: {
                    privileges: {value: ['ROLE.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'global.menu.admin.rolesManagement',
                },
            },
            {
                path: 'role-management/:roleKey',
                component: RoleMgmtDetailComponent,
                data: {
                    privileges: {value: ['ROLE.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'rolesManagement.detail.title',
                },
            },
        ],
    },
];
