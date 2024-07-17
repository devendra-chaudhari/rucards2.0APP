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
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule, NgxSpinnerService, Spinner } from "ngx-spinner";
import { ToWords } from "to-words";
import { SimplebarAngularModule } from "simplebar-angular";
import { ApiService } from "src/app/shared/services/api.service";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrService } from "ngx-toastr";
import {
  CountdownComponent,
  CountdownEvent,
  CountdownModule,
} from "ngx-countdown";
import { SessionStorageService } from "src/app/shared/services/session-storage.service";
import { User } from "src/app/shared/interfaces/user";
import { random } from "lodash";

export interface RucardsWallet {
  id: string;
  name: string;
  wallet_status: string;
  product_id: string;
}

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
  transactions = [];
  wallets: [];
  total: number = 0;
  users;

  transferBalanceForm: FormGroup;
  Wallets: RucardsWallet[] = [];
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
  data = {
    "page_no": 1,
    "pagesize":10
  }

  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
  config = { leftTime: 60 };
  isSubmitted = false;
  needOtp = false;
  resendOtp = false;
  mobile = "";
  requiredMobile = false;
  invalidMobile = false;
  userFound = false;
  otp_msg = "";
  otp_ref_id = "";

  //otp
  otpData = {
    mobile_no: "",
    otp: "",
    ref_id: "",
  };

  constructor(
    private apiService: ApiService,
    private excelService: ExcelService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private sessionStorage: SessionStorageService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage Balance" },
      { label: "Transfer Balance", active: true },
    ];
    this.getRetailerListByDistributorId(this.page, this.pageSize);
    this.getWallets();
    this.getTransferHistory(this.page, this.pageSize);
    this.transferBalanceForm = this.formBuilder.group({
      selectretailer: ["", Validators.required], // Example form control
      wallet: ["", Validators.required],
      amount: ["", Validators.required], // Example form control
      remark: [""], // Example form control
    });

  }

  get ff() {
    return this.transferBalanceForm.controls;
  }


  handleEvent($event: CountdownEvent) {
    if ($event.status === 3) {
      this.resendOtp = false;
      this.countdown.stop();
    }
  }

  verifyOtp() {
    this.spinner.show();
    this.otpData.mobile_no = this.mobile;
    this.otpData.ref_id = this.otp_ref_id;
    this.apiService.post("user/verify_mobile_otp", this.otpData).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.transferBalance();
        this.needOtp = false;
        this.userFound = false;
        this.modalService.dismissAll();
        this.transferBalanceForm.reset();
        this.spinner.hide();
      },
      error: (error) => {
        this.toastr.error(error.error.error);
        this.transferBalanceForm.reset();
        this.spinner.hide();
      },
    });
  }

  transferBalance() {
    const payload = {
      receiver_id: this.transferBalanceForm.value.selectretailer.id,
      wallet_id: this.transferBalanceForm.value.wallet.id,
      request_amount: this.transferBalanceForm.value.amount,
      remark:this.transferBalanceForm.value.remark
    };

    this.apiService.post("wallet/transfer-balance", payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.transferBalanceForm.reset();
        this.transferBalanceForm.enable()
        this.spinner.hide();
      },
      error: (error) => {
        this.toastr.error(error.error.error);
        this.transferBalanceForm.reset();
        this.transferBalanceForm.enable()
        this.spinner.hide();
      },
    });
  }

  resendCustomerMobileOtp() {
    this.spinner.show();
    this.spinner.show();
    this.apiService
      .post("auth/generate_register_otp", { mobile: "9004569291" })
      .subscribe({
        next: (res) => {
          this.otp_msg = res.message;
          this.otp_ref_id = res.data.ref_id;
          this.spinner.hide();
        },
        error: (error) => {
          this.toaster.error(error.error.error);
          this.spinner.hide();
        },
      });
  }

  onSubmit() {
    console.log(this.transferBalanceForm);
    this.spinner.show();
    this.user = this.sessionStorage.getCurrentUser();
    this.mobile = this.user.mobile;
    this.apiService
      .post("auth/generate_register_otp", { mobile: this.mobile })
      .subscribe({
        next: (res) => {
          this.otp_msg = res.message;
          this.otp_ref_id = res.data.ref_id;
          this.mobile = res.data.mobile;
          this.needOtp = true;
          this.transferBalanceForm.disable();
          this.spinner.hide();
        },
        error: (error) => {
          this.toaster.error(error.error.error);
          this.spinner.hide();
        },
      });
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

  getTransferHistory(
    page: number,
    pageSize: number,
    start_date: Date = null,
    end_date: Date = null
  ) {
    const data = {
      page_no: page,
      page_size: pageSize,
      start_date: start_date,
      end_date: end_date,
    };
    console.log("in getRetailerListByDistributorId", data);
    this.apiService
      .post("transaction/get_transfer_balance_transaction", data)
      .subscribe(
        (res) => {
          this.transactions = res.data.result;
          this.total = res.data.total;
          console.log(this.transactions)
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

  getWallets() {
    this.users = this.sessionStorage.getCurrentUser;
    const user_id = this.users.id;
    this.apiService
      .post("wallet/rucards-wallet-list", { user_id: "" })
      .subscribe({
        next: (res) => {
          this.wallets = res.data.result;
          console.log(this.wallets);
        },
        error: (error) => {
          this.toaster.error(error.error.error);
        },
        complete: () => {},
      });
  }
  // for table page-size and pagination
  onPageSizeChange() {
    this.data.pagesize=this.pageSize;
    this.getTransferHistory(this.pageSize, this.page)
  }

  onPageChange(event: any){
    this.page = event
    this.getTransferHistory(this.pageSize, this.page)
}
protected readonly Math = Math;

  getMax() {
      return Math.min(this.page * this.pageSize, this.total);
    }
  

  onReset() {
    this.transferBalanceForm.reset();
  }

  onSearch(searchText: string): void {
    // Custom search logic
  }

  export_to_excel() {
    this.excelService.exportAsExcelFile(this.transactions, 'Revoke-fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['fund_transaction_id', 'transaction_type', 'receiver_profile_id ', 'amount', 'current_balance', 'created_at'])

}
}
