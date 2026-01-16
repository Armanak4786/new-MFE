import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    constructor() { }

    getCurrentTimeString(): string {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        return `${time} | ${date}`;
    }
}
