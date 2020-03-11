import { NgModule } from "@angular/core";
import { HeroService } from "./services/hero.service";
import { HeroState } from "./states/hero.state";

@NgModule({
  imports: [],
  providers: [HeroService, HeroState]
})
export class AppStoreModule {}
