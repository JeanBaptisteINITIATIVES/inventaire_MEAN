import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatAutocompleteSelectedEvent } from "@angular/material";

import { FormEntryService } from "../services/form-entry.service";
import { TableEntryService } from "../services/table-entry.service";

import { LocValidator } from "../validators/loc-validator";
import { Entry } from "../../entry";

@Component({
	selector: 'app-free-form-entry',
	templateUrl: './free-form-entry.component.html',
	styleUrls: ['./free-form-entry.component.scss']
})
export class FreeFormEntryComponent implements OnInit {

	freeForm: FormGroup;
	options: FormGroup;

	untrackedProducts: any[] = [];
	locations: any[] = [];
	// filteredProducts;

	isInEditMode: boolean = false;
	verb: string = 'Ajouter';
	error: any = null;
	minLength: number;
	focus: string = "";

	protected active: boolean = true; // flag pour reset classes css formulaire

	filteredLocation$: Observable<any[]>;
	filteredFreeReference$: Observable<any[]>;
	filteredFreeDesignation$: Observable<any[]>;

	constructor(private formBuilder: FormBuilder, private formEntryService: FormEntryService, private tableEntryService: TableEntryService) { }

	ngOnInit() {
		// initialisation du formulaire
		this.initializeFreeForm();

		// Options du formulaire
		this.options = this.formBuilder.group({
			floatLabel: 'auto'
		});

		// Récupération des produits de l'API pour l'autocomplétion
		this.formEntryService.getUntrackedProducts()
			.subscribe(
				data => {
					this.untrackedProducts = data;
					// console.log('Untracked products', data);
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
		this.tableEntryService.editFreeEntrySubject.subscribe(data => {
			this.isInEditMode = true;
			this.verb = 'Modifier';
			console.log('Entrée à modifier ou supprimer', data);
			this.freeForm.get('id').patchValue((data as Entry).id);
			this.freeForm.get('location').patchValue((data as Entry).location);
			this.freeForm.get('reference').patchValue((data as Entry).reference);
			this.freeForm.get('designation').patchValue((data as Entry).designation);
			this.freeForm.get('quantity').patchValue((data as Entry).quantity);
			this.freeForm.get('status').patchValue((data as Entry).status);
			this.freeForm.get('commentary').patchValue((data as Entry).commentary);
			// this.entryIdToEdit = (data as Entry).id; // Id récupéré pour édition
			// console.log('id', this.entryIdToEdit);
		});
	}

	// Méthode d'initialisation du formulaire
	initializeFreeForm() {
		this.freeForm = this.formBuilder.group({
			id: -1,
			location: ['',
				[Validators.required],
				[LocValidator(this.formEntryService)]

			],
			reference: [''],
			designation: ['', [Validators.required]],
			quantity: ['',
				[Validators.required, Validators.pattern(/^[0-9]+$/)]
			],
			status: 'A',
			commentary: '',
			date_entry: new Date().toLocaleString(),
			date_update: new Date().toLocaleString()
		});

		// Emplacements filtrées de l'autocomplétion
		this.filteredLocation$ = this.freeForm.get('location').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByLoc(data))
		);
		// .do(data => console.log(data));

		// Références filtrées de l'autocomplétion
		this.filteredFreeReference$ = this.freeForm.get('reference').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByFreeRef(data))
		);
		// .do(data => console.log(data));

		// Désignations filtrées de l'autocomplétion
		this.filteredFreeDesignation$ = this.freeForm.get('designation').valueChanges.pipe(
			startWith(''),
			map(data => this.filterByFreeDes(data))
		);
		// .do(data => console.log(data));

		this.active = false;
		setTimeout(() => this.active = true, 0);

		// Focus sur 'emplacement'
		this.setFocus('freeLoc');
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
	filterByFreeRef(ref: string) {
		this.minLength = 2;
		if (ref && ref.length >= this.minLength) {
			let filteredProducts = this.untrackedProducts.filter(term => term.id.toLowerCase().indexOf(ref.toLowerCase()) === 0);
			// console.log('test', filteredProducts);
			if (filteredProducts.length > 0) {
				return filteredProducts.slice(0, 39);
			}
			else {
				return [];
			}
		}
	}

	// Méthode de filtrage de la saisie du champ "désignation"
	filterByFreeDes(des: string) {
		this.minLength = 3;
		if (des && des.length >= this.minLength) {
			// this.formEntryService.getProductByFreeDes(des).subscribe(data => {
			// 	this.filteredProducts = data;
				// console.log(this.filteredProducts);
				// console.log(this.filteredProducts.length);
				// return this.filteredProducts.slice(0, 39);
				let filteredProducts = this.untrackedProducts.filter(term => term.id.toLowerCase().includes(des.toLowerCase()));
				// console.log('FilteredFreeProducts', filteredProducts);
				
				if (filteredProducts.length > 0) {
					return filteredProducts.slice(0, 39);
				}
				else {
					return [];
				}
			// });
		}
	}

	// Crée 1 entrée de stock
	saveFreeEntry(entry): void {
		// console.log(this.freeForm.value);
		if (!this.isInEditMode) {
			this.verb = 'Ajouter';
			this.formEntryService.addFreeEntry(entry).subscribe();
			this.initializeFreeForm();
		}
		else if (this.isInEditMode) {
			this.formEntryService.updateFreeEntry(entry).subscribe();
			this.isInEditMode = !this.isInEditMode;
			this.initializeFreeForm();
		}
		this.verb = 'Ajouter';
	}

	// Annule l'édition
	cancelEdit() {
		this.isInEditMode = false;
		this.verb = 'Ajouter';
		this.initializeFreeForm();
	}

	// Supprime la ligne
	deleteEdit(entry) {
		this.formEntryService.deleteFreeEntry(entry).subscribe();
		this.isInEditMode = false;
		this.verb = 'Ajouter';
		this.initializeFreeForm();
	}

	// Donne le focus à un élément spécifié en argument
	setFocus(fieldToFocus: string): void {
		this.focus = fieldToFocus;
	}

	// Agit à sélection d'un emplacement
	onFreeLocSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		this.setFocus('freeRef');
	}

	// Agit à sélection d'une référence
	onFreeRefSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		let result = this.filterByFreeRef(event.option.value);
		// console.log('freeRef', result);
		this.freeForm.get('designation').setValue(result[0].name);
		// console.log('FreeDes value', result[0].name);
		this.setFocus('freeQty');
	}

	// Agit à sélection d'une désignation
	onFreeDesSelectionChanged(event: MatAutocompleteSelectedEvent): void {
		let result = this.filterByFreeDes(event.option.value);
		// console.log("2 : " + result[0].id);
		this.freeForm.get('reference').setValue(result[0].id);
		this.setFocus('freeQty');
	}

}

