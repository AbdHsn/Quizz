import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddEditComponent } from './user/user-add-edit/user-add-edit.component';
import { QuestionAddEditComponent } from './question/question-add-edit/question-add-edit.component';
import { QuestionListComponent } from './question/question-list/question-list.component';
import { QuizListComponent } from './quiz/quiz-list/quiz-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [PagesComponent, UserListComponent, UserAddEditComponent, QuestionAddEditComponent, QuestionListComponent, QuizListComponent, AdminDashboardComponent],
  providers: [],
})
export class PagesModule { }
