import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SortService {
    sortDirection: 'asc' | 'desc' = 'asc';
    sortColumn: string = 'id';


    constructor() {
    }

    sort(column: string, array: any) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        array.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
            const valA = a[column];
            const valB = b[column];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return this.sortDirection === 'asc' ? valA - valB : valB - valA;
            }
        });
    }

}
