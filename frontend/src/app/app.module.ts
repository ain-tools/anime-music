import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from "@angular/http";

import { DataService } from "./data.service";
import { AppComponent } from './app.component';
import { ExploreComponent } from './explore/explore.component';
import { SearchComponent } from './search/search.component';
import { SavedComponent } from './saved/saved.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
const appRoutes: Routes = [
  { path: '', component: ExploreComponent },
  { path: 'search', component: SearchComponent },
  { path: 'saved', component: SavedComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ExploreComponent,
    SearchComponent,
    SavedComponent,
    MusicPlayerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
