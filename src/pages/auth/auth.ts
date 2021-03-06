import {Component} from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController, Events, NavParams
} from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {EmailValidator} from "../../validators/EmailValidator";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {ToolProvider} from "../../providers/tool/tool";
import {AngularFireList, AngularFireObject} from "angularfire2/database";

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  user: any;
  public loginForm: FormGroup;
  public loading: Loading;
  userID: string;
  waitingTodoLists: any;
  waitingListsIds: any;
  notificationCount: number;


  pendingCount: string = "";
  stats: AngularFireObject<any>;
  todoListsIds: any = [];

  constructor(public navCtrl: NavController,
              public todoService: TodoServiceProvider,
              public formBuilder: FormBuilder,
              public authProvider: AuthServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toolProvider: ToolProvider,
              public events: Events,
              public navParams: NavParams) {


    this.loginForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.required])]
    });

    if (this.navParams.data.userID)
      this.accessGranted(this.navParams.data.userID);

    this.waitingTodoLists = [];
    this.waitingListsIds = [];
    // if(!this.userID){
    //   this.accessGranted(navParams.data.userID);

    // }
  }


  getState() {
    return this.authProvider.getState();
  }

  ionViewDidLoad() {
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then(authData => {
          this.loading.dismiss().then(() => {
            this.accessGranted(this.toolProvider.removeSpecialCharacters(authData.email));
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  accessGranted(userID: string): void {
    this.userID = userID;
    this.todoService.getWaitingTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>) => {
      this.waitingTodoLists = [];
      this.waitingListsIds = listsIds;
    });

    this.todoService.getTodoListsIds(this.userID).subscribe((lists)=>{
      this.todoListsIds = lists;
    });

    this.todoService.getStats(this.userID).subscribe((stats: AngularFireObject<any>)=>{
      this.stats = stats;
    });

    this.events.publish('login',this.userID);
  }

  logout() {
    this.authProvider.logout();
  }

  goToLoginGoogle(): void {
    this.authProvider.loginGoogle().then(
      (result) => {
        this.accessGranted(result.user.uid);
        console.log(result);
      }).catch((error) => {

    });
  }

  goToLoginGoogleNative() {
    this.authProvider.loginGoogleNative().then(
      (email) => {
        this.accessGranted(this.toolProvider.removeSpecialCharacters(email));
      }).catch((error) => {

      });
  }


  accessToMyTodoList() {
    this.navCtrl.push('ListsPage', {userID: this.userID});
  }

  notifications() {
    this.navCtrl.push('NotificationsPage', {userID: this.userID});
  }

}
