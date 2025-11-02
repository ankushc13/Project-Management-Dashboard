import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalProjects = 0;
  activeTasks = 0;
  teamMembers = 0;
  completed = 0;
  loading = false;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts() {
    this.loading = true;

    this.projectService.getProjects().subscribe({
      next: (projects) => (this.totalProjects = projects.length),
      error: () => (this.totalProjects = 0)
    });
    
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.activeTasks = tasks.filter(t => t.status !== 'Done').length;
        this.completed = tasks.filter(t => t.status === 'Done').length;
      },
      error: () => {
        this.activeTasks = 0;
        this.completed = 0;
      }
    });
    
    this.userService.getUsers().subscribe({
      next: (users) => (this.teamMembers = users.length),
      error: () => (this.teamMembers = 0),
      complete: () => (this.loading = false)
    });
  }
}
