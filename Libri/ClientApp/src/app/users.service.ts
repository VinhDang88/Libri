import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  endpoint: string = "api/Books";

  addUsers(id: string, firstName: string, lastName: string, name: string, photoUrl: string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/AddUser?id=${id}&firstName=${firstName}&lastName=${lastName}
    &name=${name}&photoUrl=${photoUrl}`, {});
  }

}
