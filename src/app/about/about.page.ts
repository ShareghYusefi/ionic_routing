import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Student } from '../interfaces/student';
import { SchoolService } from '../services/school.service';
import { showAlert } from '../utils/alert.util';
import { showToast } from '../utils/toast.util';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  // ! means that the variable will be initialized later
  email!: string;
  students: Student[] = [];

  // We can use NavController to define methods for navigation
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async presentAlertDelete(id: number) {
    await showAlert(
      this.alertController,
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        'Cancel',
        {
          text: 'Delete',
          handler: () => {
            this.deleteStudent(id);
            // show toast
            showToast(
              this.toastController,
              'bottom',
              'Student deleted successfully',
              'success'
            );
          },
        },
      ]
    );
  }

  // navigate to about page
  navigateBackHome() {
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {
    // Since getStudents() returns an Observable, we need to subscribe to it for the data
    this.schoolService.getStudents().subscribe((response) => {
      // the response should be an array of students
      this.students = response;
    });

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  deleteStudent(id: number) {
    // find index of student with id
    let index = this.students.findIndex((student) => student.id === id);
    // index is -1 when not matching student is found
    if (index === -1) {
      return;
    }

    // call deleteStudent method from SchoolService
    this.schoolService.deleteStudent(id).subscribe(
      (response) => {
        // find student using id field
        let student = this.students.find((s) => s.id === response.id);
        // if student is not found, return
        if (!student) {
          return;
        }

        // remove student from students array
        this.students.splice(this.students.indexOf(student), 1);
      },
      (error) => {
        console.log('Error deleting', error);
      }
    );
  }
}
