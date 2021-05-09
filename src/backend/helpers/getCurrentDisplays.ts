import { screen } from "electron";

export interface DetectedDisplay {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const getCurrentDisplays = async (): Promise<DetectedDisplay[]> =>
  screen.getAllDisplays().map((display) => ({
    id: `${display.id}`,
    // added -1 to solve black window issue
    x: display.workArea.x - 1,
    y: display.workArea.y - 1,
    width: display.workArea.width,
    height: display.workArea.height,
  }));

export default getCurrentDisplays;
