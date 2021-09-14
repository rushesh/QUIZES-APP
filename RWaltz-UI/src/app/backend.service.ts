import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAllQuestion(){
    return this.http.get('http://localhost:3001/quizquestions');
  }
  storeNameEmail(name: string,email: string){
    sessionStorage.setItem('username', name);
    sessionStorage.setItem('email', email);
  }
  checkLoggedIn(){
    // console.log(sessionStorage.getItem('name'),sessionStorage.getItem('email'))
    if(sessionStorage.getItem('username')==null || sessionStorage.getItem('email')==null){
      return false
    }
    return true
  }
  sendLoginUserDetails(trues: any, falses: any, percent: any){
    const obj = {
      username : sessionStorage.getItem('username'),
      email: sessionStorage.getItem('email'),
      trues,
      falses,
      percentage :percent
    }
    return this.http.post('http://localhost:3001/user',obj);
  }
  logOutUser(): any {
    sessionStorage.clear();
  }
}
