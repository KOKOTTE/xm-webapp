import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProdConfig } from './blocks/config/prod.config';
import { XmModule } from './xm.module';

ProdConfig();

platformBrowserDynamic().bootstrapModule(XmModule);
