import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { APIService } from 'src/services/api.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  userMdl: User = new User();
  constructor(private _apiSrv: APIService, private route: Router) { }

  ngOnInit() {
  }

  login() {
    this._apiSrv.get(`User/GetByUserName?userName=${this.userMdl?.user_name}`).subscribe(res => {
      if (res) {
        this.userMdl = res as User;
        if (this.userMdl.type == "admin") {
          this.route.navigate(["/pages/admin-dashboard"]);
        }
        if (this.userMdl.type == "participant") {
          this.route.navigate(["/pages/quiz-list"]);
        }
      } else {
        alert("User is not found.")
      }
    });
  }

}
