import {Component, inject, input, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule, ValidatorFn,
  Validators
} from "@angular/forms";
import {Team} from "../../../../../dto/all/Team";
import {PopupService} from "../../../../../services/popup.service";
import {PopupResultType} from "../../../../../dto/all/PopupResultType";
import {ResultTeamState} from "../../../../../dto/sites/catan/result/ResultTeamState";
import {ResultState} from "../../../../../dto/sites/catan/result/ResultState";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RoundResult} from "../../../../../dto/sites/jolly/RoundResult";
import {DurationPipe} from "../../../../../pipes/DurationPipe";

interface RoundForm {
  score: FormControl<number | null>;
  hasClosed: FormControl<boolean>;
  outInOne: FormControl<boolean>;
}


@Component({
  selector: 'jolly-round-popup',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    DurationPipe
  ],
  templateUrl: './round-popup.component.html',
  standalone: true,
  styleUrl: './round-popup.component.css'
})
export class RoundPopupComponent implements OnInit {
  private popupService = inject(PopupService);
  private fb = inject(FormBuilder);

  public teams = input.required<Team[]>();
  public addRoundEvent = output<RoundResult[]>();

  protected saveTemplate = viewChild.required<TemplateRef<any>>('roundPopup');
  protected saveForm!: FormGroup<Record<string, FormGroup<RoundForm>>>;

  protected imageUrl: string | null = null;
  private imageFile: File | null = null;

  ngOnInit() {
    const group: Record<string, FormGroup<RoundForm>> = {};

    for (let team of this.teams()) {
      group[team.name] = this.fb.group({
        score: this.fb.control<number | null>(null, {validators: Validators.required}),
        hasClosed: this.fb.control<boolean>(false, {nonNullable: true}),
        outInOne: this.fb.control<boolean>(false, {nonNullable: true})
      });
    }

    this.saveForm = this.fb.group(group, {validators: [this.allScoresValidator, this.exactlyOneClosedValidator]});

    //validation
    for(let team of this.teams()) {
      const teamGroup = this.saveForm.controls[team.name].controls;
      teamGroup.outInOne.disable();

      teamGroup.hasClosed.valueChanges.subscribe(value => {
        if(value) {
          teamGroup.outInOne.enable();

          // Uncheck all other hasClosed
          for (let other of this.teams()) {
            if (other.name !== team.name) {
              this.saveForm.controls[other.name].controls.hasClosed.setValue(false, {emitEvent: false});
              this.saveForm.controls[other.name].controls.outInOne.setValue(false, {emitEvent: false});
              this.saveForm.controls[other.name].controls.outInOne.disable();
            }
          }
        } else {
          teamGroup.outInOne.setValue(false, {emitEvent: false});
          teamGroup.outInOne.disable();
        }
      });
    }
  }

  public openPopup() {
    this.popupService.createPopup(
        'Add Round',
        this.saveTemplate(),
        this.callback.bind(this),
        () => this.saveForm.valid,
        'Add'
    );
  }

  protected onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) return;

    if(input.files) {
      this.imageFile = input.files![0];
      this.createImageFromBlob(this.imageFile);
    }
  }

  private callback(result: PopupResultType) {
    if (result === PopupResultType.SUBMIT) {
      this.saveRound();
    } else if (result === PopupResultType.CANCEL) {
      this.saveForm.reset();
    }
    this.saveForm.reset();

    this.imageFile = null;
    if(this.imageUrl) URL.revokeObjectURL(this.imageUrl);
    this.imageUrl = null;
  }

  private saveRound() {
    const formValue = this.saveForm.getRawValue();

    const roundResults: RoundResult[] = this.teams().map(team => ({
      team: team,
      score: Number(formValue[team.name].score),
      hasClosed: formValue[team.name].hasClosed,
      outInOne: formValue[team.name].outInOne
    }));

    this.addRoundEvent.emit(roundResults);

    //TODO send image as well
  }

  private createImageFromBlob(blob: Blob) {
    if(this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    this.imageUrl = URL.createObjectURL(blob);
  }

  // Make sure all scores are filled in
  private allScoresValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;

    const allValid = Object.values(group.controls).every(ctrl => {
      const fg = ctrl as FormGroup;
      return fg.get('score')?.value !== null && fg.get('score')?.value !== '';
    });

    return allValid ? null : { missingScore: true };
  };

  // Make sure exactly one hasClosed = true
  private exactlyOneClosedValidator: ValidatorFn = (control: AbstractControl) => {
    const group = control as FormGroup;

    const closedCount = Object.values(group.controls).filter(ctrl => {
      const fg = ctrl as FormGroup;
      return fg.get('hasClosed')?.value === true;
    }).length;

    return closedCount === 1 ? null : { invalidClosedCount: true };
  };

}
