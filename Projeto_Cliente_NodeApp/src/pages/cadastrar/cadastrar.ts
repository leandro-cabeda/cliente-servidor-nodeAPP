import { EntrarPage } from './../entrar/entrar';
import { ApiProvider } from './../../providers/api/api';
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
  public flag: any;
  public flag2: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, private alert: AlertController, public api: ApiProvider) {
    this.pe = new Pessoa();
    this.flag = false;
    this.flag2 = this.navParams.get("flag2");
    this.p = this.navParams.get("p");

  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {

    if (this.flag2) {

      this.api.getId(this.p.id).subscribe(res => {
        this.pe.id = res.id;
        this.pe.nome = res.nome;
        this.pe.email = res.email;
        this.pe.senha = res.senha;
        this.flag = true;
      },
        (err: HttpErrorResponse) => {
          this.alert.create({
            title: "Erro ao resgatar ID da pessoa!",
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

  doSignup() {
    if (this.pe.nome.trim() != "" && this.pe.email.trim() != "" && this.pe.senha.trim() != "") {

      this.api.getEmail(this.pe.email).subscribe(res => {

        if (res != null && !this.flag) {
          this.alert.create({
            title: "Já consta este email no banco de dados!",
            buttons: [{
              text: "Confirmar",
            }]
          })
            .present();
        }
        else {

          if (!this.flag) {


            this.api.post(this.pe).subscribe(() => {

              this.alert.create({
                title: "Pessoa cadastrado com sucesso!",
                buttons: [{
                  text: "Confirmar",
                  handler: () => {
                    this.navCtrl.push(MenuPage);
                  }
                }]
              })
                .present();

            }, (err: HttpErrorResponse) => {

              this.navCtrl.push(EntrarPage);

              let toast = this.toastCtrl.create({
                message: err.error + "  " + err.message,
                duration: 4000,
                position: 'top'

              });
              toast.present();
            });

          }

          if (this.flag2) {

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
              (err: HttpErrorResponse) => {
                this.alert.create({
                  title: err.error,
                  subTitle: err.message,
                  buttons: [{
                    text: "Confirmar",
                    handler: () => {
                      this.navCtrl.push(EntrarPage);
                    }
                  }]
                })
                  .present();
              });

          }

        }

      }, (err: HttpErrorResponse) => {
        this.alert.create({
          title: err.error,
          subTitle: err.message,
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(EntrarPage);
            }
          }]
        })
          .present();
      });

    }
    else {
      let toast = this.toastCtrl.create({
        message: "Por favor preencha todos os campos!",
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }


  VoltarMenu() {
    this.navCtrl.push(MenuPage);
  }

  sair() {

    this.alert.create({
      title: "Você saiu!",
      buttons: [{
        text: "Confirmar",
        handler: () => {
          this.navCtrl.push(HomePage);
        }
      }]
    })
      .present();
  }


}


