import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/types';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  projectId!: number;
  tasks: Task[] = [];
  filter = 'All';
  statuses = ['All', 'To Do', 'In Progress', 'Done'];
  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const findId = () => {
      let r: ActivatedRoute | null = this.route;
      while (r) {
        const val = r.snapshot.paramMap.get('id');
        if (val) return Number(val);
        r = r.parent as ActivatedRoute | null;
      }
      return NaN;
    };

    this.projectId = findId();
    this.load();
    this.userService.getUsers().subscribe(u => (this.users = u));
  }

  load() {
    if (!this.projectId || Number.isNaN(this.projectId)) return;
    this.taskService.getTasksByProject(this.projectId).subscribe(t => (this.tasks = t));
  }

  getAssignedName(t: Task) {
    const assigned = (t as any).assignedTo;
    const u = this.users.find(u => u.id === assigned);
    return u ? u.name : (assigned ?? '—');
  }

  filteredTasks(): Task[] {
    if (this.filter === 'All') return this.tasks;
    return this.tasks.filter(t => t.status === this.filter);
  }

  goToNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  view(task: Task) {
    this.router.navigate([task.id], { relativeTo: this.route });
  }

  edit(task: Task) {
    this.router.navigate([task.id, 'edit'], { relativeTo: this.route });
  }

  deleteTask(task: Task) {
    if (!task.id) return;
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(task.id).subscribe(() => this.load());
  }
}
