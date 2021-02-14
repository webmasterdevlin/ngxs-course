import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { VillainState } from "src/app/ngxs/states/villain.state";
import {
  GetVillainsAction,
  DeleteVillainAction,
  AddVillainAction,
  UpdateVillainAction,
  SoftDeleteVillainAction,
} from "src/app/ngxs/actions/villain.action";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Villain } from "../../villain.model";

@UntilDestroy()
@Component({
  selector: "app-villains",
  templateUrl: "./villains.component.html",
  styleUrls: ["./villains.component.css"],
})
export class VillainsComponent implements OnInit {
  itemForm: FormGroup;
  editedForm: FormGroup;
  villains: Villain[];
  isLoading = false;
  editingTracker = "0";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.fetchVillains();
    this.observableConverters();
    this.formBuilderInit();
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

  handleSoftDeleteVillain(id: string) {
    this.store.dispatch(new SoftDeleteVillainAction(id));
  }

  handleNavigateVillainDetail(id: string) {
    this.router.navigateByUrl("/villains/villain-detail/" + id);
  }

  private fetchVillains() {
    this.store.dispatch(new GetVillainsAction());
  }

  private observableConverters(): void {
    this.store
      .select(VillainState.getVillainList)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.villains = data));
    this.store
      .select(VillainState.getIsLoading)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.isLoading = data));
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
}
