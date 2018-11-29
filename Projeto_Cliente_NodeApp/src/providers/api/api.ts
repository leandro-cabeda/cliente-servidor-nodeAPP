import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class ApiProvider {

  url: string = 'https://localhost:3000/api';

  constructor(public http: HttpClient) {

  }

  databaseSqlite() {
    return this.http.get(this.url + '/banco');

  }

  get() {

    return this.http.get<Pessoa[]>(this.url + '/listatodos');
  }

  getId(id) {

    return this.http.get<Pessoa>(this.url + '/pegarID/', id);
  }

  post(dados) {
    return this.http.post<Pessoa>(this.url + "/cadastrar/", dados);
  }

  post2(dados) {
    return this.http.post<Pessoa>(this.url + "/entrar/", dados);
  }

  put(dados) {
    return this.http.put<Pessoa>(this.url + '/atualizar', dados);
  }

  delete(id) {
    return this.http.delete<Pessoa>(this.url + '/deletar/', id);
  }


}
