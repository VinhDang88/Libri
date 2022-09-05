import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  endpoint: string = "api/Users";

  addUsers(id: string, firstName: string, lastName: string, name: string, photoUrl: string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/AddUser?id=${id}&firstName=${firstName}&lastName=${lastName}
    &name=${name}&photoUrl=${photoUrl}`, {});
  }

  GetUsersByName(name:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetUsersByName?name=${name}`);
  }

  GetUserById(id:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetUserById?id=${id}`);
  }

  GetUserBySqlId(id:number):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetUserBySqlId?id=${id}`)
  }

  FollowUser(userFollowedId:string, userId:string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/FollowUser?userFollowedId=${userFollowedId}&userId=${userId}`, {});
  }

  UnFollow(userFollowedId:string, userId:string):any{
    return this.http.delete(`${this.baseUrl}${this.endpoint}/UnFollow?userFollowedId=${userFollowedId}&userId=${userId}`);
  }

  GetFollowing(userId:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetFollowing?userId=${userId}`);
  }  

  GetFollowedUsers(userId:string):any{
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetFollowedUsers?userId=${userId}`);
  }
}
