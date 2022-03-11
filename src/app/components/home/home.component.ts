import { Component, OnDestroy, OnInit } from '@angular/core';
import { APIResponse, Game } from "../../models";
import { HttpService } from "../../services/http.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string = '';
  public loading: boolean = false
  public games: Array<Game> | undefined;
  private routeSub?: Subscription;
  private gameSub?: Subscription;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private activedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.routeSub = this.activedRoute.params.subscribe((params: Params) => {

      if (params['game-search']) {

        this.searchGames('metacrit', params['game-search']);

      } else {
        this.searchGames('metacrit');
      }
    })
  }

  searchGames(sort: string, search?: string): void {
    this.loading = true;
    this.gameSub = this.httpService
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        this.loading = false
        console.log(gameList)
      });
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe()
    }
  }
}
