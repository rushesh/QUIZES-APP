import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  noResult = false;
  loginForm!: FormGroup;
  constructor(private toastr:ToastrService, private fb: FormBuilder, private router:Router, private backendService: BackendService){}

  validationErrors:any = [];
  ngOnInit(): void {
    this.initializeForm();      
  }

  initializeForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }
  login(){
    console.log(this.loginForm.value)
    this.backendService.storeNameEmail(this.loginForm.value["username"], this.loginForm.value["email"]);
      this.router.navigateByUrl("/quiz");
  }
}