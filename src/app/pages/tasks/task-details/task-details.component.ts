import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/types';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  taskId!: number;
  task: Task | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    const tid = this.route.snapshot.paramMap.get('taskId') || this.route.snapshot.paramMap.get('id');
    if (tid) {
      this.taskId = Number(tid);
      this.load(this.taskId);
    }
  }

  load(id: number) {
    this.taskService.getTask(id).subscribe(t => (this.task = t));
  }

  deleteTask() {
    if (!this.task?.id) return;
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(this.task.id).subscribe(() => this.router.navigate(['../'], { relativeTo: this.route }));
  }
}
