import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { HeroState } from "src/app/ngxs/states/hero.state";
import {
  GetHeroesAction,
  DeleteHeroAction,
  AddHeroAction,
  UpdateHeroAction,
  SoftDeleteHeroAction,
} from "src/app/ngxs/actions/hero.action";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"],
})
export class HeroesComponent implements OnInit {
  itemForm: FormGroup;
  editedForm: FormGroup;
  heroes: any;
  isLoading = false;
  editingTracker = "0";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.formBuilderInit();
    this.fetchHeroes();
    this.observableConverters();
  }

  fetchHeroes() {
    this.store.dispatch(new GetHeroesAction());
  }

  handleDeleteHero(id: string) {
    this.store.dispatch(new DeleteHeroAction(id));
  }

  handleAddHero() {
    this.store.dispatch(new AddHeroAction(this.itemForm.value));
  }

  handleUpdateHero() {
    this.store.dispatch(new UpdateHeroAction(this.editedForm.value));
  }

  handleSoftDeleteHero(id: string) {
    this.store.dispatch(new SoftDeleteHeroAction(id));
  }

  handleNavigateHeroDetail(id: string) {
    this.router.navigateByUrl("/heroes/hero-detail/" + id);
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
      .select(HeroState.getHeroList)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.heroes = data));
    this.store
      .select(HeroState.getIsLoading)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.isLoading = data));
  }
}
