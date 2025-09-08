import {Component, EventEmitter, inject, output, Output, TemplateRef, viewChild, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PopupService} from "../../../../services/popup.service";
import {UserLoginDetails} from "../../../../dto/all/UserLoginDetails";
import {AuthService} from "../../../../services/all/auth.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";

@Component({
    selector: 'app-login-popup',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './login-popup.component.html',
    standalone: true,
    styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
    private popupService = inject(PopupService);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);

    public loginTemplate = viewChild.required<TemplateRef<any>>('loginPopup');
    public loginEvent = output<void>();

    protected loginForm!: FormGroup;

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(1)]],
            password: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    public openPopup() {
        this.popupService.createPopup(
            'Login',
            this.loginTemplate(),
            this.callback.bind(this),
            () => this.loginForm.valid,
            'Login');
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.loginUser();
        } else if (result === PopupResultType.CANCEL) {
            this.loginForm.reset();
        }
    }

    private loginUser() {
        const user: UserLoginDetails = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        };

        this.authService.login(user).subscribe({
            next: res => {
                this.loginEvent.emit();
                this.loginForm.reset();
            }
        })
    }
}
