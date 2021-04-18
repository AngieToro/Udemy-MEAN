import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor (private authService: AuthenticationService) {
  }

  ngOnInit(){

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }

  onLogOut(){

    this.authService.logout();

  }

  ngOnDestroy(){
      this.authListenerSubs.unsubscribe();
  }
}
