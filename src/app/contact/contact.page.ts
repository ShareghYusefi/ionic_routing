import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  email: string = '';
  service: string = '';
  message: string = '';
  method: Object = {};

  contactMethods = [
    { val: 'email', isChecked: false },
    { val: 'phone', isChecked: true },
    { val: 'sms', isChecked: false },
  ];

  constructor(private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {}

  gotToHome() {
    this.router.navigate(['/home'], {
      queryParams: {
        email: 'some@email.co',
      },
    });
  }

  async presentSubmissionAlert() {
    // create alert
    const alert = await this.alertCtrl.create({
      header: "Are you sure you'd like to submit?",
      message: 'Please confirm that you are 18 years or older.',
      inputs: [
        {
          name: 'age',
          type: 'number',
          placeholder: 'Enter your age',
          label: 'Age',
          min: 18,
          max: 120,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Submission cancelled');
          },
        },
        {
          text: 'Submit',
          handler: (data) => {
            console.log('Submission successful', data);
            if (data.age < 18) {
              console.log('You are not old enough to submit this form.');
              // close alert
              alert.dismiss();
            }

            this.submitForm();
          },
        },
      ],
    });
    // present alert
    await alert.present();
  }

  submitForm() {
    console.log('Email:', this.email);
    console.log('Service:', this.service);
    console.log('Message:', this.message);
    // iterate over contact methods
    this.contactMethods.map((method) => {
      // check if method is checked
      if (method.isChecked) {
        // if checked, assign to our method variable for submission
        this.method = method;
      }
    });

    console.log('Method:', this.method);
  }
}
