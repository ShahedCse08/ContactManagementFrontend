import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContactGroup } from '../models/contact';
import { ContactService } from '../services/contact.service';
@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  addContactForm: FormGroup;
  contactGroups: ContactGroup[] = [];

  constructor(
    private fb: FormBuilder, 
    private contactService: ContactService, 
    private message: NzMessageService,
    private router: Router
    ) {
    this.addContactForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      contactType: ['Personal', Validators.required],
      groupId: [null, Validators.required],
    });

  }
  
  ngOnInit(): void {
    this.loadContactGroups();
  }


  loadContactGroups(): void {
    this.contactService.getContactGroups().subscribe(data => this.contactGroups = data);
  }

  submitAddContact(): void {
    if (this.addContactForm.valid) {
      this.contactService.createContact(this.addContactForm.value).subscribe({
        next: () => {
          this.message.success('Contact added');
          this.addContactForm.reset();
        },
        error: (error) => {
          if (error.status === 400 && error.error.errors) {
            const validationErrors = error.error.errors;
            let errorMessages: string[] = [];
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                const fieldErrors = validationErrors[field].join('; ');
                errorMessages.push(`${fieldErrors}`);
              }
            }
            this.message.error(`Failed to add contact:\n${errorMessages.join('\n')}`);
          } else {
            this.message.error('Failed to add contact');
          }
          console.error(error);
        }
      });
    } else {
      this.message.error('Please fill in all required fields');
    }
  }
  
cancel(){
  this.router.navigate(['/contacts']);
}

}
