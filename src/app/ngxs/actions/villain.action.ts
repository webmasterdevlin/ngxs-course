import { Villain } from "src/app/features/villain/villain.model";

export class GetVillainsAction {
  static readonly type = "[Villain] Get";
}

export class DeleteVillainAction {
  static readonly type = "[Villain] Delete";
  constructor(public id: string) {}
}

export class AddVillainAction {
  static readonly type = "[Villain] Add";
  constructor(public payload: Villain) {}
}

export class UpdateVillainAction {
  static readonly type = "[Villain] Update";

  constructor(public payload: Villain) {}
}

export class SoftDeleteVillainAction {
  static readonly type = "[Villain] SoftDelete";
  constructor(public id: string) {}
}
