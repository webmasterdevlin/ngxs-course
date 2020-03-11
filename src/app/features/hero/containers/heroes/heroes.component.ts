import { Component, OnDestroy, OnInit } from "@angular/core";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Hero } from "../../hero.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import {
  AddHero,
  DeleteHero,
  GetHeroes,
  UpdateHero
} from "../../../../ngxs/actions/hero.action";
import { HeroState } from "../../../../ngxs/states/hero.state";
import { Observable } from "rxjs";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit, OnDestroy {
  itemForm: FormGroup;
  editedForm: FormGroup;
  error = "";
  isLoading = false;

  editingTracker = "0";

  @Select(HeroState.getHeroList)
  heroes: Observable<Hero[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.formBuilderInit();
    this.fetchHeroes();
  }

  // this is needed in untilDestroyed
  ngOnDestroy(): void {}

  fetchHeroes() {
    this.isLoading = true;
    this.store
      .dispatch(new GetHeroes())
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {},
        e => {
          this.isLoading = false;
          alert(e.statusText);
        },
        () => {
          this.isLoading = false;
          this.itemForm.reset();
        }
      );
  }

  removeHero(id: string) {
    this.store
      .dispatch(new DeleteHero(id))
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  onSave() {
    // stop here if form is invalid
    if (this.itemForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.store
      .dispatch(new AddHero(this.itemForm.value))
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {},
        e => {
          this.isLoading = false;
          alert(e.statusText);
        },
        () => {
          this.isLoading = false;
          this.itemForm.reset();
        }
      );
  }

  onUpdate() {
    // stop here if form is invalid
    if (this.editedForm.invalid) {
      return;
    }

    this.store
      .dispatch(new UpdateHero(this.editedForm.value))
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  goToHeroDetail(id: string) {
    this.router.navigateByUrl("/heroes/hero-detail/" + id);
  }

  private formBuilderInit(): void {
    this.itemForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""]
    });

    this.editedForm = this.fb.group({
      id: [""],
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""]
    });
  }
}
