import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Contact, ContactGroup } from '../models/contact';
import { ContactService } from '../services/contact.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  addContactVisible = false;
  addGroupForm: FormGroup;
  contacts: Contact[] = [];
  contactGroups: ContactGroup[] = [];
  editingContact: Contact | null = null;
  isModalVisible = false;
  isLoading = false;
  pageIndex: number = 1; 
  pageSize: number = 10; 
  totalContacts: number = 0; 
  searchTerm: string = '';
  filteredContacts: Contact[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(
    private fb: FormBuilder, 
    private contactService: ContactService, 
    private message: NzMessageService,
    private router: Router
    ) {
    this.addGroupForm = this.fb.group({
      groupName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    debugger;
    this.loadContacts();
    this.loadContactGroups();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.getPaginatedAndSerachContacts(this.searchTerm,this.pageIndex, this.pageSize).subscribe({
      next: (response) => { 
        debugger;
        this.contacts = response.contacts	; 
        this.totalContacts = response.totalContacts;  
        this.isLoading = false;
      },
      error: () => { 
        this.isLoading = false; 
        this.message.error('Failed to load contacts'); 
      }
    });
  }

  loadContactGroups(): void {
    this.contactService.getContactGroups().subscribe(data => this.contactGroups = data);
  }

  startEdit(id: any): void {
    debugger
    this.router.navigate(['/editcontact', id]);
  }

  saveContact(contact : Contact): void {
    if (this.editingContact) {
      this.contactService.updateContact(this.editingContact).subscribe({
        next: () => { this.loadContacts(); this.isModalVisible = false; this.message.success('Contact updated'); },
        error: () => this.message.error('Failed to update contact')
      });
    }
  }

  deleteContact(id: any): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => { this.loadContacts(); this.message.success('Contact deleted'); },
      error: () => this.message.error('Failed to delete contact')
    });
  }


 showAddModal(): void {
  this.addContactVisible = true;
}

 onPageChange(pageIndex: number): void {
  this.pageIndex = pageIndex; 
  this.loadContacts(); 
}

updateContact(contact: any): void {
  this.contactService.updateContact(contact).subscribe({
    next: () => {
      this.message.success('Contact updated');
      this.loadContacts();
    },
    error: error => {
      if (error.status === 400 && error.error.errors) {
        const validationErrors = error.error.errors;
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
      console.error(error);
      this.loadContacts();
    }
  });
}



addContact() {
  this.router.navigate(['/addcontact']);  
}


handleCancel(){
this.addContactVisible = false;
}

handleOk(): void {
  console.log(this.addGroupForm.value);
  this.contactService.createContactGroup(this.addGroupForm.value).subscribe({
    next: (response) => {
    this.message.success('Group added'); 
    this.addGroupForm.reset(); 
    this.addContactVisible = false;
    this.loadContacts();
    this.loadContactGroups();
    },
    error: (error) => {
      this.message.error('Failed to add group'); 
      console.error('Error creating contact group:', error);
    }
  });
}

  exportToExcel(): void {
    const exportData = this.contacts.map(contact => ({
      Name: contact.name,
      'Phone Number': contact.phoneNumber,
      'Contact Type': contact.contactType,
      'Contact Group': this.contactGroups.find(group => group.id === contact.groupId)?.groupName || ''
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Contacts': worksheet }, SheetNames: ['Contacts'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = 'Contacts.xlsx';
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    saveAs(data, fileName);
  }
}


