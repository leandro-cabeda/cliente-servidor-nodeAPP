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

    return this.http.get<Pessoa>(this.url + '/pegarID/' + id);
  }

  public getEmail(email: string) {

    return this.http.get<Pessoa>(this.url + '/pegarEmail/' + email);
  }

  public post(dados:Pessoa) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.getToken());
    let auth = header;
    let options = {
      headers: auth
    }

    return this.http.post(this.url + "/cadastrar/", dados, options);
  }

  public post2(dados:Pessoa) {

    return this.http.post<string>(this.url + "/entrar/", dados);
  }

  public put(dados:Pessoa) {

    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer '+this.getToken());
    let auth = header;
    let options = {
      headers: auth
    }

    return this.http.put(this.url + '/atualizar/', dados, options);
  }

  public delete(id:number) {

    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.getToken());
    let auth = header;
    let options = {
      headers: auth
    }

    return this.http.delete(this.url + '/deletar/' + id, options);
  }


  public getToken()
  {
    return this.token;
  }


}
