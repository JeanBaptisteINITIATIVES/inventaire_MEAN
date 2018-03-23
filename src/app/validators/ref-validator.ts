import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import { FormEntryService } from '../services/form-entry.service';

export function RefValidator(formEntryService: FormEntryService): AsyncValidatorFn {
	
	return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		let debounceTime = 250;
		return Observable.timer(debounceTime).switchMap(() => {
			return formEntryService.getProductByRef(control.value).map(
				res => {
					// console.log(res.json());
					return res.json().length > 0 ? null : { "refNotExists": true };
				}
			);
		});
	};
}

@Directive({
	selector: '[refNotExists][formControlName], [refNotExists][formControl], [refNotExists][ngModel]',
	providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: RefValidatorDirective, multi: true }]
})

export class RefValidatorDirective implements AsyncValidator {
	constructor(private formEntryService: FormEntryService) { }

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		return RefValidator(this.formEntryService)(control);
	}
}

