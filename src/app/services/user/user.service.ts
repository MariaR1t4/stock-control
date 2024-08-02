import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAuthRequest } from 'src/app/models/interfaces/user/auth/IAuthRequest';
import { IAuthResponse } from 'src/app/models/interfaces/user/auth/IAuthResponse';
import { ISignUpUserRequest } from 'src/app/models/interfaces/user/ISignUpUserRequest';
import { ISignUpUserResponse } from 'src/app/models/interfaces/user/ISignUpUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie:CookieService) { }
  signUpUser(requestDatas: ISignUpUserRequest): Observable<ISignUpUserResponse>{
    return this.http.post<ISignUpUserResponse>(
      `${this.API_URL}/user`,requestDatas
    )
  }
  authUser(requestDatas: IAuthRequest):Observable<IAuthResponse>{
    return this.http.post<IAuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }
  isLoggedIn():boolean{
    //verificar se o usuário possui um token ou cookie
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false
  }
}
