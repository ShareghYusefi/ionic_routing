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
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  // read file form assets folder
  async copyFileToShareLocation(filename: string) {
    try {
      //1. fetch file from asserts directory
      const response = await fetch(`assets/${filename}`);
      // get file blob (binary large object): a collection of binary data stored as a single entity
      // binary data is 1s and 0s
      const blob = await response.blob();

      //2.transform blob to base64Data format: base64 can be used by web browsers or mobile devices to display images
      const reader = new FileReader();
      // create a promise to read the file as base64
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob); // read the blob as base64
      });
      // wait for the promise to resolve
      const base64Data = await base64Promise;

      //3. create a file in the cache directory
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data.split(',')[1], // remove the "data:image/png;base64,"" part
        directory: Directory.Cache,
      });

      // return uri of the file
      return result.uri;
    } catch (error) {
      console.log('Error copying file: ', error);
      return null;
    }
  }

  // Shareing via meta platform
  async metaSharing() {
    // get out file to share from the assets folder using filesytem plugin
    const fileUri = await this.copyFileToShareLocation(
      'capacitor-logo-light.png'
    );
    // use the share plugin to share the file on other apps
    if (fileUri) {
      try {
        // share the file
        await Share.share({
          title: 'Capacitor Sharing',
          text: 'Sharing a file using Capacitor',
          url: fileUri,
          dialogTitle: 'Share via',
        });
      } catch (error) {
        console.error('Error sharing file: ', error);
      }
    }
  }

  imageUrl: string | undefined;

  takePhotoAndSaveToGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: true, // allow cropping
        resultType: CameraResultType.Uri,
        saveToGallery: true, // save to gallery
      });

      if (image.path) {
        this.imageUrl = image.webPath;
        return image.path;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error taking photo: ', error);
      return null;
    }
  };

  selectAndCropPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Photos,
        quality: 90,
        allowEditing: true, // allow cropping
        resultType: CameraResultType.Base64, // return photo as base64
      });

      const filename = `cropped_${new Date().getTime()}.png`;
      // write it to cache directory of filesystem
      const result = await Filesystem.writeFile({
        path: filename,
        data: image.base64String ?? '',
        directory: Directory.Cache,
      });

      this.imageUrl = image.webPath;
      return result.uri;
    } catch (error) {
      console.log('Error taking photo: ', error);
      return null;
    }
  };
}
