export interface Contact {
    id: string;
    name: string;
    address: string;
}

export interface ContactState {
    contacts: Contact[];
}
