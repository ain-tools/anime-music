import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(public dataService: DataService) { }

  ngOnInit() {
    /* setTimeout(() => {
      if (!document.getElementById("youtube-icon")) {
        location.reload();
      };
    }, 4000); */
    if (this.dataService.isSongPlaying == true) {
      this.currentAnime = this.dataService.animeTitle;
      this.imgURL = this.dataService.imgURL;
      this.currentPlayingSong = this.dataService.songTitle;
      this.isSongPlaying = this.dataService.isSongPlaying;
      this.currentVideoTime = this.dataService.videoCurrentTime;
      this.totalVideoTime = this.dataService.videoTotalTime;
      this.formattedTotalVideoTime = this.dataService.formattedTotalVideoTime;
      this.albumList = this.dataService.albumList;
      if (this.albumList.length > 0) {
        this.generateAlbum = true;
        setTimeout(() => {
          document.getElementsByClassName(this.currentPlayingSong)[0].classList.add("fa-pause");
          document.getElementsByClassName(this.currentPlayingSong)[0].classList.remove("fa-play");
        })
      }
      this.timeSlider();
      (<HTMLImageElement>document.getElementById("currentAnimePlayingIMG")).src = this.imgURL;
    } else if (this.dataService.videoCurrentTime != 0) {
      this.currentAnime = this.dataService.animeTitle;
      this.imgURL = this.dataService.imgURL;
      this.currentPlayingSong = this.dataService.songTitle;
      this.isSongPlaying = this.dataService.isSongPlaying;
      this.currentVideoTime = this.dataService.videoCurrentTime;
      this.totalVideoTime = this.dataService.videoTotalTime;
      this.formattedTotalVideoTime = this.dataService.formattedTotalVideoTime;
      this.albumList = this.dataService.albumList;
      if (this.albumList.length > 0) {
        this.generateAlbum = true;
      }
      let minutes = Math.floor(this.currentVideoTime / 60);
      let seconds = Math.floor(this.currentVideoTime % 60);
      let extraZero = "";
      if (seconds < 10) {
        extraZero = "0";
      }
      this.slidePercentage = (this.currentVideoTime * 100) / this.formattedTotalVideoTime;
      document.getElementById("slidePercentage").style.width = this.slidePercentage + "%";
      this.formattedVideoTime = minutes + ":" + extraZero + seconds;
      this.switch = true;
      (<HTMLImageElement>document.getElementById("currentAnimePlayingIMG")).src = this.imgURL;
    }
    if (localStorage.getItem("localStorageCounter")) {
      this.localStorageCounter = Number(localStorage.getItem("localStorageCounter"));
    }
  }
  screenLoader = false;
  localStorageCounter = 0;

  ngOnDestroy() {
    this.dataService.animeTitle = this.currentAnime;
    this.dataService.imgURL = this.imgURL;
    this.dataService.songTitle = this.currentPlayingSong;
    this.dataService.isSongPlaying = this.isSongPlaying;
    this.dataService.videoCurrentTime = this.currentVideoTime;
    this.dataService.videoTotalTime = this.totalVideoTime;
    this.dataService.formattedTotalVideoTime = this.formattedTotalVideoTime;
    this.dataService.albumList = this.albumList;
    localStorage.setItem("localStorageCounter", this.localStorageCounter + "");
    this.timeSliderStop();
    this.timeSliderReset();
  }

  saveInfo = false;
  saveAlbum() {
    this.saveInfo = true;
  }

  saveAlbumInfo() {
    let savedAlbumOBJ = {
      imgURL: this.imgURL,
      title: this.currentAnime,
      album: this.albumList,
      counter: this.localStorageCounter
    }
    localStorage.setItem(this.localStorageCounter + "", JSON.stringify(savedAlbumOBJ));
    this.localStorageCounter = this.localStorageCounter + 1;
    this.saveInfo = false;
    localStorage.setItem("localStorageCounter", this.localStorageCounter + "");
  }

  albumList = [];
  generateAlbum = false;
  currentAnime;
  imgURL;
  getAlbumList(nameClick) {
    if (this.currentAnime != nameClick) {
      this.currentAnime = nameClick;
      let filteredNameClick = nameClick.replace(/[^a-zA-Z0-9 ]/g, '');
      this.switch = false;
      let albumObject = {
        name: filteredNameClick,
        action: "getAlbum",
        animeName: "null"
      };
      this.screenLoader = true;
      this.dataService.getAlbums(albumObject).subscribe((res) => {
        this.screenLoader = false;
        this.generateAlbum = true;
        this.albumList = res.json().album;
        if (this.saveInfo == true) {
          this.saveAlbumInfo();
        }
        this.imgURL = res.json().imgURL;
        this.title = res.json().title;
        (<HTMLImageElement>document.getElementById("currentAnimePlayingIMG")).src = this.imgURL;
        if (this.albumList.length == 0) {
          this.noSongsFound = true;
          this.albumList[0] = " No songs found, sorry.";
        } else {
          this.noSongsFound = false;
          this.playSong(this.albumList[0], this.title);
        }
      })
      if (document.getElementsByClassName(nameClick)[0]) {
        document.getElementsByClassName(nameClick)[0].classList.add("fa-pause");
        document.getElementsByClassName(nameClick)[0].classList.remove("fa-play");
      }
      if (document.getElementsByClassName(this.pastAnime)[0]) {
        document.getElementsByClassName(this.pastAnime)[0].classList.add("fa-play");
        document.getElementsByClassName(this.pastAnime)[0].classList.remove("fa-pause");
      }
      this.pastAnime = nameClick;
    } else {
      this.stimulateClick(this.currentPlayingSong, nameClick);
    }

  }
  title;

  timer;
  slidePercentage;
  timeSlider() {
    this.timer = setInterval(() => {
      this.currentVideoTime = this.currentVideoTime + 1;
      let minutes = Math.floor(this.currentVideoTime / 60);
      let seconds = Math.floor(this.currentVideoTime % 60);
      let extraZero = "";
      if (seconds < 10) {
        extraZero = "0";
      }
      this.slidePercentage = (this.currentVideoTime * 100) / this.formattedTotalVideoTime;
      document.getElementById("slidePercentage").style.width = this.slidePercentage + "%";
      this.formattedVideoTime = minutes + ":" + extraZero + seconds;
      if (this.currentVideoTime == this.formattedTotalVideoTime) {
        this.timeSliderReset();
        this.isSongPlaying = false;
        this.switch = true;
        if (document.getElementsByClassName(this.currentPlayingSong)[0]) {
          document.getElementsByClassName(this.currentPlayingSong)[0].classList.add("fa-play");
          document.getElementsByClassName(this.currentPlayingSong)[0].classList.remove("fa-pause");
        }
        clearInterval(this.timer);
      }
    }, 1000);
  }

  timeSliderStop() {
    clearInterval(this.timer);
  }
  timeSliderReset() {
    this.currentVideoTime = 0;
  }
  currentVideoTime = 0;
  formattedVideoTime;
  totalVideoTime;
  formattedTotalVideoTime;
  pastAnime;
  noSongsFound = false;
  youtubeLink;
  playSong(songName, animeName) {
    this.isSongPlaying = true;
    this.currentPlayingSong = songName;
    this.switch = false;
    this.switch2 = false;
    let filteredSong = songName.split('"', 2)[1].replace(/[^a-zA-Z0-9 ]/g, '');
    let filteredAnimeName = animeName.replace(/[^a-zA-Z0-9 ]/g, '');
    let songLinkOBJ = {
      action: "getLink",
      name: filteredSong,
      animeName: filteredAnimeName
    }
    let minutes = "";
    let seconds;
    this.screenLoader = true;
    this.dataService.getLink(songLinkOBJ).subscribe((res) => {
      this.screenLoader = false;
      this.totalVideoTime = res.json().videoTime.substring(13, res.json().videoTime.length - 1);
      for (let i = 0; i < this.totalVideoTime.length; i++) {
        if (this.totalVideoTime.charAt(i) != ":") {
          minutes = minutes + this.totalVideoTime.charAt(i);
        } else {
          break;
        }
      };
      seconds = this.totalVideoTime.substring(this.totalVideoTime.length - 2);
      this.formattedTotalVideoTime = Number(minutes) * 60 + Number(seconds);
      this.youtubeLink = res.json().youtubeLink;
      /*document.getElementById("youtube-audio").setAttribute("data-video", this.youtubeLink);
      document.getElementById("youtube-player").setAttribute("src", "https://www.youtube.com/embed/" + this.youtubeLink + "?autoplay=1&loop=1&enablejsapi=1&origin=http%3A%2F%2Flocalhost%3A4200&widgetid=1"); */
      this.dataService.loadYtSong = true;
      this.dataService.videoID = this.youtubeLink;
      this.dataService.playYtSong = true; 
      setTimeout(() => {
        if (document.getElementsByClassName(songName)[0]) {
          document.getElementsByClassName(songName)[0].classList.add("fa-pause");
          document.getElementsByClassName(songName)[0].classList.remove("fa-play");
        }
        if (document.getElementsByClassName(animeName)[0]) {
          document.getElementsByClassName(animeName)[0].classList.add("fa-pause");
          document.getElementsByClassName(animeName)[0].classList.remove("fa-play");
        }
        if (document.getElementsByClassName(this.pastSong)[0]) {
          document.getElementsByClassName(this.pastSong)[0].classList.add("fa-play");
          document.getElementsByClassName(this.pastSong)[0].classList.remove("fa-pause");
        };
        this.timeSliderStop();
        this.timeSliderReset();
        this.timeSlider();
        this.pastSong = songName;
      }, 1);
    })
  }
  pastSong;
  currentPlayingSong;
  isSongPlaying = false;
  switch = false;
  switch2 = false;
  stimulateClick(songName, animeName) {
    if (songName == this.currentPlayingSong && animeName == this.currentAnime && !this.switch && songName != undefined) {
      //document.getElementById("youtube-icon").click();
      this.dataService.pauseYtSong = true;
      this.isSongPlaying = false;
      if (document.getElementsByClassName(songName)[0]) {
        document.getElementsByClassName(songName)[0].classList.add("fa-play");
        document.getElementsByClassName(songName)[0].classList.remove("fa-pause");
      }
      if (document.getElementsByClassName(animeName)[0]) {
        document.getElementsByClassName(animeName)[0].classList.add("fa-play");
        document.getElementsByClassName(animeName)[0].classList.remove("fa-pause");
      }
      this.switch = true;
      this.timeSliderStop();
    } else if (songName == this.currentPlayingSong && animeName == this.currentAnime && this.switch && songName != undefined) {
      //document.getElementById("youtube-icon").click();
      this.dataService.playYtSong = true;
      this.isSongPlaying = true;
      if (document.getElementsByClassName(songName)[0]) {
        document.getElementsByClassName(songName)[0].classList.add("fa-pause");
        document.getElementsByClassName(songName)[0].classList.remove("fa-play");
      }
      if (document.getElementsByClassName(animeName)[0]) {
        document.getElementsByClassName(animeName)[0].classList.add("fa-pause");
        document.getElementsByClassName(animeName)[0].classList.remove("fa-play");
      }
      this.switch = false;
      this.timeSlider();
    } else if (songName == this.currentPlayingSong && !this.switch2 && songName != undefined) {
      //document.getElementById("youtube-icon").click();
      this.dataService.pauseYtSong = true;
      this.isSongPlaying = false;
      if (document.getElementsByClassName(songName)[0]) {
        document.getElementsByClassName(songName)[0].classList.add("fa-play");
        document.getElementsByClassName(songName)[0].classList.remove("fa-pause");
      }
      this.switch = true;
      this.switch2 = true;
      this.timeSliderStop();
    } else if (songName == this.currentPlayingSong && this.switch2 && songName != undefined) {
      //document.getElementById("youtube-icon").click();
      this.dataService.playYtSong = true;
      this.isSongPlaying = true;
      if (document.getElementsByClassName(songName)[0]) {
        document.getElementsByClassName(songName)[0].classList.add("fa-pause");
        document.getElementsByClassName(songName)[0].classList.remove("fa-play");
      }
      this.switch = false;
      this.switch2 = false;
      this.timeSlider();
    } else if (songName != undefined) {
      this.playSong(songName, this.currentAnime);
      this.isSongPlaying = true;
      if (document.getElementsByClassName(songName)[0]) {
        document.getElementsByClassName(songName)[0].classList.add("fa-pause");
        document.getElementsByClassName(songName)[0].classList.remove("fa-play");
      }
      if (document.getElementsByClassName(this.pastSong)[0]) {
        document.getElementsByClassName(this.pastSong)[0].classList.add("fa-play");
        document.getElementsByClassName(this.pastSong)[0].classList.remove("fa-pause");
      }
    } else {
      console.log("pick a song");
    }
  }

  albumListCounter = 0;
  incrementAlbumSong() {
    if (this.albumListCounter + 1 == this.albumList.length) {
      this.albumListCounter = 0;
    } else {
      this.albumListCounter = this.albumListCounter + 1;
    }
    this.playSong(this.albumList[this.albumListCounter], this.currentAnime);
  }

  decrementAlbumSong() {
    if (this.albumListCounter - 1 < 0) {
      this.albumListCounter = this.albumList.length - 1;
    } else {
      this.albumListCounter = this.albumListCounter - 1;
    }
    this.playSong(this.albumList[this.albumListCounter], this.currentAnime);
  }

  randomSongFromAlbum() {
    let randomNumber = Math.floor(Math.random() * this.albumList.length);
    this.playSong(this.albumList[randomNumber], this.currentAnime);
  }

}
