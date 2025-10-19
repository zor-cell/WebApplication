import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {UserLoginDetails} from "../dto/all/UserLoginDetails";
import {UserDetails} from "../dto/all/UserDetails";
import {Role} from "../dto/all/Role";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUri: string;
    user: UserDetails | null = null;

    constructor(private httpClient: HttpClient, private globals: Globals) {
        this.baseUri = this.globals.backendUri + '/auth';
    }

    login(credentials: UserLoginDetails): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/login', credentials);
    }

    loadUser(): Observable<UserDetails> {
        return this.httpClient.get<UserDetails>(this.globals.backendUri + '/users/me', {
            context: this.globals.silentErrorContext
        }).pipe(
            tap(user => this.user = user)
        );
    }

    isAdmin(): boolean {
        return this.user?.roles.includes(Role.ADMIN) ?? false;
    }

    isAuthenticated(): boolean {
        return !!this.user;
    }
}
