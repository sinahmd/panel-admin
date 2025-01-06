import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserRoleCacheService {
  private cache: { [key: string]: any } = {};

  get(key: string): any {
    return this.cache[key];
  }

  set(key: string, value: number | null): void {
    this.cache[key] = value;
  }
}