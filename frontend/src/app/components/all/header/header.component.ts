import {Component, HostListener, inject, OnInit, viewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../services/all/auth.service";
import {LoginPopupComponent} from "../popups/login-popup/login-popup.component";

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    LoginPopupComponent
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  protected authService = inject(AuthService);

  public loginPopup = viewChild.required<LoginPopupComponent>('loginPopup');

  protected mobileMenuOpen = false;

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const header = document.querySelector('header');
    if (this.mobileMenuOpen && header && !header.contains(target)) {
      this.mobileMenuOpen = false;
    }
  }

  ngOnInit() {
    this.mobileMenuOpen = false;

    this.authService.loadUser().subscribe({
      next: res => {

      }
    })
  }

  protected toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  protected openLoginPopup() {
    this.loginPopup().openPopup();
  }

  protected loggedIn() {
    window.location.reload();
  }
}
