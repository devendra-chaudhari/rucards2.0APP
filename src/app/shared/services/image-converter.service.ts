import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageConverterService {

    constructor() {
    }


    public convertBlobToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result?.toString();
                if (base64String) {
                    resolve(base64String);
                } else {
                    reject('Unable to convert file to base64');
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

}
