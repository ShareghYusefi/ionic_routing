import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SmsManager } from '@byteowls/capacitor-sms';
import { showToast } from '../utils/toast.util';
import { CallNumber } from 'capacitor-call-number';
import { Contacts, PhoneType, EmailType } from '@capacitor-community/contacts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  appName = environment.appName;
  apiEndpoint = environment.apiEndpoint;
  contacts: any[] = [];

  // We can use NavController to define methods for navigation
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  // navigate to about page
  navigateToAbout(email: string) {
    this.navCtrl.navigateForward('/about', {
      queryParams: {
        email: email, // email, in Javascript
      },
    });
  }

  async callContact(contact: any) {
    await CallNumber.call({
      number: contact.phones?.[0]?.number,
      bypassAppChooser: true, // show the default call dialer screen
    });
  }

  sendSms(contact: any) {
    const numbers: string[] = [contact.phones?.[0]?.number];
    SmsManager.send({
      numbers: numbers,
      text: 'This is a example SMS',
    })
      .then(() => {
        // success
        showToast(this.toastController, 'bottom', 'SMS sent', 'success');
        console.log('SMS sent');
      })
      .catch((error) => {
        console.error(error);
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

  // requesting permission
  async requestPermission() {
    // use local notification plugin to request permission
    const { display } = await LocalNotifications.requestPermissions();
    console.log('Permission: ', display);
    if (display != 'granted') {
      console.error('Permission denied');
    }
  }

  // schedule a notification
  async scheduleNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1, // set id for canceling
          title: 'Hello!',
          body: 'This is a local notification',
          schedule: {
            at: new Date( // set the time
              new Date().getTime() + // get current time
                4000 // add 4 seconds
            ),
          },
        },
      ],
    });
  }

  async cancelNotification() {
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }], // cancel notification with id 1
    });
  }

  // navigate to contact page
  navigateToContact() {
    this.navCtrl.navigateForward('/contact'); // Add the email as a parameter
  }

  retrieveListOfContacts = async () => {
    // request permission to access contacts
    const permissions = await Contacts.requestPermissions();
    if (permissions.contacts !== 'granted') {
      console.error('Permission denied');
      return;
    }

    // retrieve contacts
    const projection = {
      // Specify which fields should be retrieved.
      name: true,
      phones: true,
    };

    const result = await Contacts.getContacts({
      projection,
    });
    // assign contacts to a variable
    this.contacts = result.contacts;
    console.log('Contacts: ', this.contacts);
  };

  async createContact() {
    const res = await Contacts.createContact({
      contact: {
        name: {
          given: 'Jane',
          family: 'Doe',
        },
        birthday: {
          year: 1990,
          month: 1,
          day: 1,
        },
        phones: [
          {
            type: PhoneType.Mobile,
            label: 'mobile',
            number: '+1-212-456-7890',
          },
          {
            type: PhoneType.Work,
            label: 'work',
            number: '212-456-7890',
          },
        ],
        emails: [
          {
            type: EmailType.Work,
            label: 'work',
            address: 'jane@example.com',
          },
        ],
        urls: ['jane.com'],
      },
    });

    console.log(res.contactId);
  }
}
