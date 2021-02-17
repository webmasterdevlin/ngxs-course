import { TestBed } from "@angular/core/testing";
import { NgxsModule, State, Store } from "@ngxs/store";
import { HeroState, HeroStateModel } from "./hero.state";
import { HeroService } from "../services/hero.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetHeroesAction, SoftDeleteHeroAction } from "../actions/hero.action";

/*
you can use jest here to create MockStateContext like so:

export class MockStateContext {
  getState = jest.fn();
  patchState = jest.fn();
  setState = jest.fn();
  dispatch = jest.fn();
}

but we will just make this simple
*/

@Injectable()
@State<HeroStateModel>({
  name: "TestHeroState",
  defaults: {
    heroes: [
      {
        id: "a1",
        firstName: "Peter",
        lastName: "Parker",
        house: "Marvel",
        knownAs: "Spider-man",
      },
      {
        id: "a2",
        firstName: "Miles",
        lastName: "Morales",
        house: "Marvel",
        knownAs: "New Spider-man",
      },
    ],
    isLoading: false,
  },
})
export class TestHeroState extends HeroState {}

describe("Hero State", () => {
  let store: Store;
  const initialState: HeroStateModel = {
    heroes: [],
    isLoading: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([HeroState, TestHeroState])],
      providers: [HeroService, HttpClient, HttpHandler, TestHeroState],
    });

    store = TestBed.inject(Store);
  });

  describe("Hero Selectors", () => {
    it("it should select getHeroList", () => {
      const heroes = store.selectSnapshot(HeroState.getHeroList);

      expect(heroes.length).toEqual(0);
    });

    it("it should select getIsLoading", () => {
      const isLoading = store.selectSnapshot(HeroState.getIsLoading);

      expect(isLoading).toEqual(false);
    });
  });

  describe("Hero Actions", async () => {
    it("it should select getHeroes", async () => {
      await store.dispatch(new GetHeroesAction()).toPromise();
      const heroState = store.selectSnapshot(HeroState);

      expect(heroState).toEqual(initialState);
      expect(heroState.isLoading).toEqual(false);
      expect(heroState.heroes.length).toEqual(0);
    });

    it("it should select softDeleteHero and delete a hero", () => {
      store.dispatch(new SoftDeleteHeroAction("a1"));
      const testHeroState = store.selectSnapshot(TestHeroState);

      expect(testHeroState.heroes.length).toEqual(1);
      expect(testHeroState.heroes[0].firstName).toEqual("Miles");
    });
  });
});
