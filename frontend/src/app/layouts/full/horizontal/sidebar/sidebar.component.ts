import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppHorizontalNavItemComponent } from './nav-item/nav-item.component';
import { CommonModule } from '@angular/common';
import { adminNavItems, normalUserNavItems, guestUserNavItems } from '../../vertical/sidebar/sidebar-data';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';
import { DataHolderService } from 'src/app/services/data-holder.service';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [AppHorizontalNavItemComponent, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class AppHorizontalSidebarComponent implements OnInit {
  navItems: NavItem[] = [];
  parentActive = '';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    public _userautherizeService: userAutherizeService,
    public dataHolderService: DataHolderService
  ) {
    this.setCurrentUserLevelNavItems();
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(
      () => (this.parentActive = this.router.url.split('/')[1])
    );
  }

  ngOnInit(): void { }

  setCurrentUserLevelNavItems(): void {
    const userState = this.dataHolderService.user?.role;
    switch (userState) {
      case 0:
        this.navItems = adminNavItems;
        break;
      case 1:
        this.navItems = normalUserNavItems;
        break;
      case 2:
      default:
        this.navItems = guestUserNavItems;
        break;
    }
  }
}
