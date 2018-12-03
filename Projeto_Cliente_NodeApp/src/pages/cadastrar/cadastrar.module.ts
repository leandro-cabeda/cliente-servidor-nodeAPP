import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastrarPage } from './cadastrar';

@NgModule({
  declarations: [
    CadastrarPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastrarPage),
  ],
  exports: [
    CadastrarPage
  ]
})
export class CadastrarPageModule {}
