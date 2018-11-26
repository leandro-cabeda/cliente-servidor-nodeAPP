import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class Api {
  url: string = 'https://localhost:3000/api';

  constructor(public http: HttpClient, public storage: Storage) {
  }

  /*load() {
    return this.storage.get().then(() => {
    });
  }*/

  databaseSqlite()
  {
    return this.http.get(this.url+'/banco');

  }

  get() {

    return this.http.get(this.url + '/listatodos');
  }

  getId(id:any) {

    return this.http.get(this.url + '/pegarID/',id);
  }

  post(dados:any) {
    return this.http.post(this.url + "/cadastrar/",dados);
  }

  post2(dados: any) {
    return this.http.post(this.url + "/entrar/", dados);
  }

  put(dados: any) {
    return this.http.put(this.url + '/atualizar',dados);
  }

  delete(id:any) {
    return this.http.delete(this.url + '/deletar/',id);
  }


}
