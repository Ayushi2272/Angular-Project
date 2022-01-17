import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.scss']
})
export class DeleteAlertComponent implements OnInit {
 
  title: string = '';
  message: string = "ARE YOU SURE?"
  confirmButtonText = "Yes"
  cancelButtonText = "No"
  deleteRecordId : number =0;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<DeleteAlertComponent>,
  public clientService: ClientService,) {
      if(data) {
       this.deleteRecordId = data;
      }
  }
  ngOnInit(): void {
  }
  yesBtnClicked(): any { 
    this.clientService.removeOb(this.deleteRecordId).subscribe((res:any)=>
    {
     if(res)
     {
      this.dialogRef.close(true);
     }
    });
  }
  noBtnClicked(): any {
    this.deleteRecordId = 0;
    this.dialogRef.close(false);
    
  }
}
