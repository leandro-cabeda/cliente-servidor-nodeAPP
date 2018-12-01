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
  public flag2:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, private alert: AlertController, public api: ApiProvider) {
    this.pe = new Pessoa();
    this.flag = false;
    console.log("Valor flag inicial: "+this.flag);

    this.flag2 = this.navParams.get("flag2");
    console.log("Valor flag2 quando editar: " + this.flag2);

    if(this.flag2){
      this.p = this.navParams.get("p");
      this.pe.id=this.p.id;
      this.pe.nome = this.p.nome;
      this.pe.email = this.p.email;
      this.pe.senha = this.p.senha;
    }


  }

  ionViewDidLoad() {

  }

  ionViewDidEnter()
  {

  }

  doSignup() {
    if (!this.flag) {
      this.api.post(this.pe).subscribe(dados => {
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
    if (this.flag2){

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

      }
  }

}
