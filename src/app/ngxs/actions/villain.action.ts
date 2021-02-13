import { Villain } from "../../features/villain/villain.model";

export class GetVillains {
  static readonly type = "[Villain] Get";
}

export class DeleteVillain {
  static readonly type = "[Villain] Delete";
  constructor(public id: string) {}
}

export class AddVillain {
  static readonly type = "[Villain] Add";
  constructor(public payload: Villain) {}
}

export class UpdateVillain {
  static readonly type = "[Villain] Update";

  constructor(public payload: Villain) {}
}
