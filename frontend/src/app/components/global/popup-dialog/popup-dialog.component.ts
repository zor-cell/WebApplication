import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {PopupDialogData} from "../../../dto/global/PopupDialogData";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";


@Component({
  selector: 'app-popup-dialog',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './popup-dialog.component.html',
  standalone: true,
  styleUrl: './popup-dialog.component.css'
})
export class PopupDialogComponent implements OnInit {
  playerForm!: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<PopupDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PopupDialogData,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  submit() {

  }


}
