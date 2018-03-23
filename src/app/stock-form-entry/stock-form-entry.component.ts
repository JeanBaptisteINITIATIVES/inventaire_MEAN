import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatAutocompleteSelectedEvent } from "@angular/material";

import { FormEntryService } from "../services/form-entry.service";
import { RefValidator } from "../validators/ref-validator";
import { DesValidator } from "../validators/des-validator";
import { LocValidator } from "../validators/loc-validator";
import { Entry } from "../../entry";

@Component({
	selector: 'app-stock-form-entry',
	templateUrl: './stock-form-entry.component.html',
	styleUrls: ['./stock-form-entry.component.scss']
})
export class StockFormEntryComponent implements OnInit {

	stockForm: FormGroup;
	options: FormGroup;

	trackedProducts: any[]  = [];
	locations: any[] = [];

	isInEditMode: boolean = false;
	verb: string = 'Ajouter';
	error: any = null;
	minLength: number;
	focus: string = "";

	protected active: boolean = true; // flag pour reset classes css formulaire

	filteredLocation$: Observable<any[]>;
	filteredReference$: Observable<any[]>;
	filteredDesignation$: Observable<any[]>;

	constructor(private formBuilder: FormBuilder, private formEntryService: FormEntryService) { }

	ngOnInit() {
		// initialisation du formulaire
		this.initializeForm();

		// Options du formulaire
		this.options = this.formBuilder.group({
			floatLabel: 'auto'
		});

		// Récupération des produits de l'API pour l'autocomplétion
		this.formEntryService.getTrackedProducts()
			.subscribe(
				data => {
					this.trackedProducts = data;
					// console.log('Tracked products', data);
				},
				error => {
					console.error();
					this.error = error;
				}
		);

		// Récupération des emplacements du backend pour l'autocomplétion
		this.formEntryService.getLocations()
			.subscribe(
				data => {
					this.locations = data;
					// console.log(data);
				},
				error => {
					console.error();
					this.error = error;
				}
		);
		
		// On récupère l'entrée à éditer
		this.formEntryService.editEntrySubject.subscribe(data => {
			this.isInEditMode = true;
			this.verb = 'Modifier';
			console.log('Entrée à modifier ou supprimer', data);
			this.stockForm.get('location').patchValue((data as Entry).location);
			this.stockForm.get('reference').patchValue((data as Entry).reference);
			this.stockForm.get('designation').patchValue((data as Entry).designation);
			this.stockForm.get('quantity').patchValue((data as Entry).quantity);
			this.stockForm.get('status').patchValue((data as Entry).status);
			this.stockForm.get('commentary').patchValue((data as Entry).commentary);
		});
	}

	// Méthode d'initialisation du formulaire
	initializeForm() {
		this.stockForm = this.formBuilder.group({
			id: -1,
			location: [ '',
				[ Validators.required ],
				[ LocValidator(this.formEntryService) ]
		
			],
			reference: ['',
				[ Validators.required ],
				[ RefValidator(this.formEntryService) ]
			],
			designation: ['',
				[ Validators.required ],
				[ DesValidator(this.formEntryService) ]
			],
			quantity: ['',
				[ Validators.required, Validators.pattern(/^[0-9]+$/) ]
			],
			status: 'A',
			commentary: '',
			date_entry: new Date().toLocaleString(),
			date_update: new Date().toLocaleString()
			// date_update: new Date().toISOString().split('T')[0]
		});

		// Emplacements filtrées de l'autocomplétion
		this.filteredLocation$ = this.stockForm.get('location').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByLoc(data))
		);
		// .do(data => console.log(data));

		// Références filtrées de l'autocomplétion
		this.filteredReference$ = this.stockForm.get('reference').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByRef(data))
		);
		// .do(data => console.log(data));

		// Désignations filtrées de l'autocomplétion
		this.filteredDesignation$ = this.stockForm.get('designation').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByDes(data))
		);
		// .do(data => console.log(data));

		this.active = false;
		setTimeout(() => this.active = true, 0);

		// Focus sur 'emplacement'
		this.setFocus('loc');
	}

	// Méthode de filtrage de la saisie du champ "référence"
	filterByLoc(loc: string) {
		this.minLength = 1;
		if (loc && loc.length >= this.minLength) {
			let filteredLocations = this.locations.filter(term => term.num_location.toLowerCase().indexOf(loc.toLowerCase()) === 0);
			if (filteredLocations.length > 0) {
				return filteredLocations.slice(0, 39);
			}
			else {
				return [];
			}
		}
	}
	
	// Méthode de filtrage de la saisie du champ "référence"
	filterByRef(ref: string) {
		this.minLength = 2;
		if (ref && ref.length >= this.minLength) {
			let filteredProducts = this.trackedProducts.filter(term => term.id.toLowerCase().indexOf(ref.toLowerCase()) === 0);
			if (filteredProducts.length > 0) {
				return filteredProducts.slice(0, 39);
			}
			else {
				return [];
			}
		}
	}

	// Méthode de filtrage de la saisie du champ "désignation"
	filterByDes(des: string) {
		this.minLength = 4;
		if (des && des.length >= this.minLength) {
			let filteredProducts = this.trackedProducts.filter(term => term.name.toLowerCase().includes(des.toLowerCase()));
			// console.log('filteredProducts', filteredProducts);
			if (filteredProducts.length > 0) {
				return filteredProducts.slice(0, 39);
			}
			else {
				return [];
			}
		}
	}

	// Crée 1 entrée de stock
	createStockEntry(entry): void {
		// console.log(this.stockForm.value);
		this.formEntryService.addStockEntry(entry).subscribe();
		this.initializeForm();
		if ( !this.isInEditMode ) {
			this.verb = 'Ajouter';
		}
		else if ( this.isInEditMode ) {
			this.isInEditMode = !this.isInEditMode;
		}
		this.verb = 'Ajouter';
	}

	// Annule l'édition
	cancelEdit() {
		this.isInEditMode = false;
		this.verb = 'Ajouter';
		this.stockForm.reset();
		this.setFocus('loc');
	}

	// Donne le focus à un élément spécifié en argument
	setFocus(fieldToFocus: string): void {
		this.focus = fieldToFocus;
	}

	// Agit à sélection d'un emplacement
	onLocSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		this.setFocus('ref');
	}
	
	// Agit à sélection d'une référence
	onRefSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		let result = this.filterByRef(event.option.value);
		this.stockForm.get('designation').setValue(result[0].name);
		this.setFocus('qty');
	}
	
	// Agit à sélection d'une désignation
	onDesSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		let result = this.filterByDes(event.option.value);
		// console.log("2 : " + result[0].id);
		this.stockForm.get('reference').setValue(result[0].id);
		this.setFocus('qty');
	}

}
