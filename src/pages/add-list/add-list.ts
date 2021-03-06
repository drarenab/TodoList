import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TodoList } from "../../models/model";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the AddListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html',
})
export class AddListPage {
  name: string;
  // isRecording: boolean = false;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController
  ) {
    this.name = this.navParams.get("name");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddListPage');
  }

  saveList() {
    let list: TodoList = {
      uuid: "",
      name: this.name,
      items: []
    };

    this.view.dismiss(list);
  }

  close() {
    this.view.dismiss();
  }

 

  
}
