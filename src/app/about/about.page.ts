import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  // ! means that the variable will be initialized later
  email!: string;
  // We can use NavController to define methods for navigation
  constructor(private navCtrl: NavController, private route: ActivatedRoute) {}

  // navigate to about page
  navigateBackHome() {
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }
}
