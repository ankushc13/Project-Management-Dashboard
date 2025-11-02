import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/types';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  isEdit = false;
  projectId: number | null = null;

  model = {
    name: '',
    description: '',
    status: 'Active',
    startDate: '',
    endDate: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private projectService: ProjectService) {
    
    
    const findId = () => {
      let r: ActivatedRoute | null = this.route;
      while (r) {
        const val = r.snapshot.paramMap.get('id');
        if (val !== null && val !== undefined) return val;
        r = r.parent as ActivatedRoute | null;
      }
      return null;
    };
    
    const snapId = findId();
    if (snapId) {
      const n = Number(snapId);
      if (!Number.isNaN(n)) {
        this.isEdit = true;
        this.projectId = n;
        this.loadProject(this.projectId);
      } else {
        console.warn('[ProjectForm] invalid id in route snapshot:', snapId);
      }
    }
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const n = Number(id);
        if (!Number.isNaN(n)) {
          this.isEdit = true;
          this.projectId = n;
          this.loadProject(this.projectId);
        } else {
          console.warn('[ProjectForm] invalid id from paramMap subscription:', id);
        }
      }
    });
  }

  loadProject(id: number) {
    this.projectService.getProject(id).subscribe({
      next: (p: Project) => {
        this.model = {
          name: p.name || '',
          description: p.description || '',
          status: p.status || 'Active',
          startDate: p.startDate || '',
          endDate: p.endDate || ''
        };
      },
      error: (err) => alert('Failed to load project: ' + (err?.message || err))
    });
  }

  save() {
    const payload: Omit<Project, 'id'> = {
      name: this.model.name,
      description: this.model.description,
      status: this.model.status as Project['status'],
      startDate: this.model.startDate,
      endDate: this.model.endDate,
      
      members: []
    };

    if (this.isEdit && this.projectId) {
      this.projectService.updateProject(this.projectId, payload).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => alert('Update failed: ' + (err?.message || err))
      });
    } else {
      this.projectService.createProject(payload as Omit<Project, 'id'>).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => alert('Create failed: ' + (err?.message || err))
      });
    }
  }
}
