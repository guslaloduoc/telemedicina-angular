import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../../core/core.module';

@Component({
  selector: 'app-public-layout',
  standalone: true, // Se mantiene como standalone
  imports: [
    CoreModule,
    RouterModule  
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {

}
