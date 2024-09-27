import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../services/contact.service'; 
import { Router } from '@angular/router';
import { Contact, ContactGroup } from '../models/contact';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {

  editContactForm!: FormGroup;
  contactId: string;
  contactGroups: ContactGroup[] = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
  ) {
    this.contactId = this.route.snapshot.paramMap.get('id') || ''; 
  }


  ngOnInit(): void {
    this.initializeForm();
    if (this.contactId) {
      this.loadContactGroups();
      this.loadContactData();
    }
  }


  loadContactGroups(): void {
    this.contactService.getContactGroups().subscribe(data => this.contactGroups = data);
  }

  initializeForm(): void {
    this.editContactForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      contactType: ['', Validators.required],
      groupId: ['', Validators.required]
    });
  }

  loadContactData(): void {
    this.contactService.getContactById(this.contactId).subscribe(contact => {
      this.editContactForm.patchValue({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        contactType: contact.contactType,
        groupId: contact.groupId
      });
    });
  }

  submitAddContact(): void {
    if (this.editContactForm.valid) {
      const updatedContact: Contact = {
        ...this.editContactForm.value,  
        id: this.contactId           
      };
      
      this.contactService.updateContact(updatedContact).subscribe({
        next: () => { 
          this.router.navigate(['/contacts']); 
          this.message.success('Contact updated'); 
        },
        error: (errorResponse) => {
          if (errorResponse.status === 400 && errorResponse.error.errors) {
            const validationErrors = errorResponse.error.errors;
            let errorMessages: string[] = [];
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                const fieldErrors = validationErrors[field].join('; ');
                errorMessages.push(`${fieldErrors}`);
              }
            }
            this.message.error(`Failed to update contact:\n${errorMessages.join('\n')}`);
          } else {
            this.message.error('Failed to update contact');
          }
        }
      });
    }
  }
  cancel(){
    this.router.navigate(['/contacts']);
  }

}
