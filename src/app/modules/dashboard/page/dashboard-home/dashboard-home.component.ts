import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { elementAt, Subject, takeUntil } from 'rxjs';
import { IgetAllProductsResponse } from 'src/app/models/interfaces/products/response/IgetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>()
  public productList:Array<IgetAllProductsResponse>=[]

  public productChartData!:ChartData;
  public productChartOptions!:ChartOptions;

    constructor(
      private productService:ProductsService,
      private messageService:MessageService,
      private productDataTransference: ProductsDataTransferService,
    ){}
  ngOnInit(): void {
    this.getProductData();
  }
  getProductData():void{
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response)=>{
          if(response.length > 0){
            this.productList = response;
            this.productDataTransference.setProductData(this.productList);
            this.setProductChartConfig();
          }
        }, error:(err)=>{
          console.log(err);
          this.messageService.add({
            severity:'error',
            summary:'Erro',
            detail:'Erro ao buscar produtos',
            life:2500
          })
        }
      })
  }
  setProductChartConfig():void{
    if(this.productList.length>0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyPriority('--text-color');
      const textColorSecondary = documentStyle.getPropertyPriority('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyPriority('--surface-border');

      this.productChartData = {
        labels: this.productList.map((element)=>element.name),
        datasets:
        [{
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productList.map((element)=>element?.amount)
        }]
      }
      this.productChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels:{
              color: textColor
            }
          }
        },
        scales:{
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid:{
              color:surfaceBorder
            }
          },
          y:{
            ticks: {
              color: textColorSecondary,
            },
            grid:{
              color: surfaceBorder
            }
          }
        },

      }
    }
  }
  ngOnDestroy():void{
    this.destroy$.next()
    this.destroy$.complete()
  }
}
