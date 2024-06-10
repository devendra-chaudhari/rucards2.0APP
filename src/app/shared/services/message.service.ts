import {Injectable} from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor() {
    }

    confirm(title: string, text: string) {
        return swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showClass: {
                popup: 'animated bounceIn'
            },
            showCancelButton: true,
            confirmButtonColor: '#2F8BE6',
            cancelButtonColor: '#F55252',
            confirmButtonText: 'Confirm',
            customClass: {
                confirmButton: 'btn btn-primary me-2',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
        });
    }

    verify(title: string, text: string) {
        return swal.fire({
            title: title,
            text: text,
            icon: 'info',
            showClass: {
                popup: 'animated bounceIn'
            },
            showCancelButton: true,
            confirmButtonColor: '#2F8BE6',
            cancelButtonColor: '#F55252',
            confirmButtonText: 'Verify',
            customClass: {
                confirmButton: 'btn btn-primary me-2',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
        });
    }

    success(text: string) {
        return swal.fire({
            text: text,
            icon: 'success',
            toast: true,
            position: 'top-end',
            timerProgressBar: true,
            timer: 5000,
            background: '#c71515',
            showClass: {
                popup: 'animated bounceIn'
            },
            showCancelButton: false,
            showConfirmButton: false,
            buttonsStyling: false
        });
    }

    warning(text: string) {
        return swal.fire({
            text: text,
            icon: 'warning',
            showClass: {
                popup: 'animated bounceIn'
            },
            showCancelButton: true,
            showConfirmButton: false,
            confirmButtonText: 'Close',
            customClass: {
                cancelButton: 'btn btn-primary'
            },
            buttonsStyling: false
        });
    }

    error(text: string) {
        return swal.fire({
            text: text,
            icon: 'error',
            showClass: {
                popup: 'animated bounceIn'
            },
            showCancelButton: true,
            showConfirmButton: false,
            confirmButtonText: 'Close',
            customClass: {
                cancelButton: 'btn btn-primary'
            },
            buttonsStyling: false
        });
    }

}
