import {Component, output} from '@angular/core';
import {FileUpload} from "../../../dto/all/FileUpload";

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  standalone: true,
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  public fileChangedEvent = output<FileUpload>();

  private fileUpload: FileUpload = {
    file: null,
    fileUrl: null
  };

  protected onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      this.fileUpload.file = input.files[0];
      this.createImageFromBlob(this.fileUpload.file);

      this.fileChangedEvent.emit(this.fileUpload);
    }
  }

  private createImageFromBlob(blob: Blob) {
    if(this.fileUpload.fileUrl) {
      URL.revokeObjectURL(this.fileUpload.fileUrl);
    }

    this.fileUpload.fileUrl = URL.createObjectURL(blob);
  }
}
