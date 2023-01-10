import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlServiceService } from "./al-service.service";

// @ts-ignore
import * as oboe from "oboe";
import { Router } from "@angular/router";

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
    const data = localStorage.getItem("formData");
    this.formData = JSON.parse(data ? data : "");
    console.log(this.formData);

    this.fg = this.fb.group({
      questionnairs: this.fb.array([]),
    });
    this.getBusinessData();
    this.getStoredTemplate();
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
