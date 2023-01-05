import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { QuestionListComponent } from './question/question-list/question-list.component';
import { QuizListComponent } from './quiz/quiz-list/quiz-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
  },
  { path: 'user-list', component: UserListComponent },
  { path: 'question-list', component: QuestionListComponent },
  { path: 'quiz-list', component: QuizListComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PagesRoutingModule { }
