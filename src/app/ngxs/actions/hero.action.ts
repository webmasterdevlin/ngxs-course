import { Hero } from "../../features/hero/hero.model";

export class GetHeroes {
  static readonly type = "[Hero] Get";
}

export class GetHeroById {
  static readonly type = "[Hero] GetById";
  constructor(public id: string) {}
}

export class AddHero {
  static readonly type = "[Hero] Add";
  constructor(public payload: Hero) {}
}

export class UpdateHero {
  static readonly type = "[Hero] Update";

  constructor(public payload: Hero) {}
}

export class DeleteHero {
  static readonly type = "[Hero] Delete";
  constructor(public id: string) {}
}
