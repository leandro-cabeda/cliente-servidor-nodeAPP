import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import { EntrarPage } from '../entrar/entrar';
import { CadastrarPage } from '../cadastrar/cadastrar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {


  }

  entrar() {
    this.navCtrl.push(EntrarPage.name);
  }

  cadastrar() {
    this.navCtrl.push(CadastrarPage.name);
  }

}
