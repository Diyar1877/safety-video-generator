import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModuleListComponent } from './shared/module-list/module-list.component';

const BACKEND = 'https://safety-video-backend.onrender.com';
const INTRO = `${BACKEND}/safety-videos-mp4/00-basis+anfang.mp4`;
const OUTRO = `${BACKEND}/safety-videos-mp4/14-Ende.mp4`;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, ModuleListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(ModuleListComponent) moduleList!: ModuleListComponent;

  private cdr = inject(ChangeDetectorRef);

  playlist: { src: string; label: string }[] = [];
  currentIndex = 0;
  playerVisible = false;
  merging = false;

  get currentLabel(): string {
    return this.playlist[this.currentIndex]?.label ?? '';
  }

  get hasNext(): boolean {
    return this.currentIndex < this.playlist.length - 1;
  }

  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  skipPrev(): void {
    if (this.hasPrev) {
      this.playAt(this.currentIndex - 1);
    }
  }

  generatePlaylist(): void {
    const selected = this.moduleList.modules
      .filter(m => m.enabled && m.file !== null)
      .map(m => ({ src: `${BACKEND}/safety-videos-mp4/${m.file}`, label: m.label }));

    this.playlist = [
      { src: INTRO, label: 'Intro' },
      ...selected,
      { src: OUTRO, label: 'Outro' },
    ];
    this.currentIndex = 0;
    this.playerVisible = true;

    setTimeout(() => {
      this.videoPlayer.nativeElement.src = this.playlist[0].src;
      this.videoPlayer.nativeElement.play();
    });
  }

  playAt(index: number): void {
    if (index < this.playlist.length) {
      this.currentIndex = index;
      this.videoPlayer.nativeElement.src = this.playlist[index].src;
      this.videoPlayer.nativeElement.play();
    }
  }

  onVideoEnded(): void {
    if (this.hasNext) {
      this.playAt(this.currentIndex + 1);
    }
  }

  skipNext(): void {
    if (this.hasNext) {
      this.playAt(this.currentIndex + 1);
    }
  }

  async downloadMerged(): Promise<void> {
    if (this.merging || this.playlist.length === 0) return;

    this.merging = true;
    this.cdr.detectChanges();

    try {
      const files = this.playlist.map(p => {
        const parts = p.src.split('/');
        return parts[parts.length - 1];
      });

      const backendUrl = false
        ? 'http://localhost:5000'
        : `https://safety-video-backend.onrender.com`;

      const response = await fetch(`${backendUrl}/api/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server-Fehler');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'safety2-praesentation.mp4';
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Fehler beim Download:', error);
      alert('Fehler beim Zusammenfügen. Läuft das Backend? (backend/.venv/bin/python backend/app.py)');
    } finally {
      this.merging = false;
      this.cdr.detectChanges();
    }
  }
}
