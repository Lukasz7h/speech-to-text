import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { backend } from 'src/app/backend/data';
import { GuardService } from 'src/app/login/guard/guard.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private httpClient: HttpClient, private guardService: GuardService){}

  logout()
  {
    this.httpClient.get(backend.url+"/logout", {withCredentials: true})
    .subscribe((e: any) => {
      if(e.logout) this.guardService.canActivate();
    })
  }
}
