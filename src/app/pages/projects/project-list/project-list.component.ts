import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/types';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = null;
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load projects';
        this.loading = false;
      }
    });
  }

  deleteProject(id: number) {
    if (!confirm('Delete this project?')) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => this.loadProjects(),
      error: (err) => alert('Delete failed: ' + (err?.message || err))
    });
  }
}
