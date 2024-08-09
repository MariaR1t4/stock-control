import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IgetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/IgetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { IcreateProductRequest } from 'src/app/models/interfaces/products/request/IcreateProductRequest';
import { IgetAllProductsResponse } from 'src/app/models/interfaces/products/response/IgetAllProductsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$:Subject<void> = new Subject();
  public categoryData:Array<IgetCategoriesResponse>= []
  public selectedCategory:Array<{name:string, code:string}>=[]
  public productsData!:IgetAllProductsResponse

  public productAction!:{
    event:EventAction;
    productData:Array<IgetAllProductsResponse>
  }
  public selectedData!:IgetAllProductsResponse
  public editProductForm = this.formBuilder.group({
    name:['',Validators.required],
    price:['',Validators.required],
    description:['',Validators.required],
    amount:[0,Validators.required]
  })
  public addProductForm = this.formBuilder.group({
    name:['',Validators.required],
    price:['',Validators.required],
    description:['',Validators.required],
    category_id:['',Validators.required],
    amount:[0,Validators.required]
  })

  constructor(
    private categorieService:CategoriesService,
    private productService:ProductsService,
    private formBuilder:FormBuilder,
    private messageService:MessageService,
    private router:Router,
    public ref:DynamicDialogConfig,
    private productDataTransferService:ProductsDataTransferService
  ){}

  ngOnInit(): void {
    this.productAction = this.ref.data;
    this.getAllCategories();
  }
  getAllCategories(){
    this.categorieService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response)=>{
        if(response.length>0){
          this.categoryData = response
        }
      }
    })
  }

  getProductSelectData(product_id:string){
    const allProducts = this.productAction?.productData
    if(allProducts.length>0){
      const productFiltered = allProducts.filter((element)=>element?.id===product_id)
      if(productFiltered){
        this.selectedData = productFiltered[0]

        this.editProductForm.setValue({
          name: this.selectedData?.name,
          price: this.selectedData?.price,
          amount: this.selectedData?.amount,
          description: this.selectedData?.description
        })
      }
    }
  }


  getProductData():void{
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response)=>{
        if(response.length>0){
          this.productsData = response;
          this.productsData && this.productDataTransferService.setProductData(this.productData)
        }
      }
    })
  }

  handleSubmitAddProduct(){
    if(this.addProductForm?.value && this.addProductForm?.valid){
      const requestCreateProduct:IcreateProductRequest={
        name:this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }
      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response)=>{
          if(response){
            this.messageService.add({
              severity:'success',
              summary:"Sucesso",
              detail:"Produto criado com sucesso",
              life: 2500
            })
          }
        },
        error:(err)=>{
          console.log(err);
          this.messageService.add({
            severity:'error',
            summary:"Erro",
            detail:"Erro ao criar o produto",
            life: 2500
          })
        }
      })
    }
    this.addProductForm.reset()
  }
  handleSubmitEditProduct():void{
    //if(this.editProductForm.value && this.editProductForm.valid){


  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
