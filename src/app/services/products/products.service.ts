import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { IdeleteProductEvent } from 'src/app/models/interfaces/products/event/DeleteProductEvent';
import { IcreateProductRequest } from 'src/app/models/interfaces/products/request/IcreateProductRequest';
import { IeditRequestData } from 'src/app/models/interfaces/products/request/IeditRequestData';
import { IcreateProductResponse } from 'src/app/models/interfaces/products/response/IcreateProductResponse';
import { IdeleteProductResponse } from 'src/app/models/interfaces/products/response/IdeleteProducResponse';
import { IgetAllProductsResponse } from 'src/app/models/interfaces/products/response/IgetAllProductsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
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
      this.httpOptions
    )
    .pipe(map((product)=>product.filter((data)=>data?.amount>0)))

  }
  deleteProduct(product_id:string):Observable<IdeleteProductResponse>{
    return this.http.delete<IdeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions, params:{
          product_id:product_id
        }
      }
    )
  }
  createProduct(requestData:IcreateProductRequest):Observable<IcreateProductResponse>{
    return this.http.post<IcreateProductResponse>(
      `${this.API_URL}/product`,
      requestData,
      this.httpOptions
    )
  }
  editProduct(requestData:IeditRequestData):Observable<void>{
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      requestData,
      this.httpOptions
    )
  }
}
