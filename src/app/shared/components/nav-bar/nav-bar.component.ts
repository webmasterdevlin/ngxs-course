import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { HeroState } from 'src/app/ngxs/states/hero.state';
import { VillainState } from 'src/app/ngxs/states/villain.state';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  totalHeroes = 0;
  totalVillains = 0;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.observableConverters();
  }
  private observableConverters(): void {
    this.store
      .select(HeroState.getHeroList)
      .subscribe((data) => (this.totalHeroes = data.length));

    this.store
      .select(VillainState.getVillainList)
      .subscribe((data) => (this.totalVillains = data.length));
  }
}
