import {Component, OnInit} from "@angular/core";

import * as JsSIP from "jssip.js";
import { USERS } from "./data/users";


@Component({
  selector: 'web-phone',
  template: `
    <select [(ngModel)]="user" (ngModelChange)="selectUser($event)">
      <option *ngFor="let user of users" [ngValue]="user">{{ user.displayName }}</option>
    </select>
  `
})

export class WebPhoneComponent implements OnInit {
  private wsServer = 'ws:/109.226.215.9:8088/ws';
  users = USERS;
  user = null;
  userAgent;

  ngOnInit() {
    JsSIP.debug.enable('*');
  }

  toConsole =  (e) => {console.log(e)};

  private userAgentAction = {
    connected: this.toConsole,
    registered: this.toConsole,
    unregistered: this.toConsole,
    disconnected: this.toConsole,
    registrationFailed: this.toConsole
  };

  private initializeUA() {
    for (let userAgentActionKey in this.userAgentAction) {
      this.userAgent.on(userAgentActionKey, this.userAgentAction[userAgentActionKey]);
    }

    this.userAgent.start();
  }

  private selectUser(event) {
    let webSocketInterfaces = [new JsSIP.WebSocketInterface(this.wsServer)];
    this.userAgent = new JsSIP.UA({sockets: webSocketInterfaces, ...event});
    this.initializeUA();
  }

  private callTo(to){
    let callAddress = `sip:${to}@109.226.215.9`;
  }

}
