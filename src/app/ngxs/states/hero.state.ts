import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { Hero } from "src/app/features/hero/hero.model";
import {
  GetHeroesAction,
  DeleteHeroAction,
  AddHeroAction,
  UpdateHeroAction,
  SoftDeleteHeroAction,
} from "../actions/hero.action";
import { tap, catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import { HeroService } from "../services/hero.service";

export class HeroStateModel {
  heroes: Hero[];
  isLoading: boolean;
}

@Injectable()
@State<HeroStateModel>({
  name: "heroes",
  defaults: {
    heroes: [],
    isLoading: false,
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

  @Action(GetHeroesAction)
  getHeroes({ patchState }: StateContext<HeroStateModel>) {
    patchState({ isLoading: true });
    return this.heroService.getHeroes().pipe(
      tap((response) => patchState({ heroes: response })),
      catchError((error) => of([])),
      finalize(() => patchState({ isLoading: false }))
    );
  }

  @Action(DeleteHeroAction)
  deleteHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { id }: DeleteHeroAction
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().heroes.filter((h) => h.id !== id);
    patchState({
      heroes: filteredArray,
    });
    return this.heroService.deleteHero(id).pipe(
      catchError((error) => {
        patchState({
          heroes: previousState.heroes,
        });
        return of([]);
      })
    );
  }

  @Action(AddHeroAction)
  addHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { payload }: AddHeroAction
  ) {
    // Pessimistic update
    patchState({ isLoading: true });
    return this.heroService.postHero(payload).pipe(
      tap((response) =>
        patchState({ heroes: [...getState().heroes, response] })
      ),
      catchError((error) => of([])),
      finalize(() => patchState({ isLoading: false }))
    );
  }

  @Action(UpdateHeroAction)
  updateHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { payload }: UpdateHeroAction
  ) {
    // Optimistic update
    const previousState = getState();
    const heroes = [...getState().heroes];
    const index = heroes.findIndex((item) => item.id === payload.id);
    heroes[index] = payload;
    patchState({ heroes });
    return this.heroService.putHero(payload).pipe(
      catchError((error) => {
        patchState({
          heroes: previousState.heroes,
        });
        return of([]);
      })
    );
  }

  @Action(SoftDeleteHeroAction)
  softDeleteHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { id }: DeleteHeroAction
  ) {
    patchState({
      heroes: getState().heroes.filter((h) => h.id !== id),
    });
  }
}
