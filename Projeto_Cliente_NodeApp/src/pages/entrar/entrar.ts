import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { HttpErrorResponse } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-entrar',
  templateUrl: 'entrar.html',
})
export class EntrarPage {

  public p: Pessoa;
  public token: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public toastCtrl: ToastController, private alert: AlertController) {
    this.p = new Pessoa();
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {

  }

  doLogin() {

    if (this.p.email.trim() != "" && this.p.senha.trim() != "") {
      this.api.post2(this.p).subscribe(res=> {

        this.token=res;
        this.api.Token(this.token);
        console.log("Valor token: "+this.token);

        this.alert.create({
          title: "Seja Bem vindo(a) ao Sistema",
          subTitle: "Login efetuado com sucesso!",
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(MenuPage.name);
            }
          }]
        })
          .present();

      },(err: HttpErrorResponse) => {

        let toast = this.toastCtrl.create({
          message: "Falha ao tentar logar!" + " " + err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: "Por favor preencha todos os campos!",
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }


  VoltarInicio() {
    this.navCtrl.push(HomePage);
  }


}
