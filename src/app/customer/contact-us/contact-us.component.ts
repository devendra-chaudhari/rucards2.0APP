import { Component, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

  contactUsForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),
    phone : new UntypedFormControl('', [Validators.required]),
    message : new UntypedFormControl('', [Validators.required])
  });
  constructor(private renderer: Renderer2,
    public formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {

    this.contactUsForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['', Validators.required],
      
    })

  }
  focusFunc(event: Event) {
    const parent = (event.target as HTMLElement).parentNode as HTMLElement;
    this.renderer.addClass(parent, 'focus');
  }

  onSubmit() {
    this.contactUsForm.reset()
    console.log(this.contactUsForm.value)
  }

}
