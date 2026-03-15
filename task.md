The frontend of the Safety video generator is already built with Angular.

Now we need to implement the video playlist logic using Angular and TypeScript.

This is a local prototype.

---

VIDEO STORAGE

All video files are stored in:

/home/diyar/code/safety-video-generator/public/safety-videos

These files are served as static files and accessible from the browser via:

/safety-videos/<filename>

---

VIDEO FILES

Intro:
00-basis-anfang.MOV

Outro:
14-Ende.MOV

Module videos:

01-Beobachtung.MOV
02-Audit-Begehung.MOV
03-GBU.MOV
04-Betriebanweisung.MOV
05-Unterweisung.MOV
06-Qualification.MOV
07-Unfallmanagement.MOV
08-Arbeit-Medizinische-Vorsorge.MOV
09-Prüf-Wartung.MOV
10-Fremdfirma.MOV
11-Massnahmen.MOV
12-Gefahrstoffe.MOV
13-Monitoring.MOV

---

GOAL

When the user selects modules with the toggle switches and clicks:

"Video erstellen"

the system should build a playlist.

The playlist must follow this structure:

intro video

* selected modules in their natural order
* outro video

---

IMPORTANT RULE

The module order must always remain fixed.

Example:

User selects:

Gefährdungsbeurteilung
Maßnahmen
Monitoring

Generated playlist:

/safety-videos/00-basis-anfang.MOV
/safety-videos/03-GBU.MOV
/safety-videos/11-Massnahmen.MOV
/safety-videos/13-Monitoring.MOV
/safety-videos/14-Ende.MOV

---

IMPLEMENTATION REQUIREMENTS

Implement this using Angular best practices.

1. Create a module-to-video mapping in the component TypeScript.

Example structure:

modules = [
{
name: "Beobachtung",
file: "01-Beobachtung.MOV",
selected: false
},
...
]

2. When the user clicks "Video erstellen":

Generate a playlist array.

Example:

playlist: string[] = [];

3. Playlist generation logic:

playlist = [
"/safety-videos/00-basis-anfang.MOV",
...selected module videos,
"/safety-videos/14-Ende.MOV"
]

4. Video player logic

Use the HTML5 video element.

When a video ends:

Automatically load the next video in the playlist.

Use the "ended" event.

5. Angular integration

The video player should be inside the component template.

Use:

<video #videoPlayer controls></video>

Control it from the component using ViewChild.

---

DELIVER

Please generate:

1. Angular component TypeScript code
2. HTML template for the video player
3. Playlist generation logic
4. Event listener for auto-playing the next video
5. Clean Angular structure

Keep the implementation simple because this is only a prototype demo.
