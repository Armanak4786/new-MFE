import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss'
})
export class AdditionalInfoComponent {
@Input() columns = 125;
@Output() inputChanged = new EventEmitter<string>();

inputText: string = '';
formGroup: FormGroup;
constructor( private fb: FormBuilder,){}
ngOnInit(){
  this.formGroup = new FormGroup({
    inputText: new FormControl(''),
  })   
}

onInputChange() {
  this.inputText =  this.formGroup.get('inputText').value;
  this.inputChanged.emit(this.inputText);
}
}