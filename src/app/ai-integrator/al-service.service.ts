import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// @ts-ignore
import * as oboe from 'oboe';

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

  getAiStream(searchedTitle: any, callback: any, type: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://18.191.47.199:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        callback(data['data']?.replace(new RegExp('\n', 'g'), "<br />"), type);
      })
      .fail( (data: any) => {
       console.log(data);
      });
  }

}
