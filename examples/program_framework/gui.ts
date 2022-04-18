import { CPU } from './base.cpu';
import { Framework, IFrame, IFrameComponent } from './framework';
import { IProgram } from './engine.program';
import { ISurvey, IQuestionResult } from './engine.survey';

export type IClientFrame = IFrame;

export class GUI extends CPU {
  program: Framework = null;
  tab = null;

  constructor() {
    super({}, []);
    this.program = new Framework();
  }

  start() {
    const frame = this.program.getFrame();
    const clientFrame = this.buildClientFrame(frame);
    // parse clientFrame in GUI
    const handlerResult = this.program.componentHandler(1,true);
    
  }
  getFrame() {
    const frame = this.program.getFrame();
    return this.buildClientFrame(frame);
  }

  buildClientFrame(frame: IFrame): IClientFrame {
    return frame;
  }

  actOnFrame(idx: number, payload) {
    const result = this.program.componentHandler(idx, payload);
  }
}
