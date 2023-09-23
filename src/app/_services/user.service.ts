import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8082/api/test/';

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

  getModelDataByYear(year: string): Observable<any> {
    return this.http.get(API_URL + `model-data/${year}`);
  }

  editEquipment(equipment: any, year: string): Observable<any> {
    const body = {
      equipment,
      year
    };
    return this.http.put(API_URL + 'editEquipment', body);
  }

  generateNextYearEquipData(priceIncreaseRate: number): Observable<any> {
    return this.http.post(API_URL + 'generate-data', {priceIncreaseRate});
  }

  getFuelCosts(): Observable<any> {
    return this.http.get(API_URL + 'fuelcosts');
  }

  editFuelCosts(fuelCosts: any): Observable<any> {
    return this.http.put(API_URL + 'editfuelcosts', fuelCosts);
  }
}
