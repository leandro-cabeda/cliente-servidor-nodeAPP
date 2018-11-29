import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { MenuPage } from '../menu/menu';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-cadastrar',
  templateUrl: 'cadastrar.html',
})
export class CadastrarPage {

  pe: Pessoa;
  p: Pessoa;
  flag: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: UserProvider,
    public toastCtrl: ToastController, private alert: AlertController, public api: ApiProvider) {
    this.flag = this.navParams.get("flag");
    this.p = this.navParams.get("p");
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter()
  {

  }

  doSignup() {
    if (!this.flag) {
      this.user.signup(this.pe).subscribe((dados) => {

        this.alert.create({
          title: "Cadastro de Pessoa cadastrado com sucesso!",
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
    else {
      this.api.getId(this.p.id).subscribe((res: any) => {
        console.log(res);

        /* this.pe.nome=res.nome;
         this.pe.email=res.email;
         this.pe.senha=res.senha;
         this.pe.id=res.id;*/
        this.api.put(this.pe).subscribe(() => {
          this.alert.create({
            title: "Cadastro de pessoa atualizado com sucesso!",
            buttons: [{
              text: "Confirmar",
              handler: () => {
                this.navCtrl.push(MenuPage);
              }
            }]
          })
            .present();

        },
          (err) => {
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
        (err) => {
          this.alert.create({
            title: "Não foi encontrado o id da pessoa, Erro!",
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
    }
  }

}
