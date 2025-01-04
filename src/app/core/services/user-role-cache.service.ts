import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserRoleCacheService {
  private cache: { [key: string]: any } = {};
  
  get(key: string): any {
    console.log(this.cache,"this cache get", key)
    return this.cache[key];
  }

  set(key: string, value: any): void {
    console.log(this.cache,"this cache set", value, key)
    this.cache[key] = value;
  }
}