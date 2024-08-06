import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { IgetAllProductsResponse } from 'src/app/models/interfaces/products/response/IgetAllProductsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }
  constructor(private http:HttpClient,
              private cookie:CookieService
  ) { }
  getAllProducts():Observable<Array<IgetAllProductsResponse>>{
    return this.http.get<Array<IgetAllProductsResponse>>(
      `${this.API_URL}/products`,
      this.httOptions
    )
    .pipe(map((product)=>product.filter((data)=>data?.amount>0)))

  }
}
