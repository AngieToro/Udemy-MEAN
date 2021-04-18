import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//este componente se carga de primero cuando la aplicacion se inicia
export class AppComponent implements OnInit{

  constructor(private autService: AuthenticationService){

  }

  title = 'mean-course';

  ngOnInit() {

    this.autService.autoAuthUser();

  }

}
