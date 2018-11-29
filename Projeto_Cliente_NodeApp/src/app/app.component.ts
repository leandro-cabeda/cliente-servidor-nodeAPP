import { ApiProvider } from './../providers/api/api';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public api: ApiProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      this.api.databaseSqlite()
        .subscribe(() => {
          console.log("Criado o banco de dados de pessoa com sucesso!!");
        },
          err => {
            console.log("Ocorreu erro na criação do banco: " );
            for(let er in err)
            {
              console.log(er);
            }
          }
        );

    });
  }
}

