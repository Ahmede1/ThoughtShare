import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { AppNotesComponent } from './apps/notes/notes.component';
import { AllNewsComponent } from './apps/news/all-news.component';
import { AppAccountSettingComponent } from './authentication/account-setting/account-setting.component';
import { MyVideosComponent } from './my-videos/my-videos.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { DataResolver } from '../resolver/data.resolver';
import { PaymentPlansComponent } from './payment-plans/payment-plans.component';
import { VideoStatisticsComponent } from './video-statistics/video-statistics.component';

export const PagesRoutes: Routes = [
  {
    path: 'create-news',
    component: AppNotesComponent,
    title: 'Create News',
  },
  {
    path: 'all-news',
    component: AllNewsComponent,
    title: 'All News',
  },
  {
    path: 'account-setting',
    component: AppAccountSettingComponent,
    title: 'Account Settings',
  },
  {
    path: 'my-videos',
    component: MyVideosComponent,
    title: "My Videos"
  },
  {
    path: 'upload-video',
    component: UploadVideoComponent,
    title: "Upload Video"
  },
  {
    path: 'payment-plans',
    title: "Subscription plans",
    component: PaymentPlansComponent,
  },
  {
    path: 'video-statistics',
    title: "Statistics",
    component: VideoStatisticsComponent,
  },
];
