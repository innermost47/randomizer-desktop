export class Track {
  constructor() {
    this.title = "untitled";
    this.defaultTitle = "untitled";
    this.settings = {};
  }

  saveTrack(track) {
    localStorage.setItem(this.title, track);
  }

  deleteTrack(track) {
    localStorage.removeItem(track);
  }
}
