import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Equipment } from '../board-admin/board-admin.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/notification.service';
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
  labourWageForm?: FormGroup;
  showFuelForm = false;
  showWageForm = false;
  showConfirmationDialog = false;
  generateNewDataConfirmed = false;
  confirmationMessage = 'Do you want to update all year\'s data based on the new year data?';


  constructor(private userService: UserService, private fb: FormBuilder, private dialog: MatDialog, private router: Router, private notificationService: NotificationService) {
    this.fuelCostsForm = this.fb.group({
      gasoline_price: 0,  // Field for gasoline price
      diesel_price: 0,    // Field for diesel price
      other: 0            // Field for other fuel type
    });
    this.labourWageForm = this.fb.group({
      hourly_wage: 0
    })
  }

  ngOnInit(): void {
    this.fetchAllModelYears();
  }

  fetchAllModelYears() {
    this.userService.getAllModelYears().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.equipmentYears = response.years.sort();
      },
      (error) => {
        this.dataLoaded = true
        console.error(error);
      }
    );
  }

  loadEquipmentData(year: string) {
    if (year === 'new') {
      this.showGenerateForm = true;
    } else if (year === 'fuel') {
      this.loadFuelCosts();
    } else if (year ==='wage') {
      this.loadWageCosts();
    } else{
      // this.dataLoaded = false;
      // this.selectedYear = year;
      // this.userService.getModelDataByYear(year).subscribe(
      //   (response) => {
      //     this.currentEquipmentData = response.data;
      //     this.dataLoaded = true;
      //   },
      //   (error) => {
      //     console.error(error);
      //   }
      // );
      this.router.navigate(['/equipment-list'], { queryParams: { modelYear: year, isManageEquipment: true } });
 
    }
  }

  loadFuelCosts() {
    this.dataLoaded = false;
    this.showFuelForm = true;
    this.userService.getFuelCosts().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.setFuelFormValues(response.fuelCosts);  // Patch values to the form
      },
      (error) => {
        this.dataLoaded = true;
        console.error(error);
      }
    );
  }

  loadWageCosts() {
    this.dataLoaded = false;
    this.showWageForm = true;
    this.userService.getHourlyWage().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.setWageFormValues(response.wageCosts);  // Patch values to the form
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
      this.closeFuelForm();
      this.userService.editFuelCosts(editedFuelCosts).subscribe(
        (response) => {
          this.showFuelForm = false;
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Fuel costs edited successfully', 'success');
          console.log('Fuel costs edited successfully:', response);
        },
        (error) => {
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Error editing fuel costs', 'error');
          console.error('Error editing fuel costs:', error);
        }
      );
    }
  }

  closeFuelForm() {
    this.showFuelForm = false;
  }

  editHourlyWage() {
    if (this.labourWageForm) {
      this.dataLoaded = false;
      const editedWageForm = this.labourWageForm.value;
      this.closeWageForm();
      this.userService.editHourlyWage(editedWageForm).subscribe(
        (response) => {
          this.showWageForm = false;
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Wage costs edited successfully', 'success');
          console.log('Wage costs edited successfully:', response);
        },
        (error) => {
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Error editing Wage costs', 'error');
          console.error('Error editing Wage costs:', error);
        }
      );
    }
  }

  closeWageForm() {
    this.showWageForm = false;
  }

  setFuelFormValues(response: any) {
    if (this.fuelCostsForm) {
      this.fuelCostsForm.patchValue(response);
    }
  }

  setWageFormValues(response: any) {
    if (this.labourWageForm) {
      this.labourWageForm.patchValue(response);
    }
  }

  

  generateNextYearData(priceIncreaseRate: number) {
    this.openConfirmationDialog(priceIncreaseRate);
  }
  
  openConfirmationDialog(priceIncreaseRate: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        message: this.confirmationMessage,
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.continueGeneratingNextYearData(priceIncreaseRate, result);
      }
    });
  }
  
  continueGeneratingNextYearData(priceIncreaseRate: number, dataUpdate: boolean) {
    this.dataLoaded = false;
    this.userService.generateNextYearEquipData(priceIncreaseRate, dataUpdate).subscribe(
      (response) => {
        console.log('Next year data generated:', response);
        this.notificationService.triggerNotification('Next year data generated', 'success');
        this.dataLoaded = true;
        this.fetchAllModelYears();
      },
      (error) => {
        this.dataLoaded = true;
        this.notificationService.triggerNotification('Error generating next year data', 'error');
        console.error('Error generating next year data:', error);
      }
    );
    this.showGenerateForm = false;
  }
  

  onCancelEdit() {
    this.showGenerateForm = false;
  }
}
  
  
  
  
  
