import {Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {Position} from "../../../dto/qwirkle/Position";

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

  @Input() panOffset: Position = {
    x: 0,
    y: 0
  };
  private isPanning = false;
  private lastMousePosition = { x: 0, y: 0 };

  get panStyle() {
    return {
      transform: `translate(${this.panOffset.x}px, ${this.panOffset.y}px)`
    };
  }

  zoomIn() {

  }

  zoomOut() {

  }

  startPan(event: MouseEvent) {
    this.isPanning = true;
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  pan(event: MouseEvent) {
    if (!this.isPanning) return;

    const dx = event.clientX - this.lastMousePosition.x;
    const dy = event.clientY - this.lastMousePosition.y;

    this.panOffset.x += dx;
    this.panOffset.y += dy;
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
  }

  endPan() {
    this.isPanning = false;
  }
}
