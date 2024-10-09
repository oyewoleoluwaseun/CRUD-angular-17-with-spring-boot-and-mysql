import { Component, OnInit } from '@angular/core';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  loadingSearch = false; // Spinner for search button
  loadingPosts = true; // Spinner for loading posts list

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.loadingPosts = true; // Start the spinner when retrieving posts
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.loadingPosts = false; // Stop the spinner when data is received
        console.log(data);
      },
      error: (e) => {
        console.error(e);
        this.loadingPosts = false; // Stop the spinner even if there's an error
      },
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchTitle(): void {
    this.loadingSearch = true; // Start spinner and disable button
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data;
        this.loadingSearch = false; // Stop spinner and enable button
        console.log(data);
      },
      error: (e) => {
        console.error(e);
        this.loadingSearch = false; // Stop spinner and enable button even if there's an error
      },
    });
  }
}
