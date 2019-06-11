import * as THREE from 'three';

interface JsonData {
  ops: Point[];
  length: number;
}

export interface Point {
  l: number;
  t: number;
  x: number;
  y: number;
  z: number;
  event_type: string;
  voice: number;
}

export default class Data {
  public events!: Point[];
  public length!: number;
  public n: number;
  constructor() {
    this.n = 0;
  }
  public readJson = async (song: string): Promise<JsonData> => {
    const response = await fetch(`/songs/${song}.socool.json`);
    return response.json();
  };

  public async getData(song: string) {
    const jsonData = await this.readJson(song);
    this.events = jsonData.ops;
    this.length = jsonData.length;
  }

  public getPoints = (currentTime: number) => {
    let go = true;
    const points = [];
    while (go) {
      const point = this.events[this.n];
      if (point && point.t < currentTime) {
        points.push(point);
        this.n += 1;
      } else {
        go = false;
      }
    }
    return points;
  };

}
