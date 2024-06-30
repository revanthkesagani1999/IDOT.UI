import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../board-admin/board-admin.component';

//const API_URL = 'http://localhost:8082/api/test/';
const API_URL = 'https://idot-backend.vercel.app/api/test/';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  saveModel(model: any): Observable<any> {
    return this.http.post(API_URL + 'savemodel', model);
  }

  getSavedModels(): Observable<any> {
    return this.http.get(API_URL + 'savedmodels');
  }

  getAllModelData(): Observable<any> {
    return this.http.get(API_URL + 'allmodeldata');
  }

  getAllModelYears(): Observable<any> {
    return this.http.get(API_URL + 'years');
  }

  getAllContractors(): Observable<any> {
    return this.http.get(API_URL + 'contractors');
  }

  getModelDataByYear(year: string): Observable<any> {
    return this.http.get(API_URL + `model-data/${year}`);
  }

  getModelDataByContractor(contractor: string): Observable<any> {
    return this.http.get(API_URL + `contractor-data/${contractor}`);
  }

  editEquipment(equipment: any, year: string, contractor: string | null = null): Observable<any> {
    const body = {
      equipment,
      year,
      contractor
    };
    return this.http.put(API_URL + 'editEquipment', body);
  }

  generateNextYearEquipData(priceIncreaseRate: number, dataUpdate: boolean): Observable<any> {
    return this.http.post(API_URL + 'generate-data', {priceIncreaseRate,dataUpdate});
  }

  getFuelCosts(): Observable<any> {
    return this.http.get(API_URL + 'fuelcosts');
  }

  editFuelCosts(fuelCosts: any): Observable<any> {
    return this.http.put(API_URL + 'editfuelcosts', fuelCosts);
  }

  getHourlyWage(): Observable<any> {
    return this.http.get(API_URL + 'hrlabourwage');
  }

  editHourlyWage(labourWage: any): Observable<any> {
    return this.http.put(API_URL + 'edithrlabourwage', labourWage);
  }

  getCurrentYear(): Observable<any> {
    return this.http.get(API_URL + 'currentyear');
  }

  getDefaultEquipment() {
    const DEFAULT_EQUIPMENT: Equipment = {
      Category: '',
      Sub_Category: '',
      Size: '',
      "Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)": 0,
      Fuel_unit_price: 0,
      Original_price: 0,
      Sales_Tax: 0,
      Discount: 0,
      Salvage_Value: 0,
      Current_Market_Year_Resale_Value: 0,
      Annual_Overhaul_Labor_Hours: 0,
      Annual_Field_Labor_Hours: 0,
      Cost_of_A_New_Set_of_Tires: 0,
      Tire_Life_Hours: 0,
      Hourly_Lube_Costs: 0,
      Hourly_Wage: 0,
      "Model Year": 0,
      "Adjustment for fuel cost": 1,
      Horse_power: 0,
      Economic_Life_in_months: 0,
      Monthly_use_hours: 0,
      Usage_rate: 0,
      Initial_Freight_cost: 0,
      Annual_Overhead_rate: 0,
      Annual_Overhaul_Parts_cost_rate: 0,
      Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate: 0,
      Annual_Ground_Engaging_Component_rate: 0,
      Cost_of_Capital_rate: 0,
      Depreciation_Ownership_cost_Monthly: 0,
      Cost_of_Facilities_Capital_Ownership_cost_Monthly: 0,
      Overhead_Ownership_cost_Monthly: 0,
      Overhaul_Labor_Ownership_cost_Monthly: 0,
      Overhaul_Parts_Ownership_cost_Monthly: 0,
      Total_ownership_cost_hourly: 0,
      Field_Labor_Operating_cost_Hourly: 0,
      Field_Parts_Operating_cost_Hourly: 0,
      Ground_Engaging_Component_Cost_Operating_cost_Hourly: 0,
      Lube_Operating_cost_Hourly: 0,
      Fuel_by_horse_power_Operating_cost_Hourly: 0,
      Tire_Costs_Operating_cost_Hourly: 0,
      Total_operating_cost: 0,
      Total_cost_recovery: 0
    };
    return DEFAULT_EQUIPMENT;
  }

  addEquipment(equipment: Equipment, modelYear: string, contractor: string | null = null): Observable<any> {
    const body = {
      equipment,
      modelYear,
      contractor
    };
    return this.http.post(API_URL + 'addequipment', body);
  }
}
