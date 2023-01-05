import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';
import { APIService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import { Options, Questions } from './../../../../../models/questions';

@Component({
  selector: 'app-question-add-edit',
  templateUrl: './question-add-edit.component.html',
  styleUrls: ['./question-add-edit.component.scss'],
})
export class QuestionAddEditComponent implements OnInit {
  questionsMdl: Questions = new Questions();
  optionsMdlLst: Options[] = [{ option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false },];
  isProcessing: boolean = false;
  title: string = '';

  constructor(
    public _activeModal: NgbActiveModal,
    public _toastService: ToastService,
    public _apiSrv: APIService
  ) { }

  ngOnInit() {
    if (this.questionsMdl?.id <= 0) {
      this.questionsMdl.topic = "";
    }
  }

  save() {
    try {
      this.isProcessing = true;
      this.questionsMdl.options = this.optionsMdlLst.map((m) => m.option ?? m.option).join(",");

      this._apiSrv.create("Question", JSON.stringify(this.questionsMdl)).subscribe(
        (result) => {
          this._toastService.show(
            `${this.questionsMdl.question} created successfully`,
            {
              classname: 'bg-success text-light',
              delay: 10000,
            }
          );
          this.isProcessing = false;
          this._activeModal.close(true);
        },
        (error: HttpErrorResponse) => {
          this.isProcessing = false;
          this._toastService.show(error.error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
        }
      );

    } catch (error) { }
  }
}
