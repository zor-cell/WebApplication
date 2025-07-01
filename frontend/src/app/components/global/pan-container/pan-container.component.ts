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

  private minZoom: number = 0.3;
  private maxZoom: number = 2;
  private zoomScale: number = 1;
  private initialPinchDistance: number | null = null;

  private rotation: number = 0;

  constructor(public elementRef: ElementRef) {}

  get transformStyle() {
    return {
      transform: `translate(${this.centerPosition.x + this.panOffset.x}px, ${this.centerPosition.y + this.panOffset.y}px)
        scale(${this.zoomScale})
        rotate(${this.rotation}deg)`,
      transformOrigin: `0 0`
    };
  }

  resetOffset() {
    this.panOffset = {
      x: 0,
      y: 0
    };
    this.zoomScale = 1;
    this.rotation = 0;
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360;
  }

  startPan(event: MouseEvent | TouchEvent) {
    this.isPanning = true;

    this.lastMousePosition = this.getEventPos(event);
  }

  touchStart(event: TouchEvent) {
    if(event.touches.length === 1) {
      this.startPan(event);
    } else if(event.touches.length === 2) {
      this.initialPinchDistance = this.getPinchDistance(event);
      event.preventDefault();
    }
  }

  pan(event: MouseEvent | TouchEvent) {
    if (!this.isPanning || !this.canPan) return;
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

  scroll(event: WheelEvent) {
    if(!this.canZoom) return;
    event.preventDefault();

    const delta = -event.deltaY;
    const zoomFactor = delta > 0 ? 1.1 : 0.9;
    this.zoomScale = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomScale * zoomFactor));

  }

  pinch(event: TouchEvent) {
    if(!this.canZoom || event.touches.length !== 2) return;
    event.preventDefault();

    const currentDistance = this.getPinchDistance(event);
    if (this.initialPinchDistance) {
      const scaleChange = currentDistance / this.initialPinchDistance;
      const newZoom = this.zoomScale * scaleChange;

      this.zoomScale = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
      this.initialPinchDistance = currentDistance; // Update for next frame
    }
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

  private getPinchDistance(event: TouchEvent): number {
    const [touch1, touch2] = [event.touches[0], event.touches[1]];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
