import { CommonModule, DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToWords } from "to-words";
import { SimplebarAngularModule } from "simplebar-angular";
import { ApiService } from "src/app/shared/services/api.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrService } from "ngx-toastr";
import { CountdownComponent, CountdownEvent, CountdownModule } from "ngx-countdown";
import { SessionStorageService } from "src/app/shared/services/session-storage.service";
import { User } from "src/app/shared/interfaces/user";

@Component({
  selector: "app-transfer-balance",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgbModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    NgSelectModule,
    CountdownModule,
  ],
  templateUrl: "./transfer-balance.component.html",
  styleUrls: ["./transfer-balance.component.scss"],
})
export class TransferBalanceComponent {
  breadCrumbItems!: Array<{}>;
  page: number = 1;
  pageSize: number = 10;
  tempExcelData: [];
  user: User | undefined;
  select_role = false;
  select_user = false;
  retailers = [];
  transferBalanceForm: FormGroup;
  toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: true,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });
  isFundSubmit: boolean = false;

  needRetailerMobileOtp = false;
  resendRetailerMobileOTP = false;
  resendAadharOtp = false;
  retailerCurrentStep = 1;
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
  config = { leftTime: 60 };
  role = "retailer";
  otp_msg = "";
  otp_ref_id = "";

  //otp
  otp = "";
  needCustomerMobileOtp = false;
  resendCustomerMobileOTP = false;
  customerCurrentStep = 1;
  isCustomerSubmit = false;
  customer_terms = false;
  customer_mobile_otp = "";
  retailer_mobile_otp = "";

  constructor(
    private apiService: ApiService,
    private excelService: ExcelService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private sessionStorage: SessionStorageService,
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage Balance" },
      { label: "Transfer Balance", active: true },
    ];
    this.getRetailerListByDistributorId(this.page, this.pageSize);
    this.transferBalanceForm = this.formBuilder.group({
      selectretailer: ["", Validators.required], // Example form control
      amount: ["", Validators.required], // Example form control
      remark: [""], // Example form control
    });
  }

  get ff() {
    return this.transferBalanceForm.controls;
  }

  handleEvent($event: CountdownEvent) {
    if ($event.status === 3) {
      this.resendRetailerMobileOTP = false;
      this.resendAadharOtp = false;
      this.resendCustomerMobileOTP = false;
      this.countdown.stop();
    }
  }

  convertNumber(amount: number) {
    return this.toWords.convert(amount);
  }

  getRetailerListByDistributorId(
    page: number,
    page_size: number,
    start_date: Date = null,
    end_date: Date = null
  ) {
    const data = {
      page_no: page,
      page_size: page_size,
      start_date: start_date,
      end_date: end_date,
    };
    console.log("in getRetailerListByDistributorId", data);
    this.apiService
      .post("user/retailers_list_by_distributor_id", data)
      .subscribe(
        (res) => {
          this.retailers = res.data.result;
          console.log(this.retailers);
        },
        (error) => {
          this.toaster.error(error.error.error);
        }
      );
  }

  customSearchFn(term: string, item) {
    const cleanName = item.name.replace(",", "");
    term = term.toLowerCase();
    return cleanName.toLowerCase().indexOf(term) > -1;
  }

  onSubmit() {
    console.log(this.transferBalanceForm);
    
  }

  onReset() {
    this.transferBalanceForm.reset();
  }

  onSearch(searchText: string): void {
    // Custom search logic
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = [
      "serial_no",
      "message",
      "status",
      "visible_at",
      "start_date",
      "end_date",
      "created_at",
      "updated_at",
    ];
    this.excelService.exportAsExcelFile(
      this.tempExcelData,
      "masterData",
      sortByField,
      excludeFields,
      columnOrder
    );
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    // Custom Excel data logic
  }
}
