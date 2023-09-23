import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Equipment } from '../board-admin/board-admin.component';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-equipment-manager',
  templateUrl: './equipment-manager.component.html',
  styleUrls: ['./equipment-manager.component.scss'],
})
export class EquipmentManagerComponent implements OnInit {
  equipmentYears: string[] = [];
  selectedYear: string = '';
  currentEquipmentData: Equipment[] = [];
  dataLoaded = false;
  showGenerateForm = false;
  fuelCostsForm?: FormGroup;
  showFuelForm = false;
  constructor(private userService: UserService, private fb: FormBuilder) {
    this.fuelCostsForm = this.fb.group({
      gasoline_price: 0,  // Field for gasoline price
      diesel_price: 0,    // Field for diesel price
      other: 0            // Field for other fuel type
    });
  }

  ngOnInit(): void {
    this.userService.getAllModelYears().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.equipmentYears = response.years.sort();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadEquipmentData(year: string) {
    if (year === 'new') {
      this.showGenerateForm = true;
    } else if (year === 'fuel') {
      this.loadFuelCosts();
    } else{
      this.dataLoaded = false;
      this.selectedYear = year;
      this.userService.getModelDataByYear(year).subscribe(
        (response) => {
          this.currentEquipmentData = response.data;
          this.dataLoaded = true;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  loadFuelCosts() {
    this.dataLoaded = false;
    this.showFuelForm = true;
    this.userService.getFuelCosts().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.setFormValues(response.fuelCosts);  // Patch values to the form
      },
      (error) => {
        this.dataLoaded = true;
        console.error(error);
      }
    );
  }

  editFuelCosts() {
    if (this.fuelCostsForm) {
      this.dataLoaded = false;
      const editedFuelCosts = this.fuelCostsForm.value;
      this.userService.editFuelCosts(editedFuelCosts).subscribe(
        (response) => {
          this.showFuelForm = false;
          this.dataLoaded = true;
          console.log('Fuel costs edited successfully:', response);
        },
        (error) => {
          this.dataLoaded = true;
          console.error('Error editing fuel costs:', error);
        }
      );
    }
  }

  closeFuelForm() {
    this.showFuelForm = false;
  }

  setFormValues(response: any) {
    if (this.fuelCostsForm) {
      this.fuelCostsForm.patchValue(response);
    }
  }


  generateNextYearData(priceIncreaseRate: number) {
    this.userService.generateNextYearEquipData(priceIncreaseRate).subscribe(
      (response) => {
        console.log('Next year data generated:', response);
      },
      (error) => {
        console.error('Error generating next year data:', error);
      }
    );

    // Hide the generate form (if needed)
    this.showGenerateForm = false;
  }

  onCancelEdit() {
    this.showGenerateForm = false;
  }
}
  
  
  
  
  
