export interface Render {
  l_buffer: Float32Array;
  r_buffer: Float32Array;
}

export interface RenderError {
  message: string;
  line: number;
  column: number;
}
