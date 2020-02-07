import axios from 'axios';

export interface JsonData {
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
    const jsonPath = `http://0.0.0.0:8000/api/songs/${song}.socool.json`;
    try {
      const response = await axios.get(jsonPath);
      return response.data;
    } catch (err) {
      return { ops: [], length: 0 };
    }
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
