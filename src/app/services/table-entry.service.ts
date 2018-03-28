import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class TableEntryService {

	stockEntries: any[]   = [] // contient les saisies ajoutées via le formulaire
	freeEntries: any[]    = [] // contient les saisies ajoutées via le formulaire
	editStockEntrySubject = new Subject(); // pour communiquer avec le formulaire pour édition
	editFreeEntrySubject  = new Subject();

	BASE_URL = 'http://localhost:4201';

	constructor(private http: Http) { }

	getStockEntries() {
		return this.http.get(this.BASE_URL + '/api/stock-entries')
						.map(res => res.json());
						// .do(data => this.stockEntries = data);
	}

	getFreeEntries() {
		return this.http.get(this.BASE_URL + '/api/free-entries')
						.map(res => res.json());
						// .do(data => this.freeEntries = data);
	}

	// Edite une entrée
	editStockEntry(entry) {
		this.editStockEntrySubject.next(entry);
	}
	
	editFreeEntry(entry) {
		this.editFreeEntrySubject.next(entry);
	}

}
