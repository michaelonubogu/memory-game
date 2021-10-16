import { Injectable } from '@angular/core';
import { Card } from './card-data';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardDataService {
  private _internalFlipNotifier: BehaviorSubject<string | string[]> =
    new BehaviorSubject<string | string[]>('');

  private _flipCardFaceDownBroadcast: BehaviorSubject<string | string[]> =
    new BehaviorSubject<string | string[]>('');

  public get flipCardFaceDownBroadcast() {
    return this._flipCardFaceDownBroadcast;
  }

  constructor() {
    this._internalFlipNotifier.subscribe({
      next: (data) => this._flipCardFaceDownBroadcast.next(data),
    });
  }

  public flipCardFaceDown(cardIDs: string | string[]) {
    this._internalFlipNotifier.next(cardIDs);
  }

  /**
   * Gets the intial deck of cards
   * @returns {Card[]} the shuffled set of cards
   */
  public getCards(): Card[] {
    const cards: Card[] = [];
    let index = 0;

    while (index < 24 / 2) {
      // assign a consecutive number as the card value.
      const firstCard: Card = {
        id: uuid(),
        value: index + 1,
        enableFlipping: true,
        matched: false,
      };

      const secondCard: Card = {
        id: uuid(),
        value: index + 1,
        enableFlipping: true,
        matched: false,
      };

      cards.push(firstCard);
      cards.push(secondCard);
      index++;
    }

    return this.shuffleCards(cards);
  }

  /**
   * shuffles the desk of cards
   * @param {Card[]} unshuffled the unshuffled set of cards
   * @returns {Card[]} the shuffled set of cards
   */
  public shuffleCards(unshuffled: Card[]): Card[] {
    return unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
