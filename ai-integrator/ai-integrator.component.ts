import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlServiceService } from "./al-service.service";

// @ts-ignore
import * as oboe from "oboe";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-ai-integrator",
  templateUrl: "./ai-integrator.component.html",
  styleUrls: ["./ai-integrator.component.scss"],
})
export class AiIntegratorComponent implements OnInit {
  businessData: any = {};
  fg!: FormGroup;
  response: string = "";
  responseCity: string = "";
  responseCountry: string = "";
  responseState: string = "";
  responseService: string = "";
  responseInsurance: string = "";
  formData: any;
  finalSubmitData: any[] = [];
  plagiarismChecked: any = false;

  loading = false;
  searchedTitle = "";
  searchKeyWords = [
    { key: "address.address", value: "Address" },
    { key: "address.city", value: "City" },
    { key: "address.state", value: "State" },
    { key: "address.country", value: "Country" },
    { key: "address.zipcode", value: "ZipCode" },
    { key: "serviceName.service", value: "Service" },
    { key: "insurenceProviders.iProviders", value: "Insurence Providers" },
  ];

  constructor(
    private fb: FormBuilder,
    private _alServiceService: AlServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setQuestionnair();
    this.fg = this.fb.group({
      questionnairs: this.fb.array([]),
    });
    this.getBusinessData();
    this.getStoredTemplate();
    this.plagiarismChecked  = (localStorage.getItem("plagiarismChecked") != null) ? localStorage.getItem("plagiarismChecked") : true;

  }

  onPlagiarismChange() {
    this.plagiarismChecked = !this.plagiarismChecked;
    localStorage.setItem("plagiarismChecked", this.plagiarismChecked);
  }

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


  getStoredTemplate() {
    const data = localStorage.getItem("questionnairs");
    this.finalSubmitData = JSON.parse(data ? data : "");
    this.finalSubmitData.forEach(data => {
      this.questionairFieldAsFormArray.push(this.questionairWithValue(data.questionnair));
    })
  }

  get questionairFieldAsFormArray(): any {
    return this.fg.get("questionnairs") as FormArray;
  }

  questionairWithValue(value: any): any {
    return this.fb.group({
      questionnair: this.fb.control(value),
    });
  }

  questionair(): any {
    return this.fb.group({
      questionnair: this.fb.control(""),
    });
  }

  addControl(): void {
    this.questionairFieldAsFormArray.push(this.questionair());
  }

  removeField(i: number): void {
    this.questionairFieldAsFormArray.removeAt(i);
  }

  getBusinessData() {
    this._alServiceService.getBusinessData().subscribe((data) => {
      this.businessData = data;
    });
  }

  onSubmit() {
    localStorage.setItem('questionnairs', JSON.stringify(this.fg.value.questionnairs));
    this.router.navigate([''])
  }

  close() {
    this.router.navigate([''])
  }

}
