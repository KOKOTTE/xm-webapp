import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as _ from 'lodash';

interface Layout {
    content?: Layout[];
    selector?: string;
    class?: string;
    style?: string;
}

interface SanitizedLayout {
    layout: Layout;
    isCustomElement: boolean;
    customParams: unknown;
}

@Component({
    selector: 'xm-dynamic-widget-layout, [xm-dynamic-widget-layout]',
    template: `
        <ng-template #tagRef let-item="item">
            <div [class]="item.layout.class"
                 [style]="item.layout.style"
                 xm-dynamic-widget-layout
                 [resolveCustomParams]="resolveCustomParams"
                 [isCustomElement]="isCustomElement"
                 [layouts]="item.layout.content">
            </div>
        </ng-template>

        <ng-template #dynamicRef let-item="item">
            <ng-container xm-dynamic-widget
                          [class]="item.layout.class"
                          [style]="item.layout.style"
                          [init]="item.customParams">
                <ng-container xm-dynamic-widget-layout
                              [resolveCustomParams]="resolveCustomParams"
                              [isCustomElement]="isCustomElement"
                              *ngIf="item.layout.content"
                              [layouts]="item.layout.content"></ng-container>
            </ng-container>
        </ng-template>

        <ng-template ngFor [ngForOf]="sanitizedLayouts" let-item>
            <!-- resolve as html tag or dynamic injector -->
            <ng-container *ngIf="item"
                          [ngTemplateOutlet]="item.isCustomElement ? dynamicRef : tagRef"
                          [ngTemplateOutletContext]="{item: item}">
            </ng-container>
        </ng-template>
    `,
})
export class DynamicWidgetLayoutComponent implements OnChanges {
    public sanitizedLayouts: SanitizedLayout[];
    @Input() public layouts: Layout[];

    constructor(private sanitizer: DomSanitizer) {
    }

    public sanitize(unsafeStyle: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
    }

    @Input()
    public isCustomElement(layout: Layout): boolean {
        return layout.selector !== 'div';
    }

    @Input()
    public resolveCustomParams: (layout: Layout) => Layout = (layout: Layout) => {
        return layout;
    };

    public ngOnChanges(changes: SimpleChanges): void {
        this.sanitizeLayouts();
    }

    private sanitizeLayouts(): void {
        this.sanitizedLayouts = _.map(this.layouts, (i) => this.sanitizeLayoutNode(i));
    }

    private sanitizeLayoutNode(node: Layout): SanitizedLayout {
        const obj: SanitizedLayout = {
            layout: node,
            isCustomElement: this.isCustomElement(node),
            customParams: node,
        };
        if (obj.isCustomElement) {
            obj.customParams = this.resolveCustomParams(node);
        }
        return obj;
    }
}
