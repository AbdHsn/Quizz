import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';
import { APIService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit {
  userMdl: User = new User();
  isProcessing: boolean = false;
  title: string = '';

  constructor(
    public _activeModal: NgbActiveModal,
    public _toastService: ToastService,
    public _apiSrv: APIService
  ) { }

  ngOnInit() {
    if (this.userMdl.id <= 0) {
      this.userMdl.type = '';
    }
  }

  save() {
    try {
      this.isProcessing = true;
      this._apiSrv.create('User', JSON.stringify(this.userMdl)).subscribe(
        (result) => {
          this._toastService.show(
            `User ${this.userMdl.name} created successfully`,
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
