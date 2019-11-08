import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from '../../xm-entity';

@Pipe({name: 'xmEntityIcon'})
export class XmEntityIconPipe implements PipeTransform {

  public transform(typeKey: string, spec: Spec): string {
      return spec.types.filter( (t) => t.key === typeKey).shift().icon;
  }

}
