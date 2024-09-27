export interface Contact {
    id?: number;
    name: string;
    phoneNumber: string;
    contactType: string;
    groupId: number;
    groupName: number;
  }

  
  export interface ContactGroup {
    id: number;
    groupName: string;
  }