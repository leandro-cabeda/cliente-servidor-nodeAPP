import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { MenuPage } from '../menu/menu';
import { HomePage } from '../home/home';
import { HttpErrorResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-cadastrar',
  templateUrl: 'cadastrar.html',
})
export class CadastrarPage {

  public pe: Pessoa;
  public p: Pessoa;
  public flag: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: UserProvider,
    public toastCtrl: ToastController, private alert: AlertController, public api: ApiProvider) {
    this.flag = this.navParams.get("flag");
    this.p = this.navParams.get("p");
    this.pe = new Pessoa();
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter()
  {

  }

  doSignup() {
    if (!this.flag) {
      this.user.signup(this.pe).subscribe(dados => {
        console.log("Chamou doSignup! " + dados);
        this.alert.create({
          title: "Pessoa cadastrado com sucesso!",
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(MenuPage, { dados });
            }
          }]
        })
          .present();

      }, (err: HttpErrorResponse) => {

        this.navCtrl.push(HomePage);

        let toast = this.toastCtrl.create({
          message: "Falha ao tentar cadastrar pessoa!" + " " + err.message,
          duration: 3000,
          position: 'top'

        });
        toast.present();
      });
    }
    else {
      this.api.getId(this.p.id).subscribe(res => {
        console.log("Chamou api getid! " + res.nome);

        this.pe.nome=res.nome;
         this.pe.email=res.email;
         this.pe.senha=res.senha;
         this.pe.id=res.id;
        this.api.put(this.pe).subscribe(() => {
          console.log("Chamou api put! ");
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
          (err: HttpErrorResponse) => {
            this.alert.create({
              title: "Erro ao atualizar pessoa",
              subTitle: err.message,
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
        (err: HttpErrorResponse) => {
          this.alert.create({
            title: "Não foi encontrado o id da pessoa, Erro!",
            subTitle: err.message,
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
