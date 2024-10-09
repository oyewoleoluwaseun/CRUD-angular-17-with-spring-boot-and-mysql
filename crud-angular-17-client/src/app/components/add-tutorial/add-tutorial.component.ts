import { Component } from '@angular/core';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent {
  tutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;
  loading = false; // Loading state for the button and spinner

  constructor(private tutorialService: TutorialService) {}

  saveTutorial(): void {
    this.loading = true; // Set loading to true when the request starts
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        this.loading = false; // Set loading to false when the request finishes
      },
      error: (e) => {
        console.error(e);
        this.loading = false; // Set loading to false if there is an error
      }
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false
    };
  }
}
