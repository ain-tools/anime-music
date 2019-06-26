import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  constructor(public dataService:DataService) { }

  ngOnInit() {
    this.eventListenerLoop();
  }

  eventListenerLoop() { 
    setInterval(() => { 
      if(this.dataService.loadYtSong == true){
        this.loadSong(this.dataService.videoID);
        this.dataService.loadYtSong = false;
      }
      if(this.dataService.playYtSong == true){
        this.playVideo();
        this.dataService.playYtSong = false;
      }
      if(this.dataService.pauseYtSong == true){
        this.pauseVideo();
        this.dataService.pauseYtSong = false;
      }
     },100);
  };
  //@ts-ignore
  YTPlayer = require('yt-player')
  player = new this.YTPlayer('#player')

  loadSong(youtubeVideoID) {
    this.player.load(youtubeVideoID);
  }

  playVideo() {
    this.player.play();
  }

  pauseVideo() {
    this.player.pause();
  }

}
