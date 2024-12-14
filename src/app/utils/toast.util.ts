import { ToastController } from '@ionic/angular';

// position can be of 'top', 'bottom', 'middle' values
// message is an optional string
export async function showToast(
  toastCtrl: ToastController,
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
  cssClass?: string,
  duration?: number
) {
  //   create toast
  const toast = await toastCtrl.create({
    message: message,
    duration: duration || 2000, // milliseconds
    position: position,
    color: color,
    cssClass: cssClass,
  });

  //   present toast
  await toast.present();
}
