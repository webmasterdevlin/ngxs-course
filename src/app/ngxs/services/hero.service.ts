import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Hero } from "../../features/hero/hero.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class HeroService {
  path = environment.apiUrlBase + "heroes";

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.path);
  }

  deleteHeroById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }

  postHero(createdHero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.path, createdHero);
  }

  putHero(updatedHero: Hero): Observable<void> {
    return this.http.put<void>(`${this.path}/${updatedHero.id}`, updatedHero);
  }
}
