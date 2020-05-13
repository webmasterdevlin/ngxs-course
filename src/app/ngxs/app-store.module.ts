import { NgModule } from "@angular/core";
import { HeroService } from "./services/hero.service";
import { HeroState } from "./states/hero.state";
import { VillainService } from "./services/villain.service";
import { VillainState } from "./states/villain.state";

@NgModule({
  imports: [],
  providers: [HeroService, HeroState, VillainService, VillainState],
})
export class AppStoreModule {}
