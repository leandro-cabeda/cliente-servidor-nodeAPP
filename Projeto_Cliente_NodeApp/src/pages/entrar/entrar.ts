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

      /*
        Esse método api.post2 envia o email e a senha la  para api.ts
        que enviada para api do servidor, caso deu sucesso que é o subscribe
        a variavel token recebe a resposta e envia para outra função api.token
        que enviado la pra api.ts
        Essa resposta que retorna seria o token criado e retornado depois
        de ter feito o login com email e senha
      */
      this.api.post2(this.p).subscribe(res=> {

        this.token=res;
        this.api.Token(this.token);

        let nome=this.p.email.split("@")[0];
        let carc=[".","-","_","1","2","3","4","5","6","7","8","9","0"];
        for(let c of carc)
        {
          nome=nome.replace(c,"");
        }

        this.alert.create({
          title: "Seja Bem vindo(a) ao Sistema "+nome.toUpperCase(),
          subTitle: "Login efetuado com sucesso!",
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(MenuPage);
            }
          }]
        })
          .present();

      },(err: HttpErrorResponse) => {

        let toast = this.toastCtrl.create({
          message: "Falha ao tentar logar!" + " " + err.error,
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
