import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery";

  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: GroceriesServiceProvider, public dialogService: InputDialogServiceProvider, public socialSharing: SocialSharing) {
    // Subscribing to observable to know when data changes.
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad(){
    this.loadItems();
  }

  // Get initial groceries list from provider.
  loadItems(){
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
      );
  }

  removeItem(item, id){
    // Show action notification
    this.showToast("Remove", item, id);

    // Use Groceries Provider to remove item
    this.dataService.removeItem(item._id);    
  }

  shareItem(item, index){
    console.log("Shared successfully");
    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Grocery app";
    // Share an item    
    this.socialSharing.share(message,subject).then(() => {
      console.log("Shared successfully");
      // Show action notification
      this.showToast("Shared successfully", item, index);
    }).catch((error) => {
      console.error("Error while sharing ", error);
      // Show action notification
      this.showToast("Share Error!", item, index);
    });
  }

  editItem(item, index){
    // Show action notification
    this.showToast("Edit", item, index);

    // Delete item from items array    
    this.dialogService.showPrompt(item, index, item._id);
  }

  addItem(){
    console.log("Item added"); 
    this.dialogService.showPrompt();   
  }

  showToast(itemAction, itemObj, id){
    // Show a toast message to Troubleshoot action occurrance.
    console.log(itemAction + " item .." , id, itemObj._id);
    
    // Show item action message (toast)
    const toast = this.toastCtrl.create({
      message: itemAction + ' item - ' + itemObj.name + " ...",
      duration: 3000
    });
    toast.present();
  }
}
