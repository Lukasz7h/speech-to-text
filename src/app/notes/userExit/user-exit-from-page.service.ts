import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserExitFromPageService
{
  userExit(userData)
  {

    const values = Object.entries(userData.settings);
    const all = values.filter((e: any) => typeof e[1] == "string" || typeof e[1]  == "number" || !e[1].notStyleCss && !(e[1] instanceof Array));

    window.localStorage.setItem("settings", JSON.stringify(all));
    window.localStorage.setItem("notesText", userData.notes);
  }
}
