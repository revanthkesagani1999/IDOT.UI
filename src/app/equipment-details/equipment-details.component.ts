import { Component, OnInit, Input } from '@angular/core';
import { Equipment } from '../board-admin/board-admin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { CalculatorService } from '../calculator.service';
@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss']
})
export class EquipmentDetailsComponent {
  @Input() equipment?: Equipment;
  ModelYear?: number;
  isAdmin = false;
  constructor(private storageService: StorageService,private route: ActivatedRoute, private router: Router, private calculatorService: CalculatorService) { }

  ngOnInit(): void {
    this.equipment = history.state.equipment;
    const user = this.storageService.getUser();
    this.ModelYear = history.state.modelYear;
    this.isAdmin = user.roles.includes('ROLE_ADMIN');
    if (!this.equipment) {
      this.router.navigate(['/equipment-list']);
    } else {
      this.calculateDefaultValues();
      this.onCalculateCostsClicked('view')
    }
  }

  private roundTo = function(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  private calculateDefaultValues(): void {
    const currYear = new Date().getFullYear();
    if (this.equipment) {
      const currYear = new Date().getFullYear();

      
      //ownership cost
      if (
        this.equipment.Original_price && this.equipment.Salvage_Value && this.equipment.Economic_Life_in_months &&
        this.equipment.Usage_rate && this.equipment.Cost_of_Capital_rate && this.equipment.Annual_Overhead_rate &&
        this.equipment.Hourly_Wage && this.equipment.Annual_Overhaul_Labor_Hours && this.equipment.Annual_Overhaul_Parts_cost_rate &&
        this.equipment.Annual_Field_Labor_Hours && this.equipment.Monthly_use_hours &&
        this.equipment.Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate && this.equipment.Annual_Ground_Engaging_Component_rate &&
        this.equipment.Horse_power && this.equipment.Fuel_unit_price &&
        this.equipment.Cost_of_A_New_Set_of_Tires && this.equipment.Tire_Life_Hours &&
        this.equipment.Lube_Operating_cost_Hourly && this.equipment.Sales_Tax && this.equipment.Discount && this.equipment.Initial_Freight_cost && this.ModelYear
      )         
      {
      
        this.equipment.Current_Market_Year_Resale_Value = Math.max(
          this.equipment.Original_price - ((currYear - this.ModelYear) * this.equipment.Original_price * (1 - this.equipment.Salvage_Value)) / (this.equipment.Economic_Life_in_months / 12),
          this.equipment.Original_price * this.equipment.Salvage_Value
        );
        
        this.equipment.Depreciation_Ownership_cost_Monthly = (this.equipment.Original_price * (1 + this.equipment.Sales_Tax) * (1 - this.equipment.Discount) * (1 - this.equipment.Salvage_Value) + (this.equipment.Initial_Freight_cost * this.equipment.Original_price)) / (this.equipment.Economic_Life_in_months / this.equipment.Usage_rate);
        
        this.equipment.Cost_of_Facilities_Capital_Ownership_cost_Monthly = this.equipment.Cost_of_Capital_rate * this.equipment.Original_price / 12 / this.equipment.Usage_rate;
        
        this.equipment.Overhead_Ownership_cost_Monthly = this.equipment.Annual_Overhead_rate * this.equipment.Current_Market_Year_Resale_Value / 12 / this.equipment.Usage_rate;
        
        this.equipment.Overhaul_Labor_Ownership_cost_Monthly = this.equipment.Hourly_Wage * this.equipment.Annual_Overhaul_Labor_Hours / 12 / this.equipment.Usage_rate;
        
        this.equipment.Overhaul_Parts_Ownership_cost_Monthly = this.equipment.Annual_Overhaul_Parts_cost_rate * this.equipment.Original_price / 12 / this.equipment.Usage_rate;
        
        //operating cost
        this.equipment.Total_ownership_cost_hourly = (this.equipment.Depreciation_Ownership_cost_Monthly + this.equipment.Cost_of_Facilities_Capital_Ownership_cost_Monthly + this.equipment.Overhead_Ownership_cost_Monthly + this.equipment.Overhaul_Labor_Ownership_cost_Monthly + this.equipment.Overhaul_Parts_Ownership_cost_Monthly) / 176;
        this.equipment.Field_Labor_Operating_cost_Hourly = this.equipment.Annual_Field_Labor_Hours*this.equipment.Hourly_Wage / 12 / this.equipment.Monthly_use_hours;
        this.equipment.Field_Parts_Operating_cost_Hourly = this.equipment.Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate * this.equipment.Original_price / 12 / this.equipment.Monthly_use_hours;
        this.equipment.Ground_Engaging_Component_Cost_Operating_cost_Hourly = this.equipment.Annual_Ground_Engaging_Component_rate * this.equipment.Original_price / 12 / this.equipment.Monthly_use_hours;
        this.equipment.Fuel_by_horse_power_Operating_cost_Hourly = (this.equipment['Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)']===1?0.04:this.equipment['Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)']===2?0.06:0) * this.equipment.Horse_power * this.equipment.Fuel_unit_price;
        this.equipment.Tire_Costs_Operating_cost_Hourly = this.equipment.Cost_of_A_New_Set_of_Tires / this.equipment.Tire_Life_Hours;
        this.equipment.Total_operating_cost = this.equipment.Field_Labor_Operating_cost_Hourly + this.equipment.Field_Parts_Operating_cost_Hourly + this.equipment.Ground_Engaging_Component_Cost_Operating_cost_Hourly + this.equipment.Lube_Operating_cost_Hourly + this.equipment.Fuel_by_horse_power_Operating_cost_Hourly + this.equipment.Tire_Costs_Operating_cost_Hourly;
        this.equipment.Total_cost_recovery = this.equipment.Total_ownership_cost_hourly + this.equipment.Total_operating_cost;
      
      }
      

     }
    
}

  onCalculateCostsClicked(btnType?: String) {

      if (btnType === 'calculate' && this.equipment) {
        this.router.navigate(['/calculator', { modelYear:this.ModelYear, unadjustedRate: this.equipment.Total_ownership_cost_hourly, operCost: this.equipment.Total_operating_cost, selectedItem: JSON.stringify(this.equipment) }]);
      }
    
  }
}
