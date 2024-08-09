import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { IgetAllProductsResponse } from 'src/app/models/interfaces/products/response/IgetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productDataEmitter$ = new BehaviorSubject<Array<IgetAllProductsResponse>|null >(null)
  public productDatas: Array<IgetAllProductsResponse>=[];
 
  setProductData(productData:Array<IgetAllProductsResponse>):void{
    if(productData){
      this.productDataEmitter$.next(productData)
    }
  }
  getProductData(){
    this.productDataEmitter$.pipe(
      take(1),
      map((data)=> data?.filter((product)=>product.amount>0))
    )
    .subscribe({
      next:(response)=>{
        if (response){
          this.productDatas = response;
        }
      }
    })
    return this.productDatas
  }
  constructor() { }
}
