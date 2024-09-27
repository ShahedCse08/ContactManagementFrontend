import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsComponent } from './contacts/contacts.component'; // Update the path if necessary
import { EditContactComponent } from './edit-contact/edit-contact.component';



const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent },
  { path: 'addcontact', component: AddContactComponent },
  { path: 'editcontact/:id', component: EditContactComponent },
  { path: '**', redirectTo: '/contacts' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
