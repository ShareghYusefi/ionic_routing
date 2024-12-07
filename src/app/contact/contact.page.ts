import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {}

  gotToHome() {
    this.router.navigate(['/home'], {
      queryParams: {
        email: 'some@email.co',
      },
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
  }
}
