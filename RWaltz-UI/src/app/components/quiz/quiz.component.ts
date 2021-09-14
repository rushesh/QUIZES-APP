import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  form!: FormGroup;
  allQuestions: any = [];
  currentQuestions: any;
  currentQuestionsNo = 0;
  output: any = [];
  previousQuestions: any;
  previousQuestionsNo = 0;
  result = '';
  maxQuestions = 10;
  showResult = false;

  private subscription!: Subscription;

  public dateNow = new Date();
  public dDay: any;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference: number | undefined;
  public secondsToDday: number | undefined;
  public minutesToDday: number | undefined;
  public hoursToDday: number | undefined;
  public daysToDday: number | undefined;

  addMinutes(date: any, minutes: any) {
    return new Date(date.getTime() + minutes * 60000);
  }
  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: any) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    );
    this.daysToDday = Math.floor(
      timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute *
          this.hoursInADay)
    );
  }

  ngOnInit(): void {
    if (!this.backendService.checkLoggedIn()) {
      this.toastr.error('Not Logged In', 'Login to continue!');
      this.router.navigateByUrl('/');
    } else {
      this.initializeQuiz();
    }
  }
  initializeQuiz(): any {
    this.form = this.fb.group({
      answers: ['', Validators.required],
    });
    this.showResult = false;
    this.result = '';
    this.output = [];

    this.backendService.getAllQuestion().subscribe(
      (data: any) => {
        this.dDay = this.addMinutes(new Date(), 10);
        this.subscription = interval(1000).subscribe((x) => {
          this.getTimeDifference();
        });
        for (let c in data) {
          const obj = {
            options: data[c].options,
            question: data[c].question,
            id: data[c].id,
          };
          // console.log(obj)
          this.allQuestions.push(obj);
        }
      },
      (err) => {
        console.log('Error : ', err);
        this.toastr.error('Sorry some error occured while fetching questions');
      },
      () => {
        this.allQuestions = this.shuffle(this.allQuestions);
        if (this.allQuestions.length < this.maxQuestions) {
          this.maxQuestions = this.allQuestions.length;
        }
        this.previousQuestions = null;
        this.previousQuestionsNo = 0;

        this.currentQuestionsNo = 0;
        this.currentQuestions = this.allQuestions[this.currentQuestionsNo];
        this.toastr.info('Quiz Started', '', {
          timeOut: 2000,
          closeButton: true,
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        setTimeout(() => {
          this.subscription.unsubscribe();
          this.toastr.warning('Time is up.');
          this.finishQuiz();
        }, 60 * 1000 * 10);
      }
    );
  }
  nextQuestion(): any {
    // console.log(this.currentQuestionsNo, this.previousQuestionsNo)
    if (this.currentQuestionsNo < this.maxQuestions) {
      this.previousQuestions = this.allQuestions[this.currentQuestionsNo];
      this.previousQuestionsNo = this.previousQuestionsNo += 1;
      this.currentQuestionsNo += 1;
      this.currentQuestions = this.allQuestions[this.currentQuestionsNo];
      this.output.push(this.form.value['answers']['t']);
    }
    if (this.currentQuestionsNo === this.maxQuestions) {
      this.showResultFunc();
    }
    this.form = this.fb.group({
      answers: ['', Validators.required],
    });
  }
  previousQuestion(): any {
    // console.log(this.currentQuestionsNo, this.previousQuestionsNo)
    this.currentQuestions = this.previousQuestions;
    this.currentQuestionsNo = this.previousQuestionsNo-1;

    if (this.previousQuestionsNo == 0) {
      this.previousQuestionsNo = 0;
      this.previousQuestions = null;
    } else {
      this.previousQuestionsNo -= 1;
      this.previousQuestions = this.allQuestions[this.previousQuestionsNo];
    }
    this.form = this.fb.group({
      answers: ['', Validators.required],
    });
  }
  finishQuiz(): any {
    if (this.currentQuestionsNo < this.maxQuestions) {
      if (this.form.value['answers']['t'])
        this.output.push(this.form.value['answers']['t']);
    }
    this.currentQuestionsNo = this.maxQuestions + 1;
    this.showResult = true;
    console.log('FinishQuiz');

    this.showResultFunc();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showResultFunc(): any {
    this.showResult = true;
    console.log('output');
    console.log(this.output);
    this.result = this.output.filter((x: any) => x === true).length;
    const falses = this.output.length - +this.result;
    const trues = +this.result;

    const percent = Math.round((trues / (trues + falses)) * 100);
    this.result = `You answered  ${trues} correct and ${falses} incorrect and you scored ${percent}%.`;
    console.log(this.result);
    this.backendService.sendLoginUserDetails(trues, falses, percent).subscribe(
      (data) => {},
      (err) => {
        this.toastr.error('Error while saving details');
      },
      () => {
        this.toastr.success('Details Saved');
      }
    );
    this.subscription.unsubscribe();
  }
  restartQuiz(): any {
    this.initializeQuiz();
  }
  Logout(): any {
    this.backendService.logOutUser();
    this.toastr.info('Logged Out');
    this.router.navigateByUrl('/');
  }
  shuffle(array: any[]) {
    var currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
