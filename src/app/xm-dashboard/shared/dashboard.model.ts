import { BaseEntity } from './../../shared';
import { Widget } from './widget.model';

export class Dashboard implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public owner?: string,
        public typeKey?: string,
        public layout?: any,
        public config?: any,
        // tslint:disable-next-line:bool-param-default
        public isPublic?: boolean,
        public widgets?: Widget[],
    ) {
        this.isPublic = false;
    }
}
