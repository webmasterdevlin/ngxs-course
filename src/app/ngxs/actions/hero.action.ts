import { Hero } from "src/app/features/hero/hero.model";

export class GetHeroesAction {
  static readonly type = "[Hero] Get";
}

export class DeleteHeroAction {
  static readonly type = "[Hero] Delete";
  constructor(public id: string) {}
}

export class AddHeroAction {
  static readonly type = "[Hero] Add";
  constructor(public payload: Hero) {}
}

export class UpdateHeroAction {
  static readonly type = "[Hero] Update";
  constructor(public payload: Hero) {}
}

export class SoftDeleteHeroAction {
  static readonly type = "[Hero] SoftDelete";
  constructor(public id: string) {}
}
