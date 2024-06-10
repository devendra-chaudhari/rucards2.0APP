import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateago',
    pure: true
})
export class DateagoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'Just now';
            const intervals = {
                'Year': 31536000,
                'Month': 2592000,
                'Week': 604800,
                'Day': 86400,
                'Hour': 3600,
                'Minute': 60,
                'Second': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' Ago'; // singular (1 day ago)
                    } else {
                        return counter + ' ' + i + 's Ago'; // plural (2 days ago)
                    }
            }
        }
        return value;
    }

}
