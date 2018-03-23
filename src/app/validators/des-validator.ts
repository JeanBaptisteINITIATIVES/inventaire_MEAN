import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import { FormEntryService } from '../services/form-entry.service';

export function DesValidator(formEntryService: FormEntryService): AsyncValidatorFn {

	return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		let debounceTime = 250;
		return Observable.timer(debounceTime).switchMap(() => {
			return formEntryService.getProductByDes(control.value).map(
				res => {
					// console.log(res.json());
					return res.json().length > 0 ? null : { "desNotExists": true };
				}
			);
		});
	};
}

@Directive({
	selector: '[desNotExists][formControlName], [desNotExists][formControl], [desNotExists][ngModel]',
	providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: DesValidatorDirective, multi: true }]
})

export class DesValidatorDirective implements AsyncValidator {
	constructor(private formEntryService: FormEntryService) { }

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		return DesValidator(this.formEntryService)(control);
	}
}