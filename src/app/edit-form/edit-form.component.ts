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
  @Input() showAddForm = false;
  @Input() subCategoriesMap: { [category: string]: string[] } = {};
  @Output() saveClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<void>();
  nextYearPriceIncreaseRate: number = 1;
  categoryMode: string = 'existing';
  onSave() {
    if(this.showGenerateForm) {
      this.saveClicked.emit(this.nextYearPriceIncreaseRate);
    }else {
      console.log(this.equipment);
      this.saveClicked.emit(this.equipment);
    }
  }

  onCategoryModeChange(): void {
    if (this.equipment){
      if (this.categoryMode === 'new') {
        this.equipment.Category = '';
        this.equipment.Sub_Category = '';
      } else if (this.categoryMode === 'existing') {
         this.equipment.Category = this.getCategories()[0] || '';
        this.equipment.Sub_Category = ''; 
        if (this.equipment.Category) {
          this.onCategoryChange();
        }
      }
    }
  }

  getCategories(): string[] {
    return Object.keys(this.subCategoriesMap);
  }

  onCategoryChange() {
    // Example custom logic that could be added here:
    // Reset the selected subcategory to an initial state
    if (this.equipment)
    this.equipment.Sub_Category = '';
    
  }
  onCancel() {
    this.cancelClicked.emit();
  }
}
