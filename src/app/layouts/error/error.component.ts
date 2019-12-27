import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xm-error',
    templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
    public errorMessage: string;
    public error403: boolean;

    constructor(private route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.route.data.subscribe((routeData) => {
            if (routeData.error403) {
                this.error403 = routeData.error403;
            }
            if (routeData.errorMessage) {
                this.errorMessage = routeData.errorMessage;
            }
        });
    }
}
