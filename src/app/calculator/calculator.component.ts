import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import data from '../../assets/data/wheel_tractors.json';
import { Equipment } from '../board-admin/board-admin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculatorService } from '../calculator.service';
import { UserService } from '../_services/user.service';
interface Model {
  category: string;
  modelYear: string;
  size: string; 
  subcategory: string;
  fueltype: number;
}
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent {

  constructor(private route: ActivatedRoute,private calculatorService: CalculatorService, private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const unadjustedRateParam = params.get('unadjustedRate');
      const operCostparam = params.get('operCost');
      const selectItem = params.get('selectedItem');
      const modelYear = params.get('modelYear');
      
      if (unadjustedRateParam !== null && operCostparam !== null && selectItem && modelYear) {
        this.modelYear = +modelYear;
        this.selectedItem = JSON.parse(selectItem) as Equipment;
        this.unadjustedRate = +unadjustedRateParam * 176;
        this.operCost = +operCostparam;
        this.unadjustedRate = this.roundTo(this.unadjustedRate, 2);
        this.operCost = this.roundTo(this.operCost, 2);
        this.updateRate();
        this.updateStandByRate();
      }else if (params.get('tab') === 'savedmodels') {
        // Fetch the saved models if the "Saved Models" tab is clicked
        this.fetchSavedModels();
      }
    });
  }

  modelYear?: number;
  unadjustedRate:number = 0;;
  modelRate:number = 100;
  regionalRate:number = 100;
  rateUsed:number = 0;
  disabled = false;
  hours:number = 176;
  operCost:number = 0;
  operCostMultiplier:number = 0.5;
  enteredSearchValue: string = '';
  standByRate:number = 0;
  selectedItem?: Equipment;
  //items:Equipment[] = data;
  price:number = 0;
  salvage: number = 0;
  annualUseHrs:number = 0;
  useFulLife: number = 60;
  intRate: number = 0;
  operFactor: number = 0;
  operTimeFactor: number = 0;
  hp: number = 0;
  oilConsFactor:number = 0;
  maintFactor:number = 0;
  savedModels: Model[] = [];

  

  private roundTo = function(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  updateUnadjustedRate(event: any) {
    this.unadjustedRate = parseFloat(event.target.textContent);
    this.updateRate();
    this.updateStandByRate();
  }
  

  updateModelRate(event:any) {
    this.modelRate = event.target.innerText;
    this.updateRate();
    this.updateStandByRate();
  }

  updateRegionalRate(event:any) {
    this.regionalRate = event.target.innerText;    
    this.updateRate();
    this.updateStandByRate();
  }

  updateHours(event: any) {
    this.hours = parseFloat(event.target.textContent);
    this.updateRate();
    this.updateStandByRate();
  }
  
  updateOpCost(event: any) {
    this.operCost = parseFloat(event.target.textContent);
    this.updateRate();
    this.updateStandByRate();
  }

  updateOperCostMultiplier (event:any) {
    this.operCostMultiplier = event.target.innerText;
    this.updateStandByRate();
  }

  updateRate() {
    // console.log(this.unadjustedRate);
    // console.log(this.modelRate);
    // console.log(this.regionalRate);
    // console.log(this.operCost);
    this.rateUsed = Number((this.unadjustedRate * (this.modelRate/100) * (this.regionalRate/100))/this.hours + Number(this.operCost));
    this.rateUsed = Number(this.rateUsed.toFixed(2));
  }

  updateStandByRate() {
    this.standByRate = Number((this.unadjustedRate * (this.modelRate/100) * (this.regionalRate/100))/this.hours * Number(this.operCostMultiplier));
    this.standByRate = Number(this.standByRate.toFixed(2));
  }

  // getOverHead():number {
  //   return ((0.005*this.price*this.salvage)/this.annualUseHrs)
  // }

  // getOverHaulLabour():number {
  //   return ((0.06*this.price*0.18)/(0.0025*this.price))
  // }

  // getOverHaulParts(): number {
  //   return ((0.06*this.price)/this.annualUseHrs)
  // }

  // getFieldLabour(): number {
  //   return this.getOverHaulLabour()/0.8
  // }

  // calcOwnershipCost() {
  //   const cOwn = ((this.price-(this.salvage*this.price/this.useFulLife)*(this.intRate*Math.pow(1+this.intRate,this.useFulLife))/(Math.pow(1+this.intRate,this.useFulLife)-1)))/176;
  //   return (cOwn + this.getOverHaulLabour() + this.getOverHead() + this.getOverHaulParts())
  // }
  
  // getFuelCost(): number {
  //   const G = 0.04;
  //   return (this.operFactor*this.operTimeFactor*this.hp*G);
  // }

  // calculateCosts(item: any) {
  //   if (item) {
  //     this.selectedItem = item;
  //     this.unadjustedRate = item['price'];
  //     //this.calculatorService.emitSelectedItem(item);
  //     this.router.navigate(['/equipment-details'], { queryParams: { callMethod: 'true', item: JSON.stringify(item) } });
  //   }
  // }

  getFuelType(value: number): string {
    switch (value) {
      case 1:
        return 'diesel';
      case 2:
        return 'gas';
      case 3:
        return 'other';
      default:
        return '';
    }
  }

  saveModel(): void {
    const model = {
      category: this.selectedItem?.Category,
      subcategory: this.selectedItem?.Sub_Category,
      size: this.selectedItem?.Size,
      modelYear: this.modelYear,
      fueltype: this.selectedItem?.['Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)']
    };

    this.userService.saveModel(model).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchSavedModels() {
    this.userService.getSavedModels().subscribe(
      (response) => {
        console.log(response)
        this.savedModels = response.savedModels.map((modelString: string) => JSON.parse(modelString));
      },
      (error) => {
        console.error(error);
      }
    );
    
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.fetchSavedModels();
    }
  }
  // getOilLubCost(): number {
  //   return this.oilConsFactor*this.getFuelCost()
  // }

  // getMaintCost():number {
  //   return (this.maintFactor*this.price)/(this.useFulLife*176)
  // }
  // calcOperCost():number {
  //   const cOper = this.getFuelCost() + this.getOilLubCost() + this.getMaintCost();
  //   return cOper+this.getFieldLabour();
  // }

  // onSearchTextChanged() {
  //   console.log(this.enteredSearchValue);
  // }

}
