export interface Entry {
	id: number;
	location: string;
	reference: string;
	designation: string;
	quantity: number;
	status: string;
	tracked: boolean;
	commentary: string;
	date_entry: string;
	date_update?: string;
}