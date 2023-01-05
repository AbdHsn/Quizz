import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/services/toast.service';
import { APIService } from 'src/services/api.service';
import { DeleteDialogComponent } from '../../common-pages/delete-dialog/delete-dialog.component';
import { QuestionAddEditComponent } from '../question-add-edit/question-add-edit.component';
import { Questions } from 'src/models/questions';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  questionsMdlLst: Questions[] = [];
  isLoading: boolean = false;

  constructor(
    private _apiSrv: APIService,
    private modalService: NgbModal,
    private _toastSrv: ToastService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    try {
      this.isLoading = true;
      this._apiSrv.get("Question").subscribe((res) => {
        this.questionsMdlLst = res as Questions[];
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
      this.isLoading = false;
    }
  }

  onCreateUser() {
    const modalRef = this.modalService.open(QuestionAddEditComponent);
    modalRef.componentInstance.title = 'Create Questions';
    modalRef.componentInstance.taskMdl = {};
    modalRef.result.then(
      (result) => {
        this.getQuestions();
      },
      (reason) => { }
    );
  }

  onDeleteClick(item: Questions) {
    try {
      const modalRef = this.modalService.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `Questions "${item.question}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._apiSrv.Delete("Question", item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(`${item.question} successfully deleted.`, {
                  classname: 'bg-success text-light',
                  delay: 10000,
                });
                this.getQuestions();
              }
            },
            (error: HttpErrorResponse) => {
              this._toastSrv.show(error.error, {
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            }
          );
        }
      });
    } catch (error) { }
  }
}
