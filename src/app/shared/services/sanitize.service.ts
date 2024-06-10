import {Injectable} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeStyle,
    SafeScript,
    SafeUrl,
    SafeResourceUrl,
    SafeValue
} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SanitizeService {

    constructor(private sanitizer: DomSanitizer) {
    }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    sanitizeStyle(style: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }

    sanitizeScript(script: string): SafeScript {
        return this.sanitizer.bypassSecurityTrustScript(script);
    }

    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    sanitizeResourceUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    sanitizeText(
        text: string,
        removeHtmlTags: boolean = true,
        removeScripts: boolean = true,
        removeUnsafeAttributes: boolean = true,
        clearString: boolean = true
    ): string {
        if (clearString) {
            text = this.clearString(text);
        }
        if (removeHtmlTags) {
            text = this.removeHtmlTags(text);
        }
        if (removeScripts) {
            text = this.removeScripts(text);
        }
        if (removeUnsafeAttributes) {
            text = this.removeUnsafeAttributes(text);
        }
        return text;
    }

    private clearString(text: string): string {
        // Remove all characters except a-z, A-Z, 0-9, _, and -
        return text.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    private removeHtmlTags(text: string): string {
        // Remove HTML tags using a regex
        return text.replace(/<[^>]*>/g, '');
    }

    private removeScripts(text: string): string {
        // Remove <script> tags and content
        return text.replace(/<script[^>]*>(.*?)<\/script>/g, '');
    }

    private removeUnsafeAttributes(text: string): string {
        // Remove potentially unsafe attributes
        return text.replace(/ on\w+="[^"]*"/g, ''); // Example: removes `onclick="..."` attributes
    }

}
