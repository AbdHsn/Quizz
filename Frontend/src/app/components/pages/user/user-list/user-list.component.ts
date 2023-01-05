import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';
import { ToastService } from 'src/services/toast.service';
import { APIService } from 'src/services/api.service';
import { DeleteDialogComponent } from '../../common-pages/delete-dialog/delete-dialog.component';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userMdlLst: User[] = [];
  isLoading: boolean = false;

  constructor(
    private _apiSrv: APIService,
    private modalService: NgbModal,
    private _toastSrv: ToastService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    try {
      console.log('getUsers called');
      this.isLoading = true;
      this._apiSrv.get('User').subscribe((res) => {
        this.userMdlLst = res as User[];
        console.log('getUsers called', res, this.userMdlLst);
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

  onCreateUser() {
    const modalRef = this.modalService.open(UserAddEditComponent);
    modalRef.componentInstance.title = 'Create User';
    modalRef.componentInstance.taskMdl = {};
    modalRef.result.then(
      (result) => {
        this.getUsers();
      },
      (reason) => { }
    );
  }

  onDeleteClick(item: User) {
    try {
      const modalRef = this.modalService.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `User "${item.name}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._apiSrv.Delete('User', item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(`${item.name} successfully deleted.`, {
                  classname: 'bg-success text-light',
                  delay: 10000,
                });
                this.getUsers();
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
