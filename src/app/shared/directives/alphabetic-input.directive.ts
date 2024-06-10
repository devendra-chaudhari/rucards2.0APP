import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabeticInput]'
})
export class AlphabeticInputDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const allowedCharacters = /[a-zA-Z.\-\s]/;

    if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        allowedCharacters.test(event.key)
    ) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
