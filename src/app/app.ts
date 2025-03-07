import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModuleListComponent } from './shared/module-list/module-list.component';
import { ContactDialogComponent } from './shared/contact-dialog/contact-dialog.component';
import { environment } from '../environments/environment.development';

const BACKEND = environment.backendUrl;
const INTRO = `${BACKEND}/safety-videos-mp4/00-basis+anfang.mp4`;
const OUTRO = `${BACKEND}/safety-videos-mp4/14-Ende.mp4`;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatDialogModule, ModuleListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(ModuleListComponent) moduleList!: ModuleListComponent;

  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

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

  openContactDialog(): void {
    const enabledNames = this.moduleList.modules
      .filter(m => m.enabled)
      .map(m => m.name);

    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '680px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'contact-dialog-panel',
      autoFocus: false,
      data: { enabledModules: enabledNames },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Kontaktformular gesendet:', result);
        alert('Vielen Dank! Wir melden uns bei Ihnen.');
      }
    });
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
      const video = this.videoPlayer.nativeElement;
      const wasFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (video as any).webkitDisplayingFullscreen
      );

      if (wasFullscreen) {
        // iOS native Fullscreen: verlassen, neu laden, wieder rein
        (video as any).webkitExitFullscreen?.() || document.exitFullscreen?.();
        setTimeout(() => {
          video.src = this.playlist[index].src;
          video.load();
          video.addEventListener('loadedmetadata', () => {
            video.play();
            (video as any).webkitEnterFullscreen?.() || video.requestFullscreen?.();
          }, { once: true });
        }, 300);
      } else {
        video.src = this.playlist[index].src;
        video.load();
        video.play();
      }
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

      const backendUrl = BACKEND;

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
      a.download = 'safety2-Präsentation.mp4';
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Fehler beim Download:', error);
      alert('Fehler beim Zusammenfügen.');
    } finally {
      this.merging = false;
      this.cdr.detectChanges();
    }
  }
}
