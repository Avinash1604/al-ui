import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlServiceService } from './al-service.service';

// @ts-ignore
import * as oboe from 'oboe';

@Component({
  selector: 'app-ai-integrator',
  templateUrl: './ai-integrator.component.html',
  styleUrls: ['./ai-integrator.component.scss'],
})
export class AiIntegratorComponent implements OnInit {
  businessData: any = {};
  fg!: FormGroup;
  response: string = '';
  loading = false;
  searchedTitle = '';
  searchKeyWords = [
    { key: 'address.address', value: 'Address' },
    { key: 'address.city', value: 'City' },
    { key: 'address.state', value: 'State' },
    { key: 'address.country', value: 'Country' },
    { key: 'address.zipcode', value: 'ZipCode' },
    { key: 'serviceName.service', value: 'Service' },
    { key: 'insurenceProviders.iProviders', value: 'Insurence Providers' },
  ];

  constructor(
    private fb: FormBuilder,
    private _alServiceService: AlServiceService
  ) {}

  ngOnInit(): void {
    this.fg = this.fb.group({
      keyword: ['', Validators.required],
      text: ['', Validators.required],
    });
    this.getBusinessData();
  }

  getBusinessData() {
    this._alServiceService.getBusinessData().subscribe((data) => {
      this.businessData = data;
    });
  }

  onSubmit() {
    this.loading = true;
    const keyword = this.searchKeyWords.filter((data: any) => data.key == this.fg.value.keyword)[0]["key"]
    const value = this.searchKeyWords.filter((data: any) => data.key == this.fg.value.keyword)[0]["value"]
    this.searchedTitle = this.fg.value.text+" "+value+this.businessData[keyword.split(".")[0]][keyword.split(".")[1]];
  }


  getCityOutput(searchedTitle: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://localhost:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        this.response = this.response + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log('-------------------DONE---------------------');
        this.loading = false;
        console.log(data);
      })
      .fail( (data: any) => {
        console.log('-------------------FAIL---------------------');
        console.log(data);
        this.loading = false;
      });
  }

  getCountryOutput(searchedTitle: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://localhost:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        this.response = this.response + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log('-------------------DONE---------------------');
        this.loading = false;
        console.log(data);
      })
      .fail( (data: any) => {
        console.log('-------------------FAIL---------------------');
        console.log(data);
        this.loading = false;
      });
  }


  getStateOutput(searchedTitle: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://localhost:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        this.response = this.response + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log('-------------------DONE---------------------');
        this.loading = false;
        console.log(data);
      })
      .fail( (data: any) => {
        console.log('-------------------FAIL---------------------');
        console.log(data);
        this.loading = false;
      });
  }

  getServiceOutput(searchedTitle: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://localhost:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        this.response = this.response + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log('-------------------DONE---------------------');
        this.loading = false;
        console.log(data);
      })
      .fail( (data: any) => {
        console.log('-------------------FAIL---------------------');
        console.log(data);
        this.loading = false;
      });
  }


  getInsuranceOutput(searchedTitle: any) {
    const data = {"text":searchedTitle}
    var config = {
      url: 'http://localhost:3000/ai/stream',
      method: 'POST',
      body: data,
      cached: false,
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        this.response = this.response + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log('-------------------DONE---------------------');
        this.loading = false;
        console.log(data);
      })
      .fail( (data: any) => {
        console.log('-------------------FAIL---------------------');
        console.log(data);
        this.loading = false;
      });
  }

  clear() {
    this.response = '';
    this.searchedTitle = '';
  }
}
