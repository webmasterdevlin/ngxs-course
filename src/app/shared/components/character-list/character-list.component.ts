import { Component, OnInit } from "@angular/core";
import { Hero } from "src/app/features/hero/hero.model";
import { Villain } from "src/app/features/villain/villain.model";
import { Store } from "@ngxs/store";
import { HeroState } from "src/app/ngxs/states/hero.state";
import { VillainState } from "src/app/ngxs/states/villain.state";

@Component({
  selector: "app-character-list",
  templateUrl: "./character-list.component.html",
  styleUrls: ["./character-list.component.css"],
})
export class CharacterListComponent implements OnInit {
  heroes: Hero[];
  villains: Villain[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.observableConverters();
  }

  private observableConverters(): void {
    this.store
      .select(HeroState.getHeroList)
      .subscribe((data) => (this.heroes = data));
    this.store
      .select(VillainState.getVillainList)
      .subscribe((data) => (this.villains = data));
  }
}
