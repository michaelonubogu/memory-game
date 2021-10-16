import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Card } from './card-data';
import { CardDataService } from './card-data.service';

@Component({
  selector: 'card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
})
export class CardGridComponent implements OnInit {
  public cards: Card[] = [];
  public notificationMessage: string = '';
  public showMessage: boolean = false;
  public showResetBtn: boolean = false;
  private selectedCards: Card[] = [];

  constructor(private readonly cardDataService: CardDataService) {}

  ngOnInit(): void {
    this.initialize();
  }

  public initialize() {
    this.notificationMessage = '';
    this.showMessage = false;
    this.showResetBtn = false;
    this.resetSelections();
    this.cards = this.cardDataService.getCards();
  }

  public handleCardFlip(cardID: string) {
    const selectedCard = this.cards.find((card) => card.id === cardID);

    if (selectedCard !== undefined) {
      this.selectedCards.push(selectedCard as Card);

      if (this.selectedCards.length === 2) {
        this.processMatch(
          this.checkCardPairMatch(this.selectedCards[0], this.selectedCards[1])
        );
      }
    }
  }

  public resetGame() {
    this.initialize();
  }

  private checkAllCardsMatch(cards: Card[]): boolean {
    return cards.every((card) => card.matched === true);
  }

  private checkCardPairMatch(firstCard: Card, secondCard: Card): boolean {
    return firstCard.value === secondCard.value;
  }

  private enableFlipping(enable: boolean) {
    this.cards.forEach(
      (card) => (card.enableFlipping = !card.matched && enable)
    );
  }

  private processGameOver() {
    this.enableFlipping(false);
    this.notificationMessage = 'Congratulations! You matched ALL cards!';
    this.showMessage = true;
    this.showResetBtn = true;
  }

  private processMatch(matched: boolean) {
    this.notificationMessage = matched
      ? 'Nice! Both cards match!'
      : 'Nope! Try again...';

    // temporarily disable card flipping while we notify the user
    this.enableFlipping(false);
    this.showMessage = true;

    const waitToProcess$ = of(null);
    waitToProcess$.pipe(delay(1000)).subscribe({
      next: () => {
        // enable flipping again
        this.enableFlipping(true);
        this.showMessage = false;

        if (matched) {
          this.selectedCards.forEach((card) => {
            card.matched = true;
            card.enableFlipping = false;
          });
        } else {
          // have the un-matched cards flip back down
          this.cardDataService.flipCardFaceDown(
            this.selectedCards.map((c) => c.id)
          );
        }

        this.resetSelections();

        if (this.checkAllCardsMatch(this.cards)) {
          this.processGameOver();
        }
      },
    });
  }

  private resetSelections() {
    this.selectedCards = [];
  }
}
