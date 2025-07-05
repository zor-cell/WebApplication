import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Tile} from "../../../dto/qwirkle/Tile";
import {QwirkleService} from "../../../services/qwirkle.service";

@Component({
  selector: 'qwirkle-image-input',
  imports: [
    NgIf
  ],
  templateUrl: './image-input.component.html',
  standalone: true,
  styleUrl: './image-input.component.css'
})
export class ImageInputComponent {
  selectedFile: File | null = null;

  constructor(private qwirkleService: QwirkleService) {
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      const file = input.files![0];
      this.qwirkleService.uploadImage(file).subscribe(res => {

      });
    }
  }
}
