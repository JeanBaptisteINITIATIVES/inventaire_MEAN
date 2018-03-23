import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import { FormEntryService } from '../services/form-entry.service';

export function LocValidator(formEntryService: FormEntryService): AsyncValidatorFn {

	return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		let debounceTime = 250;
		return Observable.timer(debounceTime).switchMap(() => {
			return formEntryService.getLocations().map(
				res => {
					let locations = res.filter(term => term.num_location.toLowerCase().includes(control.value.toLowerCase()) === true);
					// console.log(locations);
					// console.log(control.value);
					return locations.length === 1 ? null : { "locNotExists": true };
				}
			);
		});
	};
}

@Directive({
	selector: '[LocNotExists][formControlName], [LocNotExists][formControl], [LocNotExists][ngModel]',
	providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: LocValidatorDirective, multi: true }]
})

export class LocValidatorDirective implements AsyncValidator {
	constructor(private formEntryService: FormEntryService) { }

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		return LocValidator(this.formEntryService)(control);
	}
}

