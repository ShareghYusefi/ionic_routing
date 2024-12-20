import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

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

  async openSettings(setting: string) {
    let androidOption: AndroidSettings = AndroidSettings.Wifi; // default value
    let iosOption: IOSSettings = IOSSettings.WiFi; // default value
    // check what setting to open
    if (setting === 'wifi') {
      androidOption = AndroidSettings.Wifi;
      iosOption = IOSSettings.WiFi;
    } else if (setting === 'keyboard') {
      androidOption = AndroidSettings.Keyboard;
      iosOption = IOSSettings.Keyboard;
    } else if (setting === 'bluetooth') {
      androidOption = AndroidSettings.Bluetooth;
      iosOption = IOSSettings.Bluetooth;
    } else if (setting === 'settings') {
      androidOption = AndroidSettings.Settings;
      iosOption = IOSSettings.App;
    }

    // use plugin to open settings
    await NativeSettings.open({
      optionAndroid: androidOption,
      optionIOS: iosOption,
    });
  }

  // navigate to contact page
  navigateToContact() {
    this.navCtrl.navigateForward('/contact'); // Add the email as a parameter
  }
}
