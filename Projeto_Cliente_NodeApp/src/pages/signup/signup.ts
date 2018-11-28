import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController, NavParams } from 'ionic-angular';

import { MenuPage } from '../menu/menu';
import { WelcomePage } from '../welcome/welcome';
import { User } from '../../providers/user/user';
import { Api } from '../../providers/api/api';
import { Pessoa } from '../../models/Pessoa';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  account: { id:number,name: string, email: string, password: string };
  p:Pessoa;
  flag: any = false;

  private signupErrorString: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, private alert: AlertController, public api: Api) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });
    this.flag = this.navParams.get("flag");
    this.p = this.navParams.get("p");
  }

  doSignup() {
    if (!this.flag) {
      this.user.signup(this.account).subscribe((res) => {
        let dados = res;
        this.alert.create({
          title: "Cadastro de Pessoa cadastrado com sucesso!",
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(MenuPage, { dados});
            }
          }]
        })
          .present();

      }, (err) => {

        this.navCtrl.push(WelcomePage);

        let toast = this.toastCtrl.create({
          message: this.signupErrorString + " " + err,
          duration: 3000,
          position: 'top'

        });
        toast.present();
      });
    }
    else
    {
      this.api.getId(this.p.id).subscribe((res:any)=>{

       this.account.name=res.nome;
       this.account.email=res.email;
       this.account.password=res.senha;
       this.account.id=res.id;
        this.api.put(this.account).subscribe(()=>{
          this.alert.create({
            title: "Cadastrode pessoa atualizado com sucesso!",
            buttons: [{
              text: "Confirmar",
              handler: () => {
                this.navCtrl.push(MenuPage);
              }
            }]
          })
            .present();

        },
        (err)=>{
          this.alert.create({
            title: "Erro ao atualizar pessoa",
            subTitle: err,
            buttons: [{
              text: "Confirmar",
              handler: () => {
                this.navCtrl.push(MenuPage);
              }
            }]
          })
            .present();
        });

      },
      (err)=>{
        this.alert.create({
          title: "Não foi encontrado o id da pessoa, Erro!",
          subTitle:err,
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(MenuPage);
            }
          }]
        })
          .present();
      });
    }
  }
}
