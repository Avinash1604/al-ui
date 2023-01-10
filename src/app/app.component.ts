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
  loadingCity = false;
  loadingCountry = false;
  loadingState = false;
  loadingService = false;
  loadingInsurance = false;
  loadingZipcode = false;

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
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      service: this.fb.group({
        service: ['', Validators.required],
      }),
      insurenceProviders: this.fb.group({
        insurance: ['', Validators.required],
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
     const data = Object.assign({}, this.fg.value.address, this.fg.value.service, this.fg.value.insurenceProviders)
     localStorage.setItem('formData', JSON.stringify(data));

     this.router.navigate(["ai-integrator"])
    // this.loading = true;
    // const title = "Tell me about "+this.fg.value.address.city
    // this.alServiceService.getAiStream(title, this.callBackUpdateCity, "city")
    // this.alServiceService.getAiStream("Tell me about "+this.fg.value.address.state, this.callBackUpdateCity, "state")
    // this.alServiceService.getAiStream( "Tell me about "+this.fg.value.address.country, this.callBackUpdateCity, "country")
    // this.alServiceService.getAiStream( "Tell me about "+this.fg.value.address.zipcode, this.callBackUpdateCity, "zipcode")
    // this.alServiceService.getAiStream( "Tell me about "+this.fg.value.service.service, this.callBackUpdateCity, "service")
    // this.alServiceService.getAiStream( "Tell me about "+this.fg.value.insurenceProviders.insurance, this.callBackUpdateCity, "insurance")
  }

  callBackUpdateCity = (data: any, type: any) => {
    this.loading = false;

    if(type == "city") {
      this.responseCity = this.responseCity + data;
    }

    if(type == "state") {
      this.responseState = this.responseState + data;
    }

    if(type == "country") {
      this.responseCountry = this.responseCountry + data;
    }

    if(type == "zipcode") {
      this.responseZipcode = this.responseZipcode + data;
    }

    if(type == "service") {
      this.responseService = this.responseService + data;
    }

    if(type == "insurance") {
      this.responseInsurance = this.responseInsurance + data;
    }
  }

  clear() {
    this.responseCity = '';
    this.responseCountry = '';
    this.responseInsurance = '';
    this.responseState = '';
    this.responseService = '';
    this.responseZipcode = '';
  }
}
