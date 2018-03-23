import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatedDate'
})
export class FormatedDatePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		// console.log('valeur avant pipe', value);
		// 2018-03-22T09:16:39.263Z
		let fullDate, restDate;
		[fullDate, restDate] = value.toLowerCase().split('t');
		let year, month, day;
		[year, month, day] = fullDate.split('-');

		let fullTime, restTime;
		[fullTime, restTime] = restDate.split('.');
		let hour, min, sec;
		[hour, min, sec] = fullTime.split(':');
		
		return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
	}

}
