import { Injectable } from "@angular/core";
import { Villain } from "src/app/features/villain/villain.model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import {
  AddVillainAction,
  DeleteVillainAction,
  GetVillainsAction,
  SoftDeleteVillainAction,
  UpdateVillainAction,
} from "../actions/villain.action";
import { tap, catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import { VillainService } from "../services/villain.service";

export class VillainStateModel {
  villains: Villain[];
  isLoading: boolean;
}

@Injectable()
@State<VillainStateModel>({
  name: "villains",
  defaults: {
    villains: [],
    isLoading: false,
  },
})
export class VillainState {
  constructor(private villainService: VillainService) {}

  @Selector()
  static getVillainList(state: VillainStateModel) {
    return state.villains;
  }

  @Selector()
  static getIsLoading(state: VillainStateModel) {
    return state.isLoading;
  }

  @Action(GetVillainsAction)
  getVillains({ patchState }: StateContext<VillainStateModel>) {
    patchState({ isLoading: true });
    return this.villainService.getVillains().pipe(
      tap((response) => patchState({ villains: response })),
      catchError((error) => of([])),
      finalize(() => patchState({ isLoading: false }))
    );
  }

  @Action(DeleteVillainAction)
  deleteVillain(
    { getState, patchState }: StateContext<VillainStateModel>,
    { id }: DeleteVillainAction
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().villains.filter((h) => h.id !== id);
    patchState({
      villains: filteredArray,
    });
    return this.villainService.deleteVillain(id).pipe(
      catchError((error) => {
        patchState({
          villains: previousState.villains,
        });
        return of([]);
      })
    );
  }

  @Action(AddVillainAction)
  addVillain(
    { getState, patchState }: StateContext<VillainStateModel>,
    { payload }: AddVillainAction
  ) {
    // Pessimistic update
    patchState({ isLoading: true });
    return this.villainService.postVillain(payload).pipe(
      tap((response) =>
        patchState({
          villains: [...getState().villains, response],
        })
      ),
      catchError((error) => of([])),
      finalize(() => patchState({ isLoading: false }))
    );
  }

  @Action(UpdateVillainAction)
  updateVillain(
    { getState, patchState }: StateContext<VillainStateModel>,
    { payload }: UpdateVillainAction
  ) {
    // Optimistic update
    const previousState = getState();
    const villains = [...getState().villains];
    const index = villains.findIndex((item) => item.id === payload.id);
    villains[index] = payload;
    patchState({ villains });
    return this.villainService.putVillain(payload).pipe(
      catchError((error) => {
        patchState({
          villains: previousState.villains,
        });
        return of([]);
      })
    );
  }

  @Action(SoftDeleteVillainAction)
  softDeleteHero(
    { getState, patchState }: StateContext<VillainStateModel>,
    { id }: SoftDeleteVillainAction
  ) {
    patchState({
      villains: getState().villains.filter((v) => v.id !== id),
    });
  }
}
