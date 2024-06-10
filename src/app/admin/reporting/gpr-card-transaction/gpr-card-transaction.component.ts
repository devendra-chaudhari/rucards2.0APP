import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../shared/services/api.service";
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-gpr-card-transaction',
    templateUrl: './gpr-card-transaction.component.html',
    styleUrls: ['./gpr-card-transaction.component.scss']
})
export class GprCardTransactionComponent implements OnInit {
    @ViewChild('editDialog') editDialog!: TemplateRef<any>; // Reference to the ng-template

    breadCrumbItems!: Array<{}>;
    current_page = 1;
    pageSize = 10;
    selected_transaction_id = "";
    data: { TransactionID: string, FromDate: string, ToDate: string, pageno: number, pagesize: number } = {
        "TransactionID": this.selected_transaction_id,
        "FromDate": this.dp.transform(new Date().toDateString(),'yyyy-MM-dd'),
        "ToDate": this.dp.transform(new Date().toDateString(),'yyyy-MM-dd'),
        "pageno": this.current_page,
        "pagesize": this.pageSize
    }
    transactions: any[] = [];

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private offCanvas: NgbOffcanvas,
        private toastr: ToastrService,
        private dp: DatePipe
    ) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Administration'},
            {label: 'Permission', active: true}
        ];
        this.getPaypointEscrowLedgerTransaction();

    }


    getPaypointEscrowLedgerTransaction() {
        this.spinner.show();
        this.apiService.post('paypoint/ledger_passbook', this.data).subscribe({
            next: (res) => {
                this.transactions = res.data;
                this.toastr.success(res.message);
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

}
