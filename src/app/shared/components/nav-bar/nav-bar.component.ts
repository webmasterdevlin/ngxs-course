import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { HeroState } from "src/app/ngxs/states/hero.state";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { GetHeroesAction } from "src/app/ngxs/actions/hero.action";
import { VillainState } from "src/app/ngxs/states/villain.state";
import { GetVillainsAction } from "src/app/ngxs/actions/villain.action";

@UntilDestroy()
@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  totalHeroes = 0;
  totalVillains = 0;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.observableConverters();
  }

  handleLoadCharacters() {
    this.store.dispatch(new GetHeroesAction());
    this.store.dispatch(new GetVillainsAction());
  }

  private observableConverters(): void {
    this.store
      .select(HeroState.getHeroList)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.totalHeroes = data.length));

    this.store
      .select(VillainState.getVillainList)
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.totalVillains = data.length));
  }
}
