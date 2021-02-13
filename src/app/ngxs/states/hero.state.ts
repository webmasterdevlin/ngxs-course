import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { HeroService } from "../services/hero.service";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Hero } from "../../features/hero/hero.model";
import {
  GetHeroesAction,
  DeleteHeroAction,
  AddHeroAction,
  UpdateHeroAction,
  SoftDeleteHeroAction,
} from "../actions/hero.action";

export class HeroStateModel {
  heroes: Hero[];
  isLoading: boolean;
  error: string;
}

@Injectable()
@State<HeroStateModel>({
  name: "heroes",
  defaults: {
    heroes: [],
    isLoading: false,
    error: "",
  },
})
export class HeroState {
  constructor(private heroService: HeroService) {}

  @Selector()
  static getHeroList(state: HeroStateModel) {
    return state.heroes;
  }

  @Selector()
  static getIsLoading(state: HeroStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getError(state: HeroStateModel) {
    return state.error;
  }

  @Action(GetHeroesAction)
  getHeroes({ getState, setState, patchState }: StateContext<HeroStateModel>) {
    patchState({ isLoading: true });
    return this.heroService.getHeroes().pipe(
      tap((response) => {
        patchState({
          heroes: response,
          isLoading: false,
        });
      }),
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          isLoading: false,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(DeleteHeroAction)
  deleteHero(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { id }: DeleteHeroAction
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().heroes.filter((h) => h.id !== id);
    patchState({
      heroes: filteredArray,
    });
    return this.heroService.deleteHero(id).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          heroes: previousState.heroes,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(AddHeroAction)
  addHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { payload }: AddHeroAction
  ) {
    patchState({ isLoading: true });
    return this.heroService.postHero(payload).pipe(
      tap((response) => {
        patchState({
          heroes: [...getState().heroes, response],
          isLoading: false,
        });
      }),
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          isLoading: false,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(UpdateHeroAction)
  updateHero(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { payload }: UpdateHeroAction
  ) {
    // Optimistic update
    const previousState = getState();
    const heroes = [...getState().heroes];
    const index = heroes.findIndex((item) => item.id === payload.id);
    heroes[index] = payload;
    patchState({ heroes });
    return this.heroService.putHero(payload).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          heroes: previousState.heroes,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(SoftDeleteHeroAction)
  softDeleteHero(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { id }: DeleteHeroAction
  ) {
    patchState({
      heroes: getState().heroes.filter((h) => h.id !== id),
    });
  }
}
