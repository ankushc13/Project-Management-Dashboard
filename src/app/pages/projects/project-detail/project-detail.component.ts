import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/types';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  projectId: number | null = null;
  project: Project | null = null;
  loading = false;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = parseInt(id, 10);
        this.loadProject(this.projectId);
      }
    });
  }

  loadProject(id: number) {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (p) => {
        this.project = p;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Failed to load project: ' + (err?.message || err));
      }
    });
  }
}
