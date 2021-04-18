import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]

})

export class LoginComponent implements OnInit, OnDestroy{

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public autService: AuthenticationService){

  }

  ngOnInit(){

    this.authStatusSub = this.autService.getAuthStatusListener()
    .subscribe(autStatus => {
      this.isLoading = false;
    });

  }

  onLogin(form: NgForm){

    if (form.invalid){
      return;
    }

    this.isLoading = true;
    this.autService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
