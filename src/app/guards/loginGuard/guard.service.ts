import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CanActivate} from '@angular/router';
import { backend } from 'src/app/backend/data';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate
{
  public isLoged: boolean = false;
  constructor(private httpClient: HttpClient) {}

  public canActivate(): Promise<boolean>
  {
    return new Promise((resolve) => {
      this.httpClient.get(backend.url+"/auth", {withCredentials: true})
      .subscribe((e: any) => {
        this.isLoged = !!e.auth;

        return resolve(!!e.auth);
      });
    });
  }
}
