import { MenuPage } from './../../../Cliente_NodeApp/src/pages/menu/menu';
import { CadastrarPage } from './../pages/cadastrar/cadastrar';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ApiProvider } from '../providers/api/api';
import { UserProvider } from '../providers/user/user';
import { EntrarPage } from '../pages/entrar/entrar';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EntrarPage,
    CadastrarPage,
    MenuPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    HttpClient,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EntrarPage,
    CadastrarPage,
    MenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    UserProvider
  ]
})
export class AppModule {}
