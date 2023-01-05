import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class APIService {
  public _baseUrl: string;

  constructor(private http: HttpClient) {
    this._baseUrl = 'https://localhost:7150/';
  }

  create(url: string, formData: any) {
    return this.http
      .post<any>(this._baseUrl + url, formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Update(url: string, formData: any) {
    return this.http
      .put<any>(this._baseUrl + url, formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Delete(url: string, id: any) {
    return this.http.delete<any>(this._baseUrl + `${url}?id=` + id).pipe();
  }

  get(url: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.get<any>(this._baseUrl + url, httpOptions);
  }

  signalRConnectionInitilization() {
    let connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this._baseUrl + 'broadcast-message', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    connection
      .start()
      .then(function () {
        console.log('SignalR Connection Established');
      })
      .catch(function (err) {
        return console.error(
          'SignalR Connection Failed: It is require to smooth and realtime process.',
          err.toString()
        );
      });

    return connection;
  }
}
