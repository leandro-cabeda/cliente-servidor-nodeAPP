import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class ApiProvider {

  public url: string = 'http://localhost:8080/api';
  public token:string;

  constructor(public http: HttpClient) {

  }

  public Token(toke:string)
  {
    this.token=toke;
  }

  public databaseSqlite() {

    return this.http.get(this.url + '/banco');

  }

  public get() {

    return this.http.get<Pessoa[]>(this.url + '/listatodos');
  }

  public getId(id:number) {

    return this.http.get<Pessoa>(this.url + '/pegarID/' +id);
  }

  public getEmail(email: string) {

    return this.http.get<Pessoa>(this.url + '/pegarEmail/' + email);
  }

  public post(dados:Pessoa) {

    return this.http.post(this.url + "/cadastrar/", dados);
  }

  public post2(dados:Pessoa) {
    let header = new HttpHeaders();
    header.append('Authorization', 'Bearer 123');
    let auth=header;
    let options = {
      headers: auth
    }
    return this.http.post<string>(this.url + "/entrar/", dados,options);
  }

  public put(dados:Pessoa) {
    console.log("valor options put: ");

    return this.http.put(this.url + '/atualizar/', dados);
  }

  public delete(id:number) {

    return this.http.delete(this.url + '/deletar/' + id);
  }


}
