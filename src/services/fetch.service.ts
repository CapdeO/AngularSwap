import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  API_URL: string = 'https://beathard-backend.fly.dev/tokenPrice'

  constructor(private http: HttpClient) {

  }

  fetchPrices(addressOne: string, addressTwo: string):Observable<any> {

    let params = new HttpParams()
      .set('addressOne', addressOne)
      .set('addressTwo', addressTwo)

      return this.http.get<any>(this.API_URL, { params: params });
  }

}
