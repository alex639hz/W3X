import { FAILURE, SUCCESS } from './shared';
import { CPU } from './base.cpu';
import { ISurvey } from './engine.survey';

export interface IProgram {
  id?: string;
  steps: IStep[];
}

export type IStep = {
  header?: string;
  body?: string;
  CTA?: string;
  survey?: ISurvey;
  isRequired?: boolean;
  isCompleted?: boolean;
  solution?:solution;
  nextStep?:(step:IStep)=>{};
};


type solution = { stepIdx: number; payload: any };

export class ProgramEngine extends CPU {
  
  constructor(conf,steps) {
    super(conf , steps);
  }

  getStep(): IStep {
    return this.baseItemGet();
  }

  getAllSteps(): IStep[] {
    return this.baseCollectionGet();
  }

  isCompleted() {
    return true;
  }

  getAllSolutions() {
    return this.baseSolversGet();
  }

  handleStep(payload: any): boolean {
    const step = this.baseItemGet();
    const stepIdx: number = this.baseIndexGet();

    if (!payload || !step) return FAILURE; // implement step-solution validator

    const solution: solution = { stepIdx, payload };
    // this.solutions.push(solution);
    
    const newStepIndex = this.baseSolverPush(solution);
    const done = this.isCompleted();

    return SUCCESS;
  }

  static generateStep(step: IStep): IStep {
    return { ...step };
  }
}
export class ProgramEngineTest {
  programEngine: ProgramEngine = null;
  programPreset: IProgram;
  PROGRAM: IProgram = {
    steps: [
      ProgramEngine.generateStep({
        header: 'header text',
        body: 'body text',
      } as IStep),
      ProgramEngine.generateStep({
        header: 'header text',
        body: 'body text',
        survey: {} as ISurvey,
      } as IStep),
    ] as IStep[],
  };

  init() {
    // this.programEngine = new ProgramEngine(
    //   { ...this.PROGRAM },
    //   this.PROGRAM.steps,
    // );

    const step = this.programEngine.getStep();
    const stepResult = this.programEngine.handleStep({
      /** solution payload goes here */
    });
    console.log('step: ', step, 'result: ', stepResult);
  }
}
