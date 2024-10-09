import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };

  message = '';
  loadingUpdate = false; // Loading state for update action
  loadingDelete = false; // Loading state for delete action
  loadingPublish = false; // Loading state for publish/unpublish action

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(status: boolean): void {
    this.loadingPublish = true; // Start loading for publish/unpublish
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentTutorial.published = status;
        this.message = res.message
          ? res.message
          : 'The status was updated successfully!';
        this.loadingPublish = false; // Stop loading
      },
      error: (e) => {
        console.error(e);
        this.loadingPublish = false; // Stop loading on error
      }
    });
  }

  updateTutorial(): void {
    this.loadingUpdate = true; // Start loading for update
    this.message = '';

    this.tutorialService
      .update(this.currentTutorial.id, this.currentTutorial)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';
          this.loadingUpdate = false; // Stop loading
        },
        error: (e) => {
          console.error(e);
          this.loadingUpdate = false; // Stop loading on error
        }
      });
  }

  deleteTutorial(): void {
    this.loadingDelete = true; // Start loading for delete
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
        this.loadingDelete = false; // Stop loading after delete
      },
      error: (e) => {
        console.error(e);
        this.loadingDelete = false; // Stop loading on error
      }
    });
  }
}
