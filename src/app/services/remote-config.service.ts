import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remotes = environment.remotes;

  getRemoteUrl(remoteName: 'dealer' | 'commercial' | 'admin'): string {
    return this.remotes[remoteName];
  }

  getRemoteEntryUrl(remoteName: 'dealer' | 'commercial' | 'admin'): string {
    const baseUrl = this.getRemoteUrl(remoteName);
    return `${baseUrl}/remoteEntry.js`;
  }
}
