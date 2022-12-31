import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';
import { ToastService } from 'src/services/toast.service';
import { UserService } from 'src/services/user.service';
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
    private _userSrv: UserService,
    private modalService: NgbModal,
    private _toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    try {
      console.log('getUsers called');
      this.isLoading = true;
      this._userSrv.get().subscribe(
        (res) => {
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
      this.isLoading = false;
    }
  }

  onCreateTaskClick() {
    const modalRef = this.modalService.open(UserAddEditComponent);
    modalRef.componentInstance.title = 'Create Task';
    modalRef.componentInstance.taskMdl = {};
    modalRef.result.then(
      (result) => {
        //this.getTaskGrid();
      },
      (reason) => {}
    );
  }

  onEditClick(item: User) {
    const modalRef = this.modalService.open(UserAddEditComponent);
    modalRef.componentInstance.title = 'Update Task';

    modalRef.componentInstance.taskMdl = Object.assign({}, item);
    modalRef.result.then(
      (result) => {
        // this.getTaskGrid();
      },
      (reason) => {}
    );
  }

  onDeleteClick(item: User) {
    try {
      const modalRef = this.modalService.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `Task "${item.name}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._userSrv.Delete(item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(`${item.name} successfully deleted.`, {
                  classname: 'bg-success text-light',
                  delay: 10000,
                });
                //this.getTaskGrid();
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
    } catch (error) {}
  }
}
