import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IgetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/IgetCategoriesResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get("USER_INFO")
  private httpOptions={
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bareer ${this.JWT_TOKEN}`
    })
  }
  constructor(private httpClient: HttpClient,
              private cookieService:CookieService
  ) { }

  getAllCategories():Observable<Array<IgetCategoriesResponse>>{
    return this.httpClient.get<Array<IgetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    )
  }
}
