import { Component, OnInit, ViewChild } from '@angular/core';
import { MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { MiaColumn, MiaTableConfig, MiaTableEditableComponent, MiaTableEditableConfig } from '@agencycoda/mia-table';
import { Subject } from 'rxjs';
import { Client } from './entities/client';
import { ClientService } from './services/client.service';
import { MiaField, MiaFormConfig, MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertComponent } from './delete-alert/delete-alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'coda-test-angular';
  @ViewChild('tableEditable') tableEditable!: MiaTableEditableComponent;
  tableConfig: MiaTableConfig = new MiaTableConfig();
  tableEditableConfig: MiaTableEditableConfig = new MiaTableEditableConfig();
  tableDataEditable: Array<any> = [];
  mockData?: MiaPagination<any>;
  queryScroll = new MiaQuery();
  data = new MiaFormModalConfig();


  constructor(
    public clientService: ClientService,
    protected dialog: MatDialog,
  ){
  }
  ngOnInit(): void {
    this.loadConfig();
    this.loadModal();
    this.queryScroll.itemPerPage = 1;
  }
  
  loadConfig() {
    this.tableConfig.service = this.clientService;
    this.tableConfig.id = 'table-test';
    this.tableConfig.columns = [ 
      { key: 'firstname', type: 'string', title: 'FirstName', field_key: 'firstname'},
      { key: 'lastname', type: 'string', title: 'LastName', field_key: 'lastname'},
      { key: 'email', type: 'string', title: 'Email', field_key: 'email', },
      { key: 'more', type: 'more', title: '', extra: {
        actions: [
          { icon: 'create', title: 'Edit', key: 'edit' },
          { icon: 'delete', title: 'Delete', key: 'remove' },
        ]
      } },
      
    ];
    this.tableConfig.loadingColor = 'red';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No tenes cargado ningun elemento todavia';
    this.tableConfig.onClick.subscribe(result => {
  
      if(result.key=='edit')
      {
        this.edit(result.item.id);
      }
      else if(result.key=='remove')
      {
          this.delete(result.item.id);
      }
     
    });
    this.mockData = {
      current_page: 1,
      first_page_url: '',
      from: '',
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 50,
      prev_page_url: '',
      to: '',
      total: 1,
      data: [
        {
          id: 1, role_id: 1, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00'
        },
        {
          id: 2, role_id: 3, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00', categories: [ { title: 'category One'}, { title: 'category Two'} ]
        },
        {
          id: 3, role_id: 1, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: '', subtitle: 'Administrador', is_online: 0, created_at: '1989-08-25 18:00:00'
        },
        {
          id: 4, role_id: 4, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00'
        }
      ]
    };
  }
  loadModal()
  {
    this.data.service = this.clientService;
    this.data.titleNew = 'Create Client';
    this.data.titleEdit = 'Edit Client';
    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      { key: 'firstname', type: MiaField.TYPE_STRING, label: 'First name'
    },
    { key: 'lastname', type: MiaField.TYPE_STRING, label: 'Last name'
      },
      { key: 'email', type: MiaField.TYPE_STRING, label: 'Email', validators:
    [Validators.required] },
    ];
    config.errorMessages = [
      { key: 'required', message: 'The "%label%" is required.' }
      ];
      this.data.config = config;
  }
 
  create()
  {
    this.data.item = new Client();
    this.openModal();
  }
  openModal()
  {
    return this.dialog.open(MiaFormModalComponent, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: this.data
      }).afterClosed().subscribe((
        res:any)=>
      {
        if(res)
         {
            window.location.reload();
         }
      });
  }
  edit(id:number)
  {
    this.clientService.fetchOb(id).subscribe((res:any)=>
    { 
      this.data.item=res;
    });
    this.openModal();
  }
  delete(id:number)
  {
    this.dialog.open(DeleteAlertComponent,{data : id}).afterClosed().subscribe((
      res:any)=>
    {
      if(res)
       {
          window.location.reload();
       }
    });
  }
}
