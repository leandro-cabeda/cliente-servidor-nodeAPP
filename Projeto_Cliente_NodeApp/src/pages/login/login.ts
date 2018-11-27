import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';

import { MenuPage } from '../menu/menu';
import { WelcomePage } from '../welcome/welcome';
import { User } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: {email: string, password: string };


  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, private alert: AlertController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  doLogin() {
    this.user.login(this.account).subscribe((res) => {

      let dados=res;

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
      this.navCtrl.push(WelcomePage);
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
