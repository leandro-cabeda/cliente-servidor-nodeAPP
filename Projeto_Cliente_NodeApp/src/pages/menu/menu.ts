import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { ApiProvider } from '../../providers/api/api';
import { HomePage } from '../home/home';
import { CadastrarPage } from '../cadastrar/cadastrar';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public user: Pessoa;
  public users: Pessoa[];
  public flag: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private alert: AlertController) {

    this.user = this.navParams.get("dados");
    this.flag = false;
  }

  ionViewDidLoad() {
    this.carregarDadosPessoas();
  }

  ionViewDidEnter() {

  }

  carregarDadosPessoas() {
    this.api.get().subscribe((p: Pessoa[]) => {
      this.users = p;
      this.flag = true;
    },
      (err) => {
        this.alert.create({
          title: err,
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.flag = false;
            }
          }]
        })
          .present();
      });
  }

  novo() {
    let flag = false;
    this.navCtrl.push(CadastrarPage, { flag });
  }

  editar(p: Pessoa) {
    let flag = true;
    this.navCtrl.push(CadastrarPage, { p, flag });
  }

  excluir(id: number) {
    this.api.delete(id).subscribe(() => {
      this.alert.create({
        title: "Deletado com sucesso!",
        buttons: [{
          text: "Confirmar",
          handler: () => {
            this.carregarDadosPessoas();
          }
        }]
      })
        .present();
    },
      (err) => {
        this.alert.create({
          title: "Erro!",
          subTitle: err,
          buttons: [{
            text: "Confirmar"
          }]
        })
          .present();
      });
  }

  sair() {
    this.user = null;
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
