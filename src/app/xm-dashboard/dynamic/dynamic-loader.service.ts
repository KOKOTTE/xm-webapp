import {
    Compiler, ComponentFactory,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    NgModuleRef,
    Optional,
    Type,
} from '@angular/core';

export interface IDynamicModule<T> {
    entry?: Type<T>;
}

export type DynamicNgModuleFactory<T> = NgModuleFactory<IDynamicModule<T>>;

@Injectable({
    providedIn: 'root',
})
export class DynamicLoaderService {

    constructor(
        @Optional() private compiler: Compiler,
        private moduleRef: NgModuleRef<unknown>,
        private loader: NgModuleFactoryLoader,
    ) {
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<ComponentFactory<T> | null> {
        const moduleFac = injector.get(selector);
        const moduleFactory = await this.loadModuleFactory<T>(moduleFac);
        const moduleRef = moduleFactory.create(injector);
        const componentRef = moduleRef.instance.entry;
        return moduleRef.componentFactoryResolver.resolveComponentFactory(componentRef);
    }

    public async loadModuleFactory<T>(
        moduleImport: Promise<DynamicNgModuleFactory<T>> | string,
    ): Promise<DynamicNgModuleFactory<T>> {
        let elementModuleOrFactory: DynamicNgModuleFactory<T>;
        if (typeof moduleImport === 'string') {
            elementModuleOrFactory = await this.loader.load(moduleImport);
        } else {
            elementModuleOrFactory = await moduleImport;
        }

        let elModuleFactory: DynamicNgModuleFactory<T>;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elModuleFactory = elementModuleOrFactory;
        } else {
            elModuleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as DynamicNgModuleFactory<T>;
        }

        return elModuleFactory;
    }

    public getComponentFromModule<T>(
        moduleFactory: DynamicNgModuleFactory<T>,
        injector: Injector = this.moduleRef.injector,
    ): Type<T> {
        const elementModuleRef = moduleFactory.create(injector);
        if (!elementModuleRef.instance.entry) {
            throw new Error(`ERROR: the "${moduleFactory.moduleType}" module expected to have `
                + 'a "entry" field!'
                + 'E.g. class MyModule{ entry = YourComponent; }');
        }

        return elementModuleRef.instance.entry;
    }
}
