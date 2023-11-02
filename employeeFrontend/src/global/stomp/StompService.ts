import {Injectable} from "@angular/core";
import {Observable,of} from "rxjs";
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';


@Injectable({
    providedIn:'root',
})
export class StompService{
    socket = new SockJs('ws://localhost:8080/gs-guide-websocket');
    stompClient = Stomp.over(this.socket);

    subscribe(topic:string, callback?:any):void{
        const connected:boolean = this.stompClient.connected;
        if(connected){
            this.subscribeToTopic(topic,callback);
            return;
        }
        
        this.stompClient.connect({},() => {
            this.subscribeToTopic(topic,callback);
        });
    }

    private subscribeToTopic(topic:string, callback?:any){
        this.stompClient.subscribe(topic, () => {
            callback();
        })
    }
}