import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "../../shared/services/message.service";
import {SortService} from "../../shared/services/sort.service";
import {ExcelService} from "../../shared/services/excel.service";
// import {DatePipe} from "@angular/common";


interface BankList {
  id: number;
  name: string;
  status:string;
  branch_code: string;
  ifsc_code: string;
  account_holder: string;
  created_at:string;
  updated_at:string;
  active:boolean;
}

@Component({
  selector: 'app-manage-banks',
  templateUrl: './manage-banks.component.html',
  styleUrls: ['./manage-banks.component.scss']
})


export class ManageBanksComponent {
  breadCrumbItems!: Array<{}>;
  banks : BankList[] = [];
  tempBanks : BankList[] = [];
  tempExcelData = [];
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  addBank= {
    'name':null,
    "branch_code": null,
    "ifsc_code": null,
    "account_holder": null,
  }
  editBank= {
    'bank_name':null,
    'bank_id':null
  }

  constructor(
      private modalService: NgbModal,
      private toaster: ToastrService,
      private offCanvas: NgbOffcanvas,
      private apiService: ApiService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private messageService: MessageService,
      private sortService: SortService,
      private excelService: ExcelService,
      // private dt: DatePipe
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Administration'},
      {label: 'Master', active: true}
    ];
    this.getBanks();
  }

  getBanks() {
    this.apiService.get('manage-banks/banks-list').subscribe(res => {
      this.banks = res.data.result;
      this.total=res.data.total;
      this.tempBanks = res.data.result;
    });

  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.banks.length);
  }

  sort(column: string) {
    this.sortService.sort(column, this.banks);
  }

  onValueChange(active:boolean, bank: BankList) {
    this.messageService.confirm(`Are you sure to ${active ? '' : 'In'}active Bank`, `${active ? 'A' : 'Ina'}ctive Bank`).then(
        value => {
          if (value.isConfirmed) {
            this.spinner.show().then(r => {
              return r;
            });
            if (active) {
              this.apiService.post('manage-banks/change-bank-status', {"bank_id":bank.id,"bank_status":"active"}).subscribe({
                next: (res) => {
                  this.toaster.success(res.message);
                  this.spinner.hide().then(r => {
                    return r;
                  });
                },
                error: (error) => {
                  this.toaster.error(error.error.error);
                  this.spinner.hide().then(r => {
                    return r;
                  });
                }, complete: () => {
                  this.getBanks();
                  this.modalService.dismissAll()
                  this.spinner.hide().then(r => {
                    return r;
                  });

                }
              });
            } else {
              this.apiService.post('manage-banks/change-bank-status', {"bank_id":bank.id,"bank_status":"inactive"}).subscribe({
                next: (res) => {
                  this.toaster.success(res.message);
                  this.spinner.hide().then(r => {
                    return r;
                  });
                },
                error: (error) => {
                  this.toaster.error(error.error.error);
                  this.spinner.hide().then(r => {
                    return r;
                  });
                }, complete: () => {
                  this.getBanks();
                  this.modalService.dismissAll()
                  this.spinner.hide().then(r => {
                    return r;
                  });

                }
              });
            }
          } else {
            this.getBanks();
          }
        }
    );
  }

  onSearch(searchText: string): void {
    const searchTextLower = searchText.toLowerCase();
    const filteredBanks = this.tempBanks.filter(x => x.name.toLowerCase().includes(searchTextLower) );

    if (searchTextLower == '') {
      this.banks = this.tempBanks;
    } else
      this.banks = filteredBanks;
  }

  openBankModal(content: any) {
    this.modalService.open(content, {centered: true, keyboard: false});
  }

  openEditBankModal(content: any,  bank: BankList) {
    this.editBank.bank_name = bank.name
    this.editBank.bank_id = bank.id
    this.modalService.open(content, {centered: true, keyboard: false});
  }
  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['serial_no', 'name','status', 'created_at', 'updated_at']
    this.excelService.exportAsExcelFile(this.tempExcelData, 'bankData', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.banks.length; i++) {
      //serial_no , name, category_name, status,created_at, updated_at
      const row = {
        'serial_no': i + 1,
        'name': this.banks[i].name,
        'status': this.banks[i].active ? 'Active' : 'Inactive',
        // 'created_at': this.dt.transform(this.banks[i].created_at, 'dd/MM/yyyy H:m:s'),
        // 'updated_at': this.dt.transform(this.banks[i].updated_at ? this.banks[i].updated_at : this.banks[i].created_at, 'dd/MM/yyyy H:m:s')
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;

  onSubmit(){
    // spinner
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        }).then(r =>
        {
          return r;
        }
    );
    this.apiService.post('manage-banks/create', this.addBank).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.spinner.hide().then(r => {
          return r;
        });
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide().then(r => r);
      }, complete: () => {
        this.addBank= {
          'name':null,
          "branch_code": null,
          "ifsc_code": null,
          "account_holder": null,
        }
        this.getBanks();
        this.modalService.dismissAll()
        this.spinner.hide().then(r => {
          return r;
        });
      }
    });
  }

  oneditSubmit(){
    // spinner
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        }).then(r =>
        {
          return r;
        }
    );
    this.apiService.post('manage-banks/update-bank', this.editBank).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.spinner.hide().then(r => {
          return r;
        });
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide().then(r => r);
      }, complete: () => {
        this.getBanks();
        this.modalService.dismissAll()
        this.spinner.hide().then(r => {
          return r;
        });
      }
    });
  }



}
