import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  imgURL;
  animeTitle;
  songTitle;
  isSongPlaying = false;
  videoCurrentTime = 0;
  videoPercentage;
  videoTotalTime = 0;
  formattedTotalVideoTime;
  albumList;

  constructor(public http: Http) { }

  getExploreMusic() {
    let exploreOBJ = {
      name: "string",
      action: "getExplore",
      animeName: "null"
    };
    return this.http.post("https://animemusicserv.herokuapp.com/api/exploreMusics", exploreOBJ);
  }

  getAlbums(animeRequestOBJ) {
    return this.http.post("https://animemusicserv.herokuapp.com/api/exploreMusics", animeRequestOBJ);
  }

  getLink(songRequestOBJ) {
    return this.http.post("https://animemusicserv.herokuapp.com/api/exploreMusics", songRequestOBJ);
  }

  loadMoreSongs(pageRequestOBJ) {
    return this.http.post("https://animemusicserv.herokuapp.com/api/exploreMusics", pageRequestOBJ);
  }
  //music player controller
  loadYtSong = false;
  playYtSong = false;
  pauseYtSong = false;
  videoID;
}
