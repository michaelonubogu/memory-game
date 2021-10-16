import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CardGridComponent } from './card-grid/card-grid.component';
import { FlipCardComponent } from './flip-card/flip-card.component';
import { ScoreBoardComponent } from './score-board/score-board.component';

@NgModule({
  declarations: [
    AppComponent,
    CardGridComponent,
    FlipCardComponent,
    ScoreBoardComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
