import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizDashboard } from 'src/models/quiz-dashboard';
import { APIService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboardMdlLst: QuizDashboard[] = [];
  isLoading: boolean = false;

  constructor(
    private _apiSrv: APIService,
    private modalService: NgbModal,
    private _toastSrv: ToastService
  ) { }

  ngOnInit() {
    this.getDashboardData();
    this.initializeSignalR();
  }

  getDashboardData() {
    try {
      this.isLoading = true;
      this._apiSrv.get('Answer').subscribe((res) => {
        this.dashboardMdlLst = res as QuizDashboard[];
        this.isLoading = false;
      },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this._toastSrv.show(error.error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
        }
      );
    } catch (error) {
      console.log("error occured: ", error);
      this.isLoading = false;
    }
  }

  initializeSignalR() {
    let connection = this._apiSrv.signalRConnectionInitilization();

    connection.on('BroadcastMessage', (result) => {
      console.log("Signal RRR", result);
      if (result === "quizSubmitted") {
        this.getDashboardData();
      }
    });
  }
}
