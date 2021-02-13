import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Villain } from "../../features/villain/villain.model";
import { VillainService } from "../services/villain.service";
import {
  AddVillainAction,
  DeleteVillainAction,
  GetVillainsAction,
  SoftDeleteVillainAction,
  UpdateVillainAction,
} from "../actions/villain.action";

export class VillainStateModel {
  villains: Villain[];
  isLoading: boolean;
  error: string;
}

@Injectable()
@State<VillainStateModel>({
  name: "villains",
  defaults: {
    villains: [],
    isLoading: false,
    error: "",
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

  @Selector()
  static getError(state: VillainStateModel) {
    return state.error;
  }

  @Action(GetVillainsAction)
  getVillains({
    getState,
    setState,
    patchState,
  }: StateContext<VillainStateModel>) {
    patchState({ isLoading: true });
    return this.villainService.getVillains().pipe(
      tap((response) => {
        patchState({
          villains: response,
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

  @Action(DeleteVillainAction)
  deleteVillain(
    { getState, setState, patchState }: StateContext<VillainStateModel>,
    { id }: DeleteVillainAction
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().villains.filter((h) => h.id !== id);
    patchState({
      villains: filteredArray,
    });
    return this.villainService.deleteVillain(id).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          villains: previousState.villains,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(AddVillainAction)
  addVillain(
    { getState, patchState }: StateContext<VillainStateModel>,
    { payload }: AddVillainAction
  ) {
    patchState({ isLoading: true });
    return this.villainService.postVillain(payload).pipe(
      tap((response) => {
        patchState({
          villains: [...getState().villains, response],
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

  @Action(UpdateVillainAction)
  updateVillain(
    { getState, setState, patchState }: StateContext<VillainStateModel>,
    { payload }: UpdateVillainAction
  ) {
    // Optimistic update
    const previousState = getState();
    const villains = [...getState().villains];
    const index = villains.findIndex((item) => item.id === payload.id);
    villains[index] = payload;
    patchState({ villains });
    return this.villainService.putVillain(payload).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          villains: previousState.villains,
          error: err.statusText,
        });
        return throwError(err.message);
      })
    );
  }

  @Action(SoftDeleteVillainAction)
  softDeleteHero(
    { getState, setState, patchState }: StateContext<VillainStateModel>,
    { id }: SoftDeleteVillainAction
  ) {
    patchState({
      villains: getState().villains.filter((v) => v.id !== id),
    });
  }
}
