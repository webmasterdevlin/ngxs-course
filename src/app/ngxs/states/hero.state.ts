import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Hero } from "../../features/hero/hero.model";
import { HeroService } from "../services/hero.service";
import {
  AddHero,
  DeleteHero,
  GetHeroById,
  GetHeroes,
  UpdateHero
} from "../actions/hero.action";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";

export class HeroStateModel {
  heroes: Hero[];
  hero: Hero;
  error: string;
}

@Injectable()
@State<HeroStateModel>({
  name: "heroes",
  defaults: {
    heroes: [],
    hero: null,

    error: ""
  }
})
export class HeroState {
  constructor(private heroService: HeroService) {}

  @Selector()
  static getHeroList(state: HeroStateModel) {
    return state.heroes;
  }

  @Selector()
  static getSelectedHero(state: HeroStateModel) {
    return state.hero;
  }

  @Selector()
  static getError(state: HeroStateModel) {
    return state.error;
  }

  @Action(GetHeroes)
  fetchHeroes({ getState, setState }: StateContext<HeroStateModel>) {
    return this.heroService.getHeroes().pipe(
      tap(response => {
        setState({
          ...getState(),
          heroes: response
        });
      })
    );
  }

  @Action(DeleteHero)
  removeHero(
    { getState, setState }: StateContext<HeroStateModel>,
    { id }: DeleteHero
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().heroes.filter(h => h.id !== id);
    setState({
      ...getState(),
      heroes: filteredArray
    });
    return this.heroService.deleteHeroById(id).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        setState({
          ...getState(),
          heroes: previousState.heroes
        });
        return throwError(err.message);
      })
    );
  }

  @Action(AddHero)
  addHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { payload }: AddHero
  ) {
    return this.heroService.postHero(payload).pipe(
      tap(response => {
        patchState({
          heroes: [...getState().heroes, response]
        });
      })
    );
  }

  @Action(UpdateHero)
  updateHero(
    { getState, setState }: StateContext<HeroStateModel>,
    { payload }: UpdateHero
  ) {
    // Optimistic update
    const previousState = getState();
    const heroes = [...getState().heroes];
    const index = heroes.findIndex(item => item.id === payload.id);
    heroes[index] = payload;
    setState({
      ...getState(),
      heroes
    });
    return this.heroService.putHero(payload).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        setState({
          ...getState(),
          heroes: previousState.heroes
        });
        return throwError(err.message);
      })
    );
  }

  @Action(GetHeroById)
  fetchHeroById(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { id }: GetHeroById
  ) {
    return this.heroService.getHeroById(id).pipe(
      tap(response => {
        patchState({
          ...getState(),
          hero: response
        });
      })
    );
  }
}
