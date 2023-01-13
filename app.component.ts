import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';
import { AlServiceService } from './ai-integrator/al-service.service';

// @ts-ignore
import * as oboe from 'oboe';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formControls!: ElementRef[];

  responseCity: string = "";
  responseCountry: string = "";
  responseState: string = "";
  responseService: string = "";
  responseInsurance: string = "";
  responseZipcode: string = "";
  loading = false;
  loadingCity = false;
  loadingCountry = false;
  loadingState = false;
  loadingService = false;
  loadingInsurance = false;
  loadingZipcode = false;

  finalSubmitData: any[] = [];

  title = "al-ui";
  fg!: FormGroup;
  message: any = {};
  private validationMessages: {
    [key: string]: { [key: string]: string | { [key: string]: string } };
  };
  constructor(
    private fb: FormBuilder,
    private alservice: AlServiceService,
    private router: Router,
    private alServiceService: AlServiceService
  ) {
    this.validationMessages = {
      service: {
        required: "Please enter your Service Name",
      },
      iProvider: {
        required: "Please enter Insurance provider",
      },
      email: {
        required: "Please enter your Email",
        email: "Please enter a valid email password",
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
      },
    };
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      address: this.fb.group({
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        country: ["", Validators.required],
        zipcode: ["", Validators.required],
      }),
      service: this.fb.group({
        service: ["", Validators.required],
      }),
      insurenceProviders: this.fb.group({
        insurance: ["", Validators.required],
      }),
    });
    this.setQuestionnair();
  }

  ngAfterViewInit(): void {}

  setQuestionnair() {
    const version  = localStorage.getItem("appVersion") ? localStorage.getItem("appVersion") : 0;
    if(environment.cacheChanges && environment.version != version) {
      localStorage.removeItem("questionnairs");
      localStorage.setItem("appVersion", environment.version.toString());
      environment.cacheChanges = false;
    }
    if (!localStorage.getItem("questionnairs")) {
      const questionairs = [
        {
          questionnair:
            "Write a short 1000 word blog about {service} service in {city} using {insurance} insurance",
        },
        {
          questionnair: "Write 500 word essay about {city}",
        },
        {
          questionnair: "Write 500 word essay about {state}",
        },
        {
          questionnair: "Write 500 word essay about {country}",
        },
        {
          questionnair: "Write 500 word essay about {zipcode}",
        },
        {
          questionnair: "Write 500 word essay about {service}",
        },
        {
          questionnair: "Write top 20 benefits of using {service}",
        },
        {
          questionnair: "Write 500 word essay about {insurance}",
        },
        {
          questionnair: "Write top 20 benefits of using {insurance}",
        },
      ];
      localStorage.setItem("questionnairs", JSON.stringify(questionairs));
    } 
  }

  invalidInputs(formgroup: FormGroup): { [key: string]: string } {
    let messages: any;
    for (const input in formgroup.controls) {
      const key = formgroup.controls[input];
      if (key instanceof FormGroup) {
        const nestedGroupMessages = this.invalidInputs(key);
        Object.assign(messages, nestedGroupMessages);
      } else {
        if (this.validationMessages[input]) {
          messages[input] = "";
          if (key.errors && (key.dirty || key.touched)) {
            Object.keys(key.errors).map((messageKey) => {
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
    const formData = Object.assign(
      {},
      this.fg.value.address,
      this.fg.value.service,
      this.fg.value.insurenceProviders
    );
    this.loading = true;
    const data = localStorage.getItem("questionnairs");
    this.finalSubmitData = JSON.parse(data ? data : "");
    this.finalSubmitData = this.finalSubmitData.map((data) => {
      this.replaceDynamicValue(data, formData)
      this.replaceWithPlagiarismValue(data);
      return data;
    });
    console.log(this.finalSubmitData);

    this.finalSubmitData.forEach((data: any, index: any) => {
      this.alServiceService.getAiStream(
        data.questionnair,
        this.callBackUpdate,
        data.questionnair
      );
    });
  }

  callBackUpdate = (data: any, type: any) => {
    this.loading = false;
    this.updateArray(data, type);
  };

  replaceWithPlagiarismValue(data: any) {
    const plagiarismChecked  = (localStorage.getItem("plagiarismChecked") != null) ? localStorage.getItem("plagiarismChecked") : true;
    if(plagiarismChecked) {
      const value = data["questionnair"].replace("word", "word plagiarism free content")
      data["questionnair"] = value
    }
    return data
  }

  updateArray(response: any, value: any) {
    this.finalSubmitData = this.finalSubmitData.map((data) => {
      if (data.questionnair == value) {
        let exitsingData = data["alData"];
        if (exitsingData) {
          data["alData"] = exitsingData + response;
        } else {
          data["alData"] = response;
        }
      }
      return data;
    });
  }

  replaceDynamicValue(map: any, data: any): any {
    const value = map["questionnair"].replace(
      /{([^{}]+)}/g,
      (keyExpr: any, key: any) => {
        return data[key] || "";
      }
    );
    map["questionnair"] = value;
    return map;
  }

  clear() {
    this.finalSubmitData = this.finalSubmitData.map((data) => {
      data["alData"] = "";
      return data;
    });
  }

  gotoQuestionnair() {
    this.router.navigate(["questionnairs"]);
  }

  // private callBackUpdateCity(data: any) {
  //   this.response = this.response + data;
  //   //More Logic and code here
  // }

  // clear() {
  //   this.finalSubmitData = this.finalSubmitData.map((data) => {
  //     data["alData"] = ''
  //     return data;
  //   });
  // }

  // callBackUpdateCity = (data: any, type: any) => {
  //   this.loading = false;

  //   if(type == "city") {
  //     this.responseCity = this.responseCity + data;
  //   }

  //   if(type == "state") {
  //     this.responseState = this.responseState + data;
  //   }

  //   if(type == "country") {
  //     this.responseCountry = this.responseCountry + data;
  //   }

  //   if(type == "zipcode") {
  //     this.responseZipcode = this.responseZipcode + data;
  //   }

  //   if(type == "service") {
  //     this.responseService = this.responseService + data;
  //   }

  //   if(type == "insurance") {
  //     this.responseInsurance = this.responseInsurance + data;
  //   }
  // }

  // clear() {
  //   this.responseCity = '';
  //   this.responseCountry = '';
  //   this.responseInsurance = '';
  //   this.responseState = '';
  //   this.responseService = '';
  //   this.responseZipcode = '';
  // }
}
