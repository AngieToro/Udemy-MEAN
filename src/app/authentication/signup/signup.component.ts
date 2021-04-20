import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthenticationService } from "../authentication.service";
import { Subscription } from 'rxjs';

@Component({
  //selector: "app-signup", //es opcional
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]

})

export class SignupComponent  implements OnInit, OnDestroy{

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthenticationService){

  }

  ngOnInit() {
    this.authStatusSub = this.authService.
    getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }


  onSignup(form: NgForm){
    //console.log(form.value);

    //se valida que existan datos
    if (form.invalid){
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
