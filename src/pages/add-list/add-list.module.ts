import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddListPage } from './add-list';

@NgModule({
  declarations: [
    AddListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddListPage),
  ],
  exports : [
    AddListPage
  ]
})
export class AddListPageModule {}
