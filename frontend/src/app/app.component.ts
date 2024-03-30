import { Component } from '@angular/core';
import { SearchService } from './search.service';
import Typewriter from 'typewriter-effect/dist/core'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  constructor(private searchService: SearchService) {} 
  searchQuery: string = '';
  isNightMode: boolean = false;
  isAPIMode: boolean = false;
  searchResult: string = '';
  isLoading: boolean = false;
  useRetriever: boolean = true
  context: string = '';
  private searchSubscription: Subscription | undefined;

onSearch(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.searchQuery == ""){
      return
    } else {
      /*const searchQueryWithContext = this.context + " Current Question: " + this.searchQuery*/
      const searchQueryWithContext = this.context + " : " + this.searchQuery
      console.log('Searching for:', searchQueryWithContext);
      this.isLoading = true;
      this.searchResult = "";
      if (this.useRetriever==true){
        this.searchSubscription = this.searchService.search(searchQueryWithContext).subscribe(
          (response) => {
            console.log('Search results:', response["result"]);
            if (response["result"] && response["result"].length > 0) {
             /*this.context += " Previous Prompt: " + this.searchQuery + " Answer: " + response["result"];*/
              this.context += " " + this.searchQuery + " : " + response["result"]
              this.searchResult = this.formatResponse(response['result']);
              this.isLoading = false;
              this.updateResponse(this.searchResult)
            } else {
              this.searchResult = '';
              console.log('No results found.');
            }
          },
          (error) => {
            console.error('Search error:', error);
          }
        );
      } else {
        this.searchSubscription = this.searchService.gsearch(searchQueryWithContext).subscribe(
          (response) => {
            console.log('Search results:', response["result"]);
            if (response["result"] && response["result"].length > 0) {
              /*this.context += " Previous Prompt: " + this.searchQuery + " Answer: " + response["result"];*/
              this.context += " " + this.searchQuery + " : " + response["result"]
              this.searchResult = this.formatResponse(response['result']);
              this.isLoading = false;
              this.updateResponse(this.searchResult)
            } else {
              this.searchResult = '';
              console.log('No results found.');
            }
          },
          (error) => {
            console.error('Search error:', error);
          }
        );
      }
    } 
  }

  formatResponse(response: string): string {
    // Regular expression to find numberings followed by a period or a parenthesis
    const regex = /(\s|^)(\d{1,2}(?!\.\d)\.)/g;
    return response.replace(regex, (match) => `<br><br>${match}`);
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  resetHome(): void {
    this.clearSearch()
    this.searchResult = '' 
    this.isLoading = false;
    this.context = ''
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onEnterKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  toggleNightMode(): void {
    this.isNightMode = !this.isNightMode;
    const body = document.getElementsByTagName('body')[0];
    if (this.isNightMode) {
      body.classList.add('night-mode');
    } else {
      body.classList.remove('night-mode');
    }
  }

  updateResponse(response: string): void {
    if (!response) return;

    const typewriter = new Typewriter('#responseContainer', {
      loop: false,
      delay: 10,
    });

    typewriter
      .deleteAll('natural')
      .pauseFor(30)
      .typeString(response)
      .start();
  }

  switchAPI(): void {
    this.useRetriever = !this.useRetriever
    this.context = ''
    console.log('Switching API...');
  }

  /*
  getModeButtonLabel(): string {
    return this.isNightMode ? 'Day' : 'Night';
  }
  */

  getAPIButtonLabel(): string {
    return this.useRetriever ? 'startupGPT' : 'generalGPT';
  }
}

