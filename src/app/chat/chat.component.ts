import { Component, OnInit } from '@angular/core';
import {SocketService} from '../services/socket/socket.service';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers:[SocketService]
})

export class ChatComponent implements OnInit {
  username:string;
  messages = [];
  message;
  connection;
  connection1;
  connection2;
  connection3;
  user:string;
  room:string;
  messageText:String;
  messageArray:Array<{user:String,message:String}> = [];
  showNav;

  constructor(private sockServ: SocketService, private router:Router) {
      // this.sockServ.newUserJoined()
      // .subscribe(data=>this.messageArray.push(data));
      //
      // this.sockServ.userLeftRoom()
      // .subscribe(data=>this.messageArray.push(data));
      //
      // this.sockServ.newMessageReceived()
      // .subscribe(data=>this.messageArray.push(data));


  }

  ngOnInit() {
    this.showNav = true;
    //choice for valid user and subscribe to service (chat messages)
    if(!localStorage.getItem('username')){
      //No vaid session is available
      console.log('Not validated');
      sessionStorage.clear();
      alert("Not a valid user");
      this.router.navigateByUrl('login');
    } else {
      //we have a valid username. Subscribe to chat service and add chat message
      //to the message array each time you have pushed a message from the server.
      this.username = localStorage.getItem('username');
      console.log("session started for:" + this.username);
      this.connection = this.sockServ.getMessages().subscribe(message =>{
        //message is a value of input field
          this.messages.push(message);
          this.message = " ";
      });
    }

      this.connection1 = this.sockServ.newUserJoined().subscribe(data =>{
          this.messageArray.push(data);
      });

      this.connection2 = this.sockServ.userLeftRoom().subscribe(data =>{
          this.messageArray.push(data);
      });

      this.connection3 = this.sockServ.newMessageReceived().subscribe(data =>{
          this.messageArray.push(data);
      });

  }

  sendMessages(){
    //send a chat message to the server.
    this.sockServ.sendMessages(this.message + '('+this.username+')');
    this.message = "";
  }

  ngOnDestroy() {
    //when leaving this component close down the subscription
    if(this.connection){
      this.connection.unsubscribe();
    }
  }

  logout(){
    //logout the user and go back to login page
    localStorage.clear();
    console.log("session cleared");
    this.router.navigateByUrl('login');
  }


  join(){
        this.sockServ.joinRoom({user:this.user, room:this.room});
  }

  leave(){
        this.sockServ.leaveRoom({user:this.user, room:this.room});
  }

  sendMessage(){
        this.sockServ.sendMessage({user:this.user, room:this.room, message:this.messageText});
  }
}
