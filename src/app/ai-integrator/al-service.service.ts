import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlServiceService {
  private businessData = new BehaviorSubject<any>({});
  url = "http://localhost:3000/"

  constructor() { }

  getBusinessData() {
    return this.businessData.asObservable();
  }

  setData(data: any) {
    return this.businessData.next(data);
  }

}
