import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Globals} from "../../../../classes/globals";
import {PopupService} from "../../../../services/popup.service";
import {UserLoginDetails} from "../../../../dto/global/UserLoginDetails";
import {AuthService} from "../../../../services/auth.service";
import {PopupResultType} from "../../../../dto/global/PopupResultType";

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
    @ViewChild('loginPopup') loginTemplate!: TemplateRef<any>;
    loginForm!: FormGroup;

    @Output() loginEvent = new EventEmitter<void>();

    constructor(private globals: Globals,
                private popupService: PopupService,
                private authService: AuthService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(1)]],
            password: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    openPopup() {
        this.popupService.createPopup(
            'Login',
            this.loginTemplate,
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
