import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { VillainState } from "src/app/ngxs/states/villain.state";
import {
  GetVillainsAction,
  DeleteVillainAction,
  AddVillainAction,
  UpdateVillainAction,
} from "src/app/ngxs/actions/villain.action";

@Component({
  selector: "app-villains",
  templateUrl: "./villains.component.html",
  styleUrls: ["./villains.component.css"],
})
export class VillainsComponent implements OnInit, OnDestroy {
  itemForm: FormGroup;
  editedForm: FormGroup;
  villains: any;
  error = "";
  isLoading = false;
  editingTracker = "0";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.formBuilderInit();
    this.fetchVillains();
    this.observableConverters();
  }

  // this is needed in untilDestroyed
  ngOnDestroy(): void {}

  fetchVillains() {
    this.store.dispatch(new GetVillainsAction());
  }

  handleDeleteVillain(id: string) {
    this.store.dispatch(new DeleteVillainAction(id));
  }

  handleAddVillain() {
    this.store.dispatch(new AddVillainAction(this.itemForm.value));
  }

  handleUpdateVillain() {
    this.store.dispatch(new UpdateVillainAction(this.editedForm.value));
  }

  handleNavigateVillainDetail(id: string) {
    this.router.navigateByUrl("/villains/villain-detail/" + id);
  }

  private formBuilderInit(): void {
    this.itemForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""],
    });

    this.editedForm = this.fb.group({
      id: [""],
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""],
    });
  }

  private observableConverters(): void {
    this.store
      .select(VillainState.getVillainList)
      .subscribe((data) => (this.villains = data));
    this.store
      .select(VillainState.getIsLoading)
      .subscribe((data) => (this.isLoading = data));
  }
}
