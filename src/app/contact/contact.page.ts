import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { EmailComposer } from 'capacitor-email-composer';

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

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

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
        // {
        //   name: 'age',
        //   type: 'number',
        //   placeholder: 'Enter your age',
        //   label: 'Age',
        //   min: 18,
        //   max: 120,
        // },
        {
          type: 'radio',
          label: 'Agree',
          value: 'agree',
          checked: true,
        },
        {
          type: 'radio',
          label: 'Disagree',
          value: 'disagree',
          checked: false,
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

            // checking radio button value
            if (data === 'disagree') {
              // present toast
              this.presentToast(
                'top',
                'Your form submission was unsuccessful!',
                'danger',
                'text-white'
              );
              // close alert
              alert.dismiss();
              return;
            }

            this.submitForm();
          },
        },
      ],
    });
    // present alert
    await alert.present();
  }

  // position can be of 'top', 'bottom', 'middle' values
  // message is an optional string
  async presentToast(
    position: 'top' | 'bottom' | 'middle',
    message: string,
    color?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'light'
      | 'medium'
      | 'dark',
    cssClass?: string
  ) {
    // create toast
    // const toast = await this.toastCtrl.create({
    //   message: message,
    //   duration: 2000, // milliseconds
    //   position: position,
    //   color: color,
    //   cssClass: cssClass,
    // });

    this.toastCtrl
      .create({
        message: message,
        duration: 2000, // milliseconds
        position: position,
        color: color,
        cssClass: cssClass,
      })
      .then((toast) => {
        toast.present();
      });

    // present toast
    // await toast.present();
  }

  // function will run asynchronously
  async sendEmail() {
    // check if email client is available
    const isAvailable = await EmailComposer.hasAccount(); // wait for successfult response (boolean)
    if (!isAvailable) {
      // present toast
      this.presentToast(
        'top',
        'Email client not available!',
        'danger',
        'text-white'
      );
      return;
    }

    // compose the mail
    await EmailComposer.open({
      to: ['sharegh.yusefi@robogarden.ca'],
      subject: 'Contact Form Submission',
      body: `Email: ${this.email} \nService: ${this.service} \nMessage: ${this.message}`, // can be HTML
      // attachments: [{
      //   type: 'absolute',
      //   path: 'file://README.pdf' // Android
      // }]
    });
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

    // email company
    this.sendEmail();
  }
}
