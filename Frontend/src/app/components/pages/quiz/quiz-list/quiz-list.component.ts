import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/services/toast.service';
import { APIService } from 'src/services/api.service';
import { Questions } from 'src/models/questions';
import * as moment from "moment";
import { interval, Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../common-pages/confirm-dialog/confirm-dialog.component';
import * as uuid from 'uuid';
import { Answer, QuizSummary } from './../../../../../models/answer';
@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
})
export class QuizListComponent implements OnInit, AfterViewInit {
  activeQuizMdl: Questions = new Questions();
  quizSummaryMdl: QuizSummary = new QuizSummary();
  quizMdl: { questions: Questions[], total_questions: number, total_times: number };
  isLoading: boolean = false;
  isQuizStarted: boolean = false;
  topic: string = "";

  totalDuration: string;
  quiz_reference: string;
  timer: Subscription

  constructor(
    private _apiSrv: APIService,
    private modalService: NgbModal,
    private _toastSrv: ToastService,
    public _toastService: ToastService,
  ) {
    this.topic = "OOP";
    this.quiz_reference = uuid.v4().toString().substring(0, 15);
    console.log("UUID", this.quiz_reference);
  }

  ngOnInit() {
    this.getQuiz();
  }

  ngAfterViewInit() {
  }

  getQuiz() {
    try {
      this.isLoading = true;
      this._apiSrv.get(`Question/GetQuizWithTopic?topic=${this.topic}`).subscribe((res) => {
        this.quizMdl = res as { questions: Questions[], total_questions: number, total_times: number };
        this.quizMdl.questions = this.quizMdl.questions.map((m) => ({ ...m, duration: moment.utc().startOf('day').add(m.time_in_minutes, "minutes").format("HH:mm:ss"), active: false, locked: false }));
        this.totalDuration = moment.utc().startOf('day').add(this.quizMdl.total_times, 'minutes').format('HH:mm:ss');

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

  onTopicChange(event: any) {
    this.topic = event.target.value;
    this.getQuiz();
  }

  runTimer() {
    this.timer = interval(1000).subscribe(() => {
      this.calculateActiveQuizTime();
    });
  }
  closeTimer() {
    this.timer.unsubscribe();
  }

  activeQuiz(item: Questions) {
    if (item.locked || !this.isQuizStarted) return;

    this.activeQuizMdl = item;
    item.active = true;

    let previousActiveQuiz = this.quizMdl.questions.filter(f => f.id != item.id).find(item => item.active === true);
    if (previousActiveQuiz) {
      previousActiveQuiz.active = false;
      if (moment.duration(item.duration).asSeconds() > moment.duration("00:00:00").asSeconds()) {
        previousActiveQuiz.locked = false;
      }
    }

    //  this.quizMdl.questions.filter(f => f.id != item.id).forEach(question => question.active = false);


  }

  calculateActiveQuizTime() {
    // List of quiz timer update
    if (this.activeQuizMdl && !this.activeQuizMdl.locked) {
      this.activeQuizMdl.duration = this.formatDuration(moment.duration((moment.duration(this.activeQuizMdl.duration).asSeconds() - moment.duration("00:00:01").asSeconds()), 'seconds'));

      if (this.activeQuizMdl.duration === "00:00:00") {
        this.activeQuizMdl.active = false;
        this.activeQuizMdl.locked = true;
        this.onSubmitQuiz(this.activeQuizMdl);
        this.openNextQuestion();
      }
    } else {
      this.openNextQuestion();
    }

    //Global Timer Update
    this.totalDuration = this.formatDuration(moment.duration((moment.duration(this.totalDuration).asSeconds() - moment.duration("00:00:01").asSeconds()), 'seconds'));
    if (this.totalDuration === "00:00:00") {
      this.closingQuiz();
    }
  }

  openNextQuestion() {
    let findNextQuestion = this.quizMdl.questions.find(item => item.active === false && item.locked === false && moment.duration(item.duration).asSeconds() > moment.duration("00:00:00").asSeconds());
    if (findNextQuestion) {
      this.activeQuizMdl = findNextQuestion;
      this.activeQuizMdl.active = true;
    }
  }

  // onQuizCompleted() {
  //   /*
  //   let quizLeft = this.quizMdl.questions.filter(f => !f.locked);
  //   if (quizLeft.length <= 0) {
  //     this.closeTimer();
  //     this.activeQuizMdl = new Questions();
  //     console.log("on submitzzzzzz", this.quizMdl.questions);

  //     this.getQuiz();

  //     let formData = JSON.stringify(this.quizMdl.questions);

  //     this._apiSrv.create(`Answer`, formData).subscribe((res) => {

  //       console.log("on submit", res);
  //     },
  //       (error: HttpErrorResponse) => {
  //         this.isLoading = false;
  //         this._toastSrv.show(error.error, {
  //           classname: 'bg-danger text-light',
  //           delay: 10000,
  //         });
  //       }
  //     );

  //     this._toastService.show(
  //       `Quiz Successfully Completed`,
  //       {
  //         classname: 'bg-success text-light',
  //         delay: 10000,
  //       }
  //     );
  //   }
  //   */
  //   let quizLeft = this.quizMdl.questions.filter(f => !f.locked);
  //   if (quizLeft.length > 0) {
  //     this.isLoading = true;

  //     let lstAnswers: Answer[] = [];
  //     quizLeft.forEach(item => {
  //       lstAnswers.push({
  //         id: 0,
  //         user_id: 0,
  //         question_id: item.id,
  //         selected_option: item.selected_option,
  //         is_correct: (item.selected_option === item.correct_option) ? true : false,
  //         quiz_reference: this.quiz_reference,
  //         question: null,
  //         user_name: null,
  //       });
  //     });

  //     this._apiSrv.create(`Answer/submitAnswers`, JSON.stringify(lstAnswers)).subscribe((res) => {
  //       this.isLoading = false;
  //       console.log("on submit multipled", res);
  //     },
  //       (error: HttpErrorResponse) => {
  //         this.isLoading = false;
  //         this._toastSrv.show(error.error, {
  //           classname: 'bg-danger text-light',
  //           delay: 10000,
  //         });
  //       }
  //     );

  //     this.closingQuiz();
  //     this._toastService.show(
  //       `Quiz Successfully Completed`,
  //       {
  //         classname: 'bg-success text-light',
  //         delay: 10000,
  //       }
  //     );
  //   }
  // }

  closingQuiz() {

    this._apiSrv.get(`Answer/GetQuizSummary?quiz_reference=${this.quiz_reference}`).subscribe(res => {
      if (res) {
        this.quizSummaryMdl = res as QuizSummary;

        const modalRef = this.modalService.open(ConfirmDialogComponent);
        modalRef.componentInstance.message = `Quiz Reference: ${this.quizSummaryMdl.quiz_reference},
        Total Question: ${this.quizSummaryMdl.total_question},
        Correct: ${this.quizSummaryMdl.correct},
        Wrong: ${this.quizSummaryMdl.wrong}`;
        modalRef.componentInstance.buttonText = "Ok";
      }
    }, (err) => { console.log("error while fetching quiz summary") });

    this.isQuizStarted = false;
    this.quiz_reference = uuid.v4().toString().substring(0, 15);
    this.closeTimer();
    this.activeQuizMdl = new Questions();
    this.getQuiz();
  }

  formatDuration(duration: any) {
    var hours = duration.hours();
    var minutes = duration.minutes();
    var seconds = duration.seconds();

    return (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
  }

  onSubmitQuiz(item: Questions) {
    this.activeQuizMdl = item;
    item.active = false;
    item.locked = true;

    this._apiSrv.create(`Answer`, JSON.stringify({
      id: 0,
      user_id: 0,
      question_id: item.id,
      selected_option: item.selected_option,
      is_correct: (item.selected_option === item.correct_option) ? true : false,
      quiz_reference: this.quiz_reference
    })).subscribe(res => {
      console.log("on submitedddd", res);
    });

    let leftItems = this.quizMdl.questions.filter(f => !f.locked)
    if (leftItems.length <= 0) this.closingQuiz();
  }

  onStartQuiz() {
    if (this.isQuizStarted) return;
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'Would you like to start Quiz?';
    modalRef.componentInstance.buttonText = 'Start Quiz';
    modalRef.result.then(
      (result) => {
        if (result) {
          this.isQuizStarted = true;
          this.runTimer();
          this.openNextQuestion();
        }
      },
      (reason) => { console.log("rejected: ", reason); }
    );
  }

}
