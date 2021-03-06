import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CookiesService } from 'src/app/core/services/cookies/cookies.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserAccount, UserProfile } from 'src/app/shared/classes/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { ProductService } from 'src/app/shared/services/product.service';
// import { AlertModalComponent } from 'src/app/shared/components/modal/alert-modal/alert-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public UserProfile$: Observable<UserProfile>;
  public UserOrders$: any;
  public UserWishlist$: any;
  public UserCoupons$: any;
  public openDashboard: boolean = false;
  public closeResult: string;
  public USER_ID: string;
  public showOrders: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cookies: CookiesService,
    private authService: AuthService,
    public productService: ProductService,
    private userService: UserService,
    private accountService: AccountService,
  public title: Title) {
    this.UserProfile$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        this.USER_ID = params.userId;
        if (!this.cookies.checkCookie('USER_ID') || this.cookies.getCookieVal('USER_ID') !== this.USER_ID) {
          this.cookies.setCookieVal('USER_ID', params.userId)
        }
        return this.userService.getUserById(this.USER_ID).valueChanges()
      })
    )
  }


  ngOnInit(): void {
    this.title.setTitle('Dashboard - Tai-Dye Studios | Creative Clothing & Accessories')
    // this.UserOrders$ = this.getUserOrders();

  }

  ngAfterViewInit() {
    if (!this.cookies.checkCookie('ORIENTATION_COMPLETE')) {
      this.router.navigate(['/pages/profile'], {
        queryParams: { userId: this.USER_ID }
      })
    }
  }

  public getUserOrders() {
    const userId = this.cookies.getCookieVal('USER_ID')
    return this.accountService.getUserOrders(userId).pipe(tap(orders => console.log(orders)));
  }

  logout() {
    return this.authService.logOut()
      .then(() => {
        return this.router.navigate(['/pages/login']);
      })
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  ToggleOrderHistory() {
    this.showOrders = !this.showOrders;
  }
}
