import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { DataHolderService } from '../services/data-holder.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<any> {
  constructor(private dataHolderService: DataHolderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return new Observable(observer => {
      this.dataHolderService.fetchUserData();
      this.dataHolderService.getTags().subscribe(
        tags => {
          this.dataHolderService.tags = tags;
          observer.next(tags);  // You can return the tags or any other necessary data
          observer.complete();
        },
        error => {
          console.error('Error fetching tags:', error);
          observer.error(error);  // Forward the error if something goes wrong
        }
      );
    });
  }
}
