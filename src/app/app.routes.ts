import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskListComponent } from './pages/tasks/task-list/task-list.component';
import { TaskFormComponent } from './pages/tasks/task-form/task-form.component';
import { TaskDetailsComponent } from './pages/tasks/task-details/task-details.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'projects',
        component: ProjectsComponent,
        children: [
          { path: '', component: ProjectListComponent },
          { path: 'add', component: ProjectFormComponent },
          { path: 'edit/:id', component: ProjectFormComponent },
          {
            path: ':id',
            component: ProjectDetailComponent,
            children: [
              {
                path: 'tasks',
                children: [
                  { path: '', component: TaskListComponent },
                  { path: 'new', component: TaskFormComponent },
                  { path: ':taskId', component: TaskDetailsComponent },
                  { path: ':taskId/edit', component: TaskFormComponent }
                ]
              }
            ]
          }
        ]
      },
      { path: 'tasks', component: TasksComponent },
      { path: 'users', component: UsersComponent }
    ]
  }
];
