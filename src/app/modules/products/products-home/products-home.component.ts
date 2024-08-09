import { IgetAllProductsResponse } from './../../../models/interfaces/products/response/IgetAllProductsResponse';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductFormComponent } from '../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$:Subject<void> = new Subject();
  private ref!:DynamicDialogRef
  public productData: Array <IgetAllProductsResponse> = []
  constructor(
    private productsService:ProductsService,
    private productDataTransferService:ProductsDataTransferService,
    private router:Router,
    private messageService: MessageService,
    private confirmationService:ConfirmationService,
    private dialogService:DialogService
  ){}

  ngOnInit(): void {
    this.getProductData();
  }
  getProductData(){
    const productLoaded = this.productDataTransferService.getProductData()
    if(productLoaded.length > 0){
      this.productData = productLoaded
    }else this.getAPIProductData();
  }
  getAPIProductData(){
    this.productsService
    .getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response)=>{
        if(response.length > 0){
          this.productData = response
          console.log('DADOS DE PRODUTOS', this.productData)
        }else this.getAPIProductData();
        console.log('DADOS DE PRODUTOS', this.productData)
      },
      error:(err)=>{
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao encontrar produto',
          life: 2500
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }
  handleProductAction(event: EventAction):void{
    if(event){
      this.ref = this.dialogService.open(ProductFormComponent,{
        header:event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex:10000,
        maximizable:true,
        data:{
          event:event,
          productData:this.productData
        }
      })
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:()=>this.getAPIProductData(),
      })
    }
  }
  handleDeleteProduct(event:{product_id: string, productName: string}):void{
    if(event){
      console.log("dados de delete", event)
      this.confirmationService.confirm({
        message: `Confirma a exclusão de ${event?.productName}`,
        header: 'Confirmação de exclusão',
        icon:'pi pi-exclamation',
        acceptLabel:'Sim',
        rejectLabel:'Não',
        accept:()=> this.deleteProduct(event?.product_id)
      })
      }
    }

  deleteProduct(product_id:string){
    if(product_id){
      this.productsService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response)=>{
          if(response){
            this.messageService.add({
              severity:'success',
              summary: 'Sucesso',
              detail: 'Produto deletado com sucesso!',
              life: 2500
            })
            this.getAPIProductData()
          }
        },
        error: (err)=>{
          console.log(err);
          this.messageService.add({
            severity:'error',
            summary: 'Erro',
            detail: 'Erro ao deletar produto',
            life: 2500
          })
        }
      })
    }
  }
  ngOnDestroy(): void {

  }

}
