import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { backend } from 'src/app/backend/data';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate
{
  constructor(private httpClient: HttpClient) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>
  {
    return new Promise((resolve) => {
      this.httpClient.get(backend.url+"/auth", {withCredentials: true})
      .subscribe((e: any) => {
        console.log(e)
        return resolve(!e.auth);
      })
    })
  }
}
