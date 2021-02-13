import { Component, OnDestroy } from "@angular/core";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Hero } from "src/app/features/hero/hero.model";
import { Villain } from "src/app/features/villain/villain.model";
import { Store } from "@ngxs/store";
import { GetHeroes } from "src/app/ngxs/actions/hero.action";
import { GetVillains } from "src/app/ngxs/actions/villain.action";
import { HeroState } from "src/app/ngxs/states/hero.state";
import { VillainState } from "src/app/ngxs/states/villain.state";

@Component({
  selector: "app-character-list",
  templateUrl: "./character-list.component.html",
  styleUrls: ["./character-list.component.css"],
})
export class CharacterListComponent implements OnDestroy {
  heroes: Hero[];
  villains: Villain[];

  constructor(private store: Store) {
    this.fetchHeroes();
    this.fetchVillains();
    this.observableConverters();
  }

  fetchHeroes() {
    this.store.dispatch(new GetHeroes());
  }

  fetchVillains() {
    this.store.dispatch(new GetVillains());
  }

  // this is needed in untilDestroyed
  ngOnDestroy(): void {}

  private observableConverters(): void {
    this.store
      .select(HeroState.getHeroList)
      .subscribe((data) => (this.heroes = data));
    this.store
      .select(VillainState.getVillainList)
      .subscribe((data) => (this.villains = data));
  }
}
