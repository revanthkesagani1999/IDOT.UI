import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Equipment } from '../board-admin/board-admin.component';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent {

  @Input() equipment?: Equipment ; // Input equipment to be edited
  @Input() showGenerateForm?: boolean = false;
  @Output() saveClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<void>();
  nextYearPriceIncreaseRate: number = 1;
  onSave() {
    if(this.showGenerateForm) {
      this.saveClicked.emit(this.nextYearPriceIncreaseRate);
    }else {
      console.log(this.equipment);
      this.saveClicked.emit(this.equipment);
    }
  }

  onCancel() {
    this.cancelClicked.emit();
  }
}
