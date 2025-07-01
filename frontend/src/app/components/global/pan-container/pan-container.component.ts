import {Component, ElementRef, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {Position} from "../../../dto/global/Position";

@Component({
  selector: 'app-pan-container',
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './pan-container.component.html',
  standalone: true,
  styleUrl: './pan-container.component.css'
})
export class PanContainerComponent {
  @Input() canPan: boolean = true;
  @Input() canZoom: boolean = true;
  @Input() canRotate: boolean = true;
  @Input() centerPosition: Position = {
    x: 0,
    y: 0
  };

  private isPanning = false;
  private panOffset: Position = {
    x: 0,
    y: 0
  };
  private lastMousePosition: Position = {
    x: 0,
    y: 0
  };
  private zoomScale: number = 1;

  constructor(public elementRef: ElementRef) {
  }

  get panStyle() {
    return {
      transform: `translate(${this.centerPosition.x + this.panOffset.x}px, ${this.centerPosition.y + this.panOffset.y}px) scale(${this.zoomScale})`
    };
  }

  zoomIn() {

  }

  zoomOut() {

  }

  startPan(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isPanning = true;

    this.lastMousePosition = this.getEventPos(event);
  }

  pan(event: MouseEvent | TouchEvent) {
    if (!this.isPanning) return;
    event.preventDefault();

    const eventPos: Position = this.getEventPos(event);

    const dx = eventPos.x - this.lastMousePosition.x;
    const dy = eventPos.y - this.lastMousePosition.y;

    this.panOffset.x += dx;
    this.panOffset.y += dy;
    this.lastMousePosition = {
      x: eventPos.x,
      y: eventPos.y
    };
  }

  endPan() {
    this.isPanning = false;
  }

  private getEventPos(event: MouseEvent | TouchEvent): Position {
    if (event instanceof MouseEvent) {
      return {
        x: event.clientX,
        y: event.clientY
      }
    } else {
      const touch = event.touches[0];
      return {
        x: touch.clientX,
        y: touch.clientY
      }
    }
  }
}
