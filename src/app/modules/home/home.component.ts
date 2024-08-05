import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IAuthRequest } from 'src/app/models/interfaces/user/auth/IAuthRequest';
import { ISignUpUserRequest } from 'src/app/models/interfaces/user/ISignUpUserRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email:['',Validators.required],
    password:['',Validators.required]
  })

  signUpForm = this.formBuilder.group({
    name:['',Validators.required],
    email:['',Validators.required],
    password:['',Validators.required]
  })
  constructor(private formBuilder:FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private messageService: MessageService,
              private router:Router){  }
  onSubmitForm():void{
    if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUser(this.loginForm.value as IAuthRequest)
      .subscribe({
        next: (response)=>{
          if(response){
            this.cookieService.set('USER_INFO',response?.token)
            this.loginForm.reset()
            this.router.navigate(['/dashboard'])
            
            this.messageService.add({
              severity:'success',
              summary:'sucesso',
              detail:`Bem vindo de volta ${response.name}`,
              life: 2000,
            })
          }
        },
        error:(err)=>{
          this.messageService.add({
          severity:'error',
          summary:'erro',
          detail:`Erro ao fazer login`,
          life: 2000,
        });
        console.log(err)
      }

      })
    }
  }

  onSubmitSignUpForm():void{
    if(this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signupUser(this.signUpForm.value as ISignUpUserRequest)
      .subscribe({
        next:(response)=>{
          if(response){
            this.signUpForm.reset()
            this.loginCard = true;
            this.messageService.add({
              severity:'success',
              summary:'sucesso',
              detail:`Usuário criado com sucesso! Bem-vindo ${response.name}`,
              life: 2000,
            })
          }
        },
        error:(err)=>{
          this.messageService.add({
          severity:'error',
          summary:'erro',
          detail:`Erro ao logar`,
          life: 2000,
        });
          console.log(err)
      }
      })
    }
  }
}
