import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';
import { ToastService } from 'src/services/toast.service';
import { UserService } from 'src/services/user.service';

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
    public _userSrv: UserService
  ) {}

  ngOnInit() {
    if (this.userMdl.id <= 0) {
    }
  }

  saveUser() {
    try {
      if (this.userMdl.id > 0) {
        this.isProcessing = true;
        this._userSrv.Update(JSON.stringify(this.userMdl)).subscribe(
          (result: any) => {
            this._toastService.show(
              `Task ${this.userMdl.name} updated successfully`,
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
      } else {
        this.isProcessing = true;
        this._userSrv.create(JSON.stringify(this.userMdl)).subscribe(
          (result) => {
            this._toastService.show(
              `Task ${this.userMdl.name} created successfully`,
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
      }
    } catch (error) {}
  }
}
