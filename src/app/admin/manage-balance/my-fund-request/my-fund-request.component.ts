import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {ExcelService} from "../../../shared/services/excel.service";
import {random} from "lodash";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-my-fund-request',
    templateUrl: './my-fund-request.component.html',
    styleUrls: ['./my-fund-request.component.scss']
})

export class MyFundRequestComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    transactions: any[] = [];
    page: number = 1;
    pageSize: number = 10;

    constructor(
        private apiService: ApiService,
        private toaster: ToastrService,
        private excelService: ExcelService,
        private spinner: NgxSpinnerService
    ) {
        this.GetMyFundRequests();
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Manage Balance'},
            {label: 'My Fund Request', active: true}
        ];

    }


    onSearch(value: string) {

    }

    export_to_excel() {
        this.spinner.show();
        this.excelService.exportAsExcelFile(this.transactions, 'Fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['request_date', 'amount', 'deposit_date', 'ref_no', 'status', 'wallet_name', 'response_at', 'response_remark', 'remark']);
        this.spinner.hide();

    }

    GetMyFundRequests() {
        this.spinner.show();
        this.apiService.get('fund_request/my_fund_request').subscribe({
            next: (res) => {
                this.transactions = res.data;
                this.spinner.hide();

            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();


            }
        });
    }


}
