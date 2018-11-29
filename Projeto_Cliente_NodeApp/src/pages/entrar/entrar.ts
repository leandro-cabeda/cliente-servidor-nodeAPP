import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';


@IonicPage()
@Component({
  selector: 'page-entrar',
  templateUrl: 'entrar.html',
})
export class EntrarPage {

  p: Pessoa;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: UserProvider,
    public toastCtrl: ToastController, private alert: AlertController) {
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {

  }

  doLogin() {
    this.user.login(this.p).subscribe((dados) => {

      this.alert.create({
        title: "Login efetuado com sucesso!",
        buttons: [{
          text: "Confirmar",
          handler: () => {
            this.navCtrl.push(MenuPage, { dados });
          }
        }]
      })
        .present();

    }, (err) => {
      this.navCtrl.push(HomePage);
      let toast = this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
