import { CPU } from './base.cpu';
import { FAILURE, SUCCESS } from './shared';

export enum INPUT_TYPE {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}
export enum NEXT_STEP_INSTRUCTION {
  NEXT = 'NEXT',
}

export interface ISurvey {
  id?: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id?: string;
  type: INPUT_TYPE;
  intro?: string;
  options?: {
    key: string; // option unique name
    intro: string; // text as displayed to user
  }[];
  min?: number;
  max?: number;
  maxLength?: number;
  isRequired?: boolean;
  nextStep?: (question: IQuestion, answer: TAnswer) => NEXT_STEP_INSTRUCTION;
}

export const generateQuestion = (type: INPUT_TYPE, conf?: any): IQuestion => {
  switch (true) {
    case type === INPUT_TYPE.BOOLEAN: {
      return {
        type,
        ...conf, //todo remove it is an example
      };
    }
  }
};

type TAnswer = { questionIdx: number; payload: any };

export class SurveyEngine extends CPU {
  answers: TAnswer[] = null;

  constructor(survey: ISurvey) {
    super({ ...survey, idx: 0 }, survey.questions);
    // this.baseItemsSet(survey.questions);
    // survey.questions = undefined;
    // this.baseConfSet({ ...survey });
  }

  getQuestion() {
    return this.baseItemGet();
  }

  getAllQuestions() {
    return this.baseCollectionGet;
  }

  getAllAnswers(): TAnswer[] {
    return this.answers;
  }

  handleQuestion(payload: any): boolean {
    const question: IQuestion = this.baseItemGet();
    const questionIdx: number = this.baseIndexGet();

    if (!payload || !question) return FAILURE; // implement question-answer validator

    //here can call a function based on question setup

    const answer: TAnswer = { questionIdx, payload };
    this.answers.push(answer);

    const nextStep = question.nextStep(question, answer);

    const newStepIndex = this.baseIndexIncrease();
    const done = this.isCompleted();

    return SUCCESS;
  }

  isCompleted() {
    return true;
  }
}

const SURVEY_EXAMPLE: ISurvey = {
  questions: [
    {
      type: INPUT_TYPE.SELECT,
      intro: 'gender',
      options: [
        { key: 'MAN', intro: 'Man' },
        { key: 'WOMAN', intro: 'Woman' },
      ],
    },
    {
      type: INPUT_TYPE.NUMBER,
      intro: 'age',
      min: 16,
      max: 150,
      nextStep: (question: IQuestion, answer: TAnswer) => {
        return NEXT_STEP_INSTRUCTION.NEXT;
      },
    },
  ],
};

export class SurveyEngineTest {
  surveyEngine: SurveyEngine = null;
  surveyPreset: ISurvey;

  init() {
    // this.programEngine = new ProgramEngine(
    //   { ...this.PROGRAM },
    //   this.PROGRAM.steps,
    // );

    const question = this.surveyEngine.getQuestion();
    const answerStatus = this.surveyEngine.handleQuestion({
      /** solution payload goes here */
    });
    console.log('status: ', answerStatus, 'question: ', question);
  }
}
