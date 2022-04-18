import { CPU } from './base.cpu';
import { ProgramEngine, IProgram, IStep } from './engine.program';
import { INPUT_TYPE, IQuestion, ISurvey } from './engine.survey';
import { FAILURE, SUCCESS, FRAME_PRESETS } from './shared';

export enum FRAME_KEYS {
  PRE_START = 'PRE_START',
  NO_FRAME = 'NO_FRAME',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}
export enum FRAME_COMPONENT_KEY {
  HEADER = 'HEADER',
  PARAGRAPH = 'PARAGRAPH',
  BUTTON = 'BUTTON',
  BUTTON_GROUP = 'BUTTON_GROUP',
  INPUT = 'INPUT',
  LINK = 'LINK',
}
export enum COMPONENT_OP_KEY {
  NOP = 'NOP',
  START_PROGRAM = 'START_PROGRAM',
  VIEW_NEXT_FRAME = 'VIEW_NEXT_FRAME',
  VIEW_PREVIOUS_FRAME = 'VIEW_PREVIOUS_FRAME',
  VIEW_ACTIVE_FRAME = 'VIEW_ACTIVE_FRAME',
  COMPLETE_FRAME = 'COMPLETE_FRAME',
}

export interface IView {
  id?: string;
  conf?: any;
  frames: IFrame[];
}

export interface IFrame {
  components: IFrameComponent[];
}

export interface IFrameComponent {
  // view component as provided to client device
  idx?: number;
  type?: FRAME_COMPONENT_KEY;
  header?: string | object | object[];
  body?: string | object | object[];
  footer?: string | object | object[];
  handler?: (x) => {};
}

// export interface IBaseConfComponent {
//   isVisible?: boolean;
//   handler?: (x: any) => {};
// }
// export interface IBaseConfComponent {
//   type: FRAME_COMPONENT_KEY;
//   conf: any;
// }
// export interface IConfStaticComponent {}
// export interface IConfInputComponent extends IBaseConfComponent {
//   question?: IQuestion;
//   survey?: ISurvey;
// }

export const generateFrameComponent = (
  type: FRAME_COMPONENT_KEY,
  conf: any,
): IFrameComponent => {
  switch (true) {
    case type === FRAME_COMPONENT_KEY.INPUT: {
      return {
        type,
        // conf: conf,
        //implement convert to component conf ,
        // : {
        //   question: {
        //     type: INPUT_TYPE.BOOLEAN,
        //     conf: {} as IConfInputQuestion,
        //   } as IQuestion,
        // },
      };
    }
  }
};

/** Framework main goals are to generate view framework ( by parsing ProgramEngine steps ) and
 * provide APIs to GUI host (ie. react, react native, html ...).
 * main APIs are: activateFramework, getFrame, completeFrame
 */
export class Framework extends CPU {
  program: ProgramEngine = null;

  constructor() {
    super({}, []);
  }

  activateFramework(programPreset: IProgram) {
    if (this.program) return FAILURE; // already active

    this.program = new ProgramEngine(programPreset,programPreset.steps);
    const steps = this.program.getAllSteps();
    const frames = steps.flatMap(step => this.stepToFrames(step));

    this.baseInit(frames);
    return SUCCESS;
  }

  getFrame(): IFrame {
    let frame = this.baseItemGet();
    // implement
    return frame ? frame : FRAME_PRESETS.PRE_START;
  }

  getFrameByIndex({ idx }: { idx: number }): IFrame {
    let frame = this.baseItemGetByIndex(idx);
    if (frame) return FAILURE;
    return frame;
  }

  handleFrame(payload): boolean {
    // implement
    // should verify step condition
    const completed = this.program.handleStep(payload);
    if (!completed) return FAILURE;
    this.baseIndexIncrease();
    return SUCCESS;
  }

  componentHandler(componentId: number, payload: any) {
    const frame: IFrame = this.getFrame();
    const component: IFrameComponent = frame.components[componentId];

    const validated = Framework.validateComponentResponse(component, payload);
    if (!validated) {
      // example push modal component with error message
    }

    switch (payload.type) {
      case COMPONENT_OP_KEY.NOP: {
        return true;
      }
      case COMPONENT_OP_KEY.START_PROGRAM: {
        this.activateFramework(payload.conf);
      }
      case COMPONENT_OP_KEY.COMPLETE_FRAME: {
        this.handleFrame(payload);
      }
      case COMPONENT_OP_KEY.VIEW_NEXT_FRAME: {
        return this.getFrameByIndex(payload);
      }
      case COMPONENT_OP_KEY.VIEW_PREVIOUS_FRAME: {
        return this.getFrameByIndex(payload);
      }
      case COMPONENT_OP_KEY.VIEW_ACTIVE_FRAME: {
        return this.getFrame();
      }
    }

    // if (component.type === FRAME_COMPONENT_KEY.INPUT) {
    // switch (component.conf.question.type) {
    // case INPUT_TYPE.BOOLEAN: {
    // component.conf.handler({ payload });
    // code for when payload true/false
    // ie. a button should activate a program
    // }
    // default: {
    // generate error component and return
    // }
    // }
    // const comp: IConfInputComponent = null;
    return SUCCESS;
    // }
    // return FAILURE; // only input component can be triggerd
  }

  stepToFrames(step: IStep): IFrame[] {
    const { header, body, CTA, survey } = step;
    const components: IFrameComponent[] = [];

    const surveyToFrames = (survey: ISurvey): IFrame[] => {
      const questionToSingleFrame = (question: IQuestion): IFrame => {
        const { type, intro, options } = question;
        const components: IFrameComponent[] = [];

        if (intro) {
          components.push({
            type: FRAME_COMPONENT_KEY.HEADER,
            body: intro,
          });
        }
        switch (type) {
          case INPUT_TYPE.NUMBER:
          case INPUT_TYPE.TEXT: {
            components.push({
              type: FRAME_COMPONENT_KEY.INPUT,
            });
            break;
          }
          case INPUT_TYPE.BOOLEAN: {
            components.push({
              type: FRAME_COMPONENT_KEY.BUTTON,
            });
            break;
          }
          case INPUT_TYPE.SELECT:
          case INPUT_TYPE.MULTISELECT: {
            components.push({
              type: FRAME_COMPONENT_KEY.BUTTON_GROUP,
              body: options,
            });
            break;
          }
        }
        const frame: IFrame = { components };
        return frame;
      };

      if (!survey?.questions?.length) return FAILURE;

      const surveyFrames = [];

      survey.questions.forEach(question =>
        surveyFrames.push(questionToSingleFrame(question)),
      );
    };

    if (header) {
      components.push({
        type: FRAME_COMPONENT_KEY.HEADER,
        header,
      });
    }

    if (body) {
      components.push({
        type: FRAME_COMPONENT_KEY.PARAGRAPH,
        body,
      });
    }
    if (CTA) {
      components.push({
        type: FRAME_COMPONENT_KEY.LINK,
        body,
      });
    }

    const firstFrame = { components };
    const surveyFrames = surveyToFrames(survey);

    return [firstFrame, ...surveyFrames];
  }

  static validateComponentResponse(component: IFrameComponent, y) {
    // component.conf.
    return true;
  }
}
