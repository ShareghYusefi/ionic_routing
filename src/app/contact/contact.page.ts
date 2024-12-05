import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  gotToHome() {
    this.router.navigate(['/home'], {
      queryParams: {
        email: 'some@email.co',
      },
    });
  }
}
