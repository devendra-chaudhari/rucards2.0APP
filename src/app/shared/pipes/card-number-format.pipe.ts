import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cardNumberFormat',
    standalone: true
})
export class CardNumberFormatPipe implements PipeTransform {

    transform(value: string): string {
        if (!value || value.length !== 16) {
            return value;
        }

        const part1 = value.slice(0, 4);
        const part2 = value.slice(4, 8);
        const part3 = value.slice(8, 12);
        const part4 = value.slice(12, 16);

        return `${part1}-${part2}-${part3}-${part4}`;
    }

}
