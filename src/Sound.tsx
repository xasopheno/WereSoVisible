export default class Sound {
  private audio!: HTMLAudioElement;
  constructor(song: string) {
    try {
      const audioPath = `http://${
        process.env.SERVER_LOCATION
      }/api/songs/${song}.mp3?${Math.random()}`;
      this.audio = new Audio(audioPath);
    } catch (err) {
      this.audio = new Audio();
    }
  }

  public fadeOut = () => {
    if (this.audio.volume > 0.01) {
      this.audio.volume -= 0.01;
      setTimeout(this.fadeOut, 1);
    } else {
      this.audio.pause();
    }
  };
  public play = () => {
    this.audio.play();
  };

  public pause = () => {
    this.audio.pause();
  };
}
