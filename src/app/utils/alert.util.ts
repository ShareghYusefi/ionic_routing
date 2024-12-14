import { AlertController } from '@ionic/angular';

export async function showAlert(
  alertCtrl: AlertController,
  header: string,
  message: string,
  buttons: any[]
) {
  const alert = await alertCtrl.create({
    header, // header: header
    message, // message: message
    buttons, // buttons: buttons
  });

  await alert.present();
}
