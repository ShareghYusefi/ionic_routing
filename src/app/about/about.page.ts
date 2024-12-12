import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, NavController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  // ! means that the variable will be initialized later
  email!: string;
  items: string[] = [];
  // We can use NavController to define methods for navigation
  constructor(private navCtrl: NavController, private route: ActivatedRoute) {}

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  // navigate to about page
  navigateBackHome() {
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {
    this.generateItems();

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }
}
