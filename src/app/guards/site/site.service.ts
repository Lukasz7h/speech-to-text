import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { IWindow } from 'src/app/speech/speech.service';

@Injectable({
  providedIn: 'root'
})
export class WebSiteGuard implements CanActivate{

  public canActivate(): boolean  {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    return !!webkitSpeechRecognition;
  }
}
