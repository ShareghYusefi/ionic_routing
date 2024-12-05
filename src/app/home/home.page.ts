import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  appName = environment.appName;
  apiEndpoint = environment.apiEndpoint;

  // We can use NavController to define methods for navigation
  constructor(private navCtrl: NavController) {}

  // navigate to about page
  navigateToAbout(email: string) {
    this.navCtrl.navigateForward('/about', {
      queryParams: {
        email: email, // email, in Javascript
      },
    });
  }

  // navigate to contact page
  navigateToContact() {
    this.navCtrl.navigateForward('/contact'); // Add the email as a parameter
  }
}
