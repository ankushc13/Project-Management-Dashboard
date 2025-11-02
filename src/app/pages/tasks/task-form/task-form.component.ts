import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Task } from '../../../models/types';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  isEdit = false;
  taskId: number | null = null;
  projectId!: number;

  model: Partial<Task> = {
    title: '',
    description: '',
    status: 'To Do',
    assignedTo: undefined,
    dueDate: ''
  };

  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const findProjectId = () => {
      let r: ActivatedRoute | null = this.route;
      while (r) {
        const v = r.snapshot.paramMap.get('id');
        if (v) return Number(v);
        r = r.parent as ActivatedRoute | null;
      }
      return NaN;
    };

    this.projectId = findProjectId();
    this.userService.getUsers().subscribe(u => (this.users = u));

    const tid = this.route.snapshot.paramMap.get('taskId');
    if (tid) {
      this.isEdit = true;
      this.taskId = Number(tid);
      this.load(this.taskId);
    }
  }

  load(id: number) {
    this.taskService.getTask(id).subscribe(t => (this.model = t));
  }

  save() {
    const payload: Omit<Task, 'id'> = {
      projectId: this.projectId,
      title: this.model.title || '',
      description: this.model.description || '',
      status: (this.model.status as Task['status']) || 'To Do',
      assignedTo: (this.model.assignedTo as any) || null,
      dueDate: this.model.dueDate || ''
    };

    if (this.isEdit && this.taskId) {
      this.taskService.updateTask(this.taskId, payload).subscribe(() => this.router.navigate(['../'], { relativeTo: this.route }));
    } else {
      this.taskService.createTask(payload).subscribe(() => this.router.navigate(['../'], { relativeTo: this.route }));
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
