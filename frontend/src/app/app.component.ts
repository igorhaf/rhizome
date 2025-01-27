import { Component, inject, OnInit, Type } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
//import { AddCompDynDirective } from './add-comp-dyn.directive';
import { HeaderComponent } from './header/header.component';
import { LeftpaneComponent } from './leftpane/leftpane.component';
import { MainComponent } from './main/main.component';
import { RightpaneComponent } from './rightpane/rightpane.component';
import { FooterComponent } from './footer/footer.component';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderComponent,
    LeftpaneComponent,
    MainComponent,
    RightpaneComponent,
    FooterComponent,
    //AddCompDynDirective,
    //RouterOutlet,
    AngularSplitModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  
  private isDragging = false;

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging) return;

    const container = document.querySelector('.split-container') as HTMLElement;
    const leftPane = document.getElementById('left-pane') as HTMLElement;
    const rightPane = document.getElementById('right-pane') as HTMLElement;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = event.clientX - containerRect.left;

    leftPane.style.flex = `0 0 ${newLeftWidth}px`;
    rightPane.style.flex = `1 1 auto`;
  };

  onMouseUp = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}