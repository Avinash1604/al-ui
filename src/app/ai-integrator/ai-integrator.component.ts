import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlServiceService } from "./al-service.service";

// @ts-ignore
import * as oboe from "oboe";

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
    private _alServiceService: AlServiceService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem("formData");
    this.formData = JSON.parse(data ? data : "");
    console.log(this.formData);

    this.fg = this.fb.group({
      questionnairs: this.fb.array([this.questionair()]),
    });
    this.getBusinessData();
  }

  get questionairFieldAsFormArray(): any {
    return this.fg.get("questionnairs") as FormArray;
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
    this.loading = true;
    console.log(this.fg.value);
    this.finalSubmitData = this.fg.value.questionnairs;
    this.finalSubmitData = this.finalSubmitData.map((data) =>
      this.replaceDynamicValue(data)
    );
    console.log(this.finalSubmitData);

    this.finalSubmitData.forEach((data: any, index: any) => {
      this._alServiceService.getAiStream(
        data.questionnair,
        this.callBackUpdate,
        data.questionnair
      );
    });

    // const keyword = this.searchKeyWords.filter((data: any) => data.key == this.fg.value.keyword)[0]["key"]
    // const value = this.searchKeyWords.filter((data: any) => data.key == this.fg.value.keyword)[0]["value"]
    // this.searchedTitle = this.fg.value.text+" "+value+this.businessData[keyword.split(".")[0]][keyword.split(".")[1]];
  }

  callBackUpdate = (data: any, type: any) => {
    this.loading = false;
    this.updateArray(data, type);
  };

  updateArray(response: any, value: any) {
    this.finalSubmitData = this.finalSubmitData.map((data) => {
      if (data.questionnair == value) {
        let exitsingData = data["alData"];
        if(exitsingData) {
          data["alData"] = exitsingData+response;
        } else{
          data["alData"] = response;
        }
      }
      return data;
    });
  }

  replaceDynamicValue(map: any): any {
    const value = map["questionnair"].replace(
      /{([^{}]+)}/g,
      (keyExpr: any, key: any) => {
        return this.formData[key] || "";
      }
    );
    map["questionnair"] = value;
    return map;
  }

  private callBackUpdateCity(data: any) {
    this.response = this.response + data;
    //More Logic and code here
  }

  clear() {
    this.finalSubmitData = this.finalSubmitData.map((data) => {
      data["alData"] = ''
      return data;
    });
  }
}
