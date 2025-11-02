import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/types';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filter = 'All';
  statuses = ['All', 'To Do', 'In Progress', 'Done'];
  users: any[] = [];

  constructor(private taskService: TaskService, private userService: UserService) {}

  ngOnInit(): void {
    this.load();
    this.userService.getUsers().subscribe(u => (this.users = u));
  }

  load() {
    this.taskService.getTasks().subscribe(t => (this.tasks = t));
  }

  filteredTasks(): Task[] {
    if (this.filter === 'All') return this.tasks;
    return this.tasks.filter(t => t.status === this.filter);
  }

  getAssignedName(t: Task) {
    const assigned = (t as any).assignedTo;
    const u = this.users.find(u => u.id === assigned);
    return u ? u.name : (assigned ?? '—');
  }

  deleteTask(id?: number) {
    if (!id) return;
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe(() => this.load());
  }
}
