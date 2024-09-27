import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ContactGroup } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:7160/api/contacts'; 
  private contactGroupUrl ='http://localhost:7160/api/contactgroups';
  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}`);
  }

  getPaginatedContacts(pageIndex: number, pageSize: number) {
    return this.http.get<{ contacts	: Contact[], totalContacts	: number }>(`${this.apiUrl}/GetPaginatedContacts?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  getPaginatedAndSerachContacts(searchTerm: string, pageIndex: number, pageSize: number) {
    return this.http.get<{ contacts	: Contact[], totalContacts	: number }>(`${this.apiUrl}/GetPaginatedAndSearchableContacts?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }


  getContactById(contactId: any): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${contactId}`);
  }

  getContactGroups(): Observable<ContactGroup[]> {
    return this.http.get<ContactGroup[]>(`${this.contactGroupUrl}`);
  }

  createContactGroup(groupData: any): Observable<any> {
    return this.http.post<any>(`${this.contactGroupUrl}`, groupData);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(contact: Contact): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contact.id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
