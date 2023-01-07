import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';
import { AlServiceService } from './ai-integrator/al-service.service';

// @ts-ignore
import * as oboe from 'oboe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formControls!: ElementRef[];

  responseCity: string = '';
  responseCountry: string = '';
  responseState: string = '';
  responseService: string = '';
  responseInsurance: string = '';
  responseZipcode: string = '';
  loading = false;

  title = 'al-ui';
	fg!: FormGroup;
  message: any = {};
  private validationMessages: {
    [key: string]: { [key: string]: string | { [key: string]: string } };
  };
  constructor(private fb: FormBuilder, private alservice: AlServiceService, private router: Router, private alServiceService: AlServiceService) {
    this.validationMessages = {
      service: {
        required: "Please enter your Service Name"
      },
      iProvider: {
        required: "Please enter Insurance provider"
      },
      email: {
        required: "Please enter your Email",
        email: "Please enter a valid email password"
      },
      lineOne: {
        required: "Please enter your address line one",
      },
      lineTwo: {
        required: "Please enter your address line two",
      },
      city: {
        required: "Please enter your city",
      },
      state: {
        required: "Please enter your state",
      },
      country: {
        required: "Please enter your country",
      },
      zipcode: {
        required: "Please enter your zipcode",
      }
    };
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      address: this.fb.group({
        lineOne: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      service: this.fb.group({
        serviceName: ['', Validators.required],
      }),
      insurenceProviders: this.fb.group({
        iProviders: ['', Validators.required],
      }),
    });
  }

  ngAfterViewInit(): void {
    // const addBlurs: Observable<
    //   any
    // >[] = this.formControls.map((formControl: ElementRef) =>
    //   fromEvent(formControl.nativeElement, 'blur')
    // );
    // merge(this.fg.valueChanges, ...addBlurs)
    //   .pipe(debounceTime(500))
    //   .subscribe((value) => {
    //     this.message = this.invalidInputs(
    //       this.fg
    //     );
    //   });
  }

  invalidInputs(formgroup: FormGroup): { [key: string]: string } {
    let messages: any;
    for (const input in formgroup.controls) {
        const key = formgroup.controls[input];
        if (key instanceof FormGroup) {
          const nestedGroupMessages = this.invalidInputs(key);
          Object.assign(messages, nestedGroupMessages)
        } else {
          if (this.validationMessages[input]) {
            messages[input] = '';
            if (key.errors && (key.dirty || key.touched)) {
              Object.keys(key.errors).map(messageKey => {
                if (this.validationMessages[input][messageKey]) {
                  messages[input] = this.validationMessages[input][messageKey];
                }
              });
          }
        }
      }
    }
    return messages;
  }



  onSubmit() {
     console.log(this.fg.value);
     //this.alservice.setData(this.fg.value);
    // this.router.navigate(["ai-integrator"]);
    this.loading = true;

    const title = "Tell me about "+this.fg.value.address.city
    this.getCityOutput(title);

    this.getStateOutput("Tell me about "+this.fg.value.address.state);

    this.getCountryOutput( "Tell me about "+this.fg.value.address.country);

    this.getZiocodeOutput( "Tell me about "+this.fg.value.address.zipcode);

    this.getServiceOutput("Tell me about "+this.fg.value.service.serviceName);

    this.getInsuranceOutput("Tell me about "+this.fg.value.insurenceProviders.iProviders);


  }

  getCityOutput(searchedTitle: any) {
    this.loading = true;

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
        this.responseCity = this.responseCity + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
      })
      .done( (data: any) => {
        console.log(data);
      })
      .fail( (data: any) => {
       console.log(data);
        this.loading = false;
      });
  }

  getCountryOutput(searchedTitle: any) {
    this.loading = true;

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
        this.loading = false;
        console.log(data);
        this.responseCountry = this.responseCountry + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
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

  getZiocodeOutput(searchedTitle: any) {
    this.loading = true;

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
        this.loading = false;
        console.log(data);
        this.responseZipcode = this.responseZipcode + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
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
    this.loading = true;

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
        this.responseState = this.responseState + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
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
    this.loading = true;

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
        this.responseService = this.responseService + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
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
    this.loading = true;

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
        this.responseInsurance = this.responseInsurance + data['data']?.replace(new RegExp('\n', 'g'), "<br />");
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
    this.responseCity = '';
    this.responseCountry = '';
    this.responseInsurance = '';
    this.responseState = '';
    this.responseService = '';
  }
}
