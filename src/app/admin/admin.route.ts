import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import {
    auditsRoute,
    clientMgmtRoute,
    docsRoute,
    formPlaygroundRoute,
    gatewayRoute,
    healthRoute,
    logsRoute,
    maintenanceRoute,
    metricsRoute,
    rolesMatrixRoute,
    rolesMgmtRoute,
    translationRoute,
    userMgmtRoute,
} from './';

const ADMIN_ROUTES = [
    auditsRoute,
    docsRoute,
    healthRoute,
    formPlaygroundRoute,
    maintenanceRoute,
    translationRoute,
    logsRoute,
    gatewayRoute,
    ...rolesMatrixRoute,
    ...userMgmtRoute,
    ...clientMgmtRoute,
    ...rolesMgmtRoute,
    metricsRoute,
];

export const adminState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN'],
    },
    // canActivate: [UserRouteAccessService],
    canActivateChild: [UserRouteAccessService],
    children: ADMIN_ROUTES,
},
];
