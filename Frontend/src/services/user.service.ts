import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable()
export class UserService {
  public _baseUrl: string;

  constructor(private http: HttpClient) {
    this._baseUrl = 'http://localhost:5138/';
  }

  create(formData: any) {
    return this.http
      .post<any>(this._baseUrl + 'User', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Update(formData: any) {
    return this.http
      .put<any>(this._baseUrl + 'User', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Delete(id: any) {
    return this.http.delete<any>(this._baseUrl + 'User?id=' + id).pipe();
  }

  get(): Observable<User[]> {
    return this.http.get<User[]>(this._baseUrl + 'User');
  }
}
