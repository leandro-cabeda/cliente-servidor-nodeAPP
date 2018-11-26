import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';

import { MenuPage } from '../menu/menu';
import { WelcomePage } from '../welcome/welcome';
import { User } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  account: { name: string, email: string, password: string };

  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, private alert: AlertController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });
  }

  doSignup() {
    this.user.signup(this.account).subscribe((resp) => {
      let dados=resp;
      this.alert.create({
        title: "Cadastro de Pessoa cadastrado com sucesso!",
        buttons: [{
          text: "Confirmar",
          handler: () => {
            this.navCtrl.push(MenuPage,{dados});
          }
        }]
      })
        .present();

    }, (err) => {

      this.navCtrl.push(WelcomePage);

      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'

      });
      toast.present();
    });
  }
}
