import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';

import SwaggerUI from 'swagger-ui';

@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html'
})
export class JhiDocsComponent implements OnInit, AfterViewInit {

    swaggerResources: any[];
    currentResource: any;

    constructor(
        private http: HttpClient,
        private auth: AuthServerProvider
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.http
            .get('/swagger-resources')
            .subscribe((data: any[]) => {
                this.swaggerResources = data;
                this.currentResource = this.swaggerResources[0].location;
                this.updateSwagger(this.currentResource);
            });
    }

    updateSwagger(resource) {
        const authToken = this.auth.getToken();
        const swagger  = new SwaggerUI({
            dom_id: '#swaggerHolder',
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            url: window.location.protocol + '//' + window.location.host + resource,
            docExpansion: 'none',
            apisSorter: 'alpha',
            showRequestHeaders: false,
            validatorUrl: null,
            configs: {
                preFetch: function(req) {
                    if (authToken) {
                        req.headers['Authorization'] = 'Bearer ' + authToken;
                    }
                    return req;
                }
            },
        });
    }
}
