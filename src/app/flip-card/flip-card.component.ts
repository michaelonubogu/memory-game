import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardDataService } from '../card-grid/card-data.service';
import { flipAnimation, fadeOutUpAnimation } from 'angular-animations';

@Component({
  selector: 'flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
  animations: [flipAnimation(), fadeOutUpAnimation()],
})
export class FlipCardComponent implements OnInit {
  @Input() id: string = '';
  @Input() value: number = 0;
  @Input() enableFlipping: boolean = true;
  @Input() matched: boolean = false;
  @Output() cardFlippedEvent: EventEmitter<string> = new EventEmitter<string>();

  public isFlipped: boolean = false;
  public isHidden: boolean = false;

  constructor(private readonly cardDataService: CardDataService) {}

  ngOnInit(): void {
    this.subscribeToFlipBrodcast();
  }

  public flipCard(forceFlip: boolean = false) {
    if (forceFlip || (this.enableFlipping && !this.matched)) {
      this.isFlipped = !this.isFlipped;
      this.enableFlipping = false;
      this.cardFlippedEvent.emit(this.id);
    }
  }

  public setHidden() {
    if (this.matched) {
      this.isHidden = true;
    }
  }

  public subscribeToFlipBrodcast() {
    this.cardDataService.flipCardFaceDownBroadcast.subscribe({
      next: (selectedIDs: string | string[]) => {
        if (typeof selectedIDs === 'string') {
          selectedIDs = [selectedIDs];
        }
        const matched = selectedIDs.find((id) => id === this.id);
        if (matched) {
          this.flipCard(true);
        }
      },
    });
  }
}
