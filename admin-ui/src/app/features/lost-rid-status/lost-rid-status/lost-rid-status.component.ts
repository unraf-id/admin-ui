import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestModel } from 'src/app/core/models/request.model';
import { SortModel } from 'src/app/core/models/sort.model';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { AppConfigService } from 'src/app/app-config.service';
import { PaginationModel } from 'src/app/core/models/pagination.model';
import { CenterRequest } from 'src/app/core/models/centerRequest.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import Utils from 'src/app/app.utils';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { AuditService } from 'src/app/core/services/audit.service';
import { HeaderService } from 'src/app/core/services/header.service';

@Component({
  selector: 'app-lost-rid-status',
  templateUrl: './lost-rid-status.component.html',
  styleUrls: ['./lost-rid-status.component.scss']
})
export class LostRidStatusComponent implements OnInit {
  displayedColumns = [];
  actionButtons = [];
  actionEllipsis = [];
  paginatorOptions: any;
  sortFilter = [];
  primaryLang: string;  
  pagination = new PaginationModel();
  centerRequest = {} as CenterRequest;
  requestModel: RequestModel;
  datas = [];
  subscribed: any;
  errorMessages: any;
  noData = false;
  filtersApplied = false;
  popupMessages: any;
  serverError: any;

  constructor(
    private dataStroageService: DataStorageService,
    private appService: AppConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private auditService: AuditService
  ) {
    this.getlostridConfigs();
    this.primaryLang = this.headerService.getUserPreferredLanguage();
    
    this.translateService.use(this.primaryLang);
    translateService.getTranslation(this.primaryLang).subscribe(response => {
      this.errorMessages = response.errorPopup;
    });
    this.subscribed = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.displayedColumns)
          this.getlostridConfigs();
      }
    });
  }

  ngOnInit() {
    this.auditService.audit(5, 'ADM-045');
    this.translateService
      .getTranslation(this.primaryLang)
      .subscribe(response => {
        this.popupMessages = response;
        this.serverError = response.serverError;
      });
  }

  getlostridConfigs() {
    this.dataStroageService
      .getSpecFileForMasterDataEntity("lost-rid-status")
      .subscribe(response => {
        this.displayedColumns = response.columnsToDisplay;
        this.actionButtons = response.actionButtons.filter(
          value => value.showIn.toLowerCase() === 'ellipsis'
        );
        this.actionEllipsis = response.actionButtons.filter(
          value => value.showIn.toLowerCase() === 'button'
        );
        this.paginatorOptions = response.paginator;
        this.auditService.audit(3, response.auditEventIds[0], 'lost-rid-status');
        this.getlostridDetails();
      });
  }

  pageEvent(event: any) {
    const filters = Utils.convertFilter(this.activatedRoute.snapshot.queryParams, this.primaryLang);
    filters.pagination.pageFetch = event.pageSize;
    filters.pagination.pageStart = event.pageIndex;
    const url = Utils.convertFilterToUrl(filters);
    this.router.navigateByUrl(`admin/lost-rid-status/view?${url}`);
  }

  getSortColumn(event: SortModel) {    
    this.sortFilter.forEach(element => {
      if (element.sortField === event.sortField) {
        const index = this.sortFilter.indexOf(element);
        this.sortFilter.splice(index, 1);
      }
    });
    if (event.sortType != null) {
      this.sortFilter.push(event);
    }
    const filters = Utils.convertFilter(this.activatedRoute.snapshot.queryParams, this.primaryLang);
    filters.sort = this.sortFilter.slice(1);
    const url = Utils.convertFilterToUrl(filters);
    this.router.navigateByUrl('admin/lost-rid-status/view?' + url);
  }

  getlostridDetails() {
    this.datas = [];
    this.noData = false;
    this.filtersApplied = false;
    const filters = Utils.convertFilter(this.activatedRoute.snapshot.queryParams, this.primaryLang);
    if (filters.filters.length > 0) {
      this.filtersApplied = true;
    }
    this.sortFilter = filters.sort;
    if(this.sortFilter.length == 0){
      this.sortFilter.push({"sortType":"desc","sortField":"registrationDate"});      
    }
    this.requestModel = new RequestModel(null, null, filters);
    console.log(JSON.stringify(this.requestModel));
    this.dataStroageService
      .getlostridDetails(this.requestModel)
      .subscribe(({ response, errors }) => {        
        if (!errors) {
          this.paginatorOptions.totalEntries = 0;
          this.paginatorOptions.pageIndex = 0;
          this.paginatorOptions.pageSize = 0;
          if (response.data.length) {
            this.datas = [...response.data];
          } else {
            this.noData = true;
         }
      } else {
        this.noData = true;
        let message = "";
        if(errors[0].errorCode === "KER-MSD-999"){
          errors.forEach((element) => {
            message = message + element.message.toString() +"\n\n";
          });
          message = this.serverError[errors[0].errorCode] +"\n\n"+ message;
        }else{
          message = this.serverError[errors[0].errorCode];
        }
        this.showErrorPopup(message);
      }
    });
  }
  showErrorPopup(message: string) {
    this.dialog
      .open(DialogComponent, {
        width: '650px',
        data: {
          case: 'MESSAGE',
          title: this.popupMessages.genericmessage.errorLabel,
          message: message,
          btnTxt: this.popupMessages.genericmessage.successButton
        },
        disableClose: true
      });
  }

ngOnDestroy() {
    this.subscribed.unsubscribe();
  }
}
