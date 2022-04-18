import {
  FRAME_KEYS,
  IFrame,
  FRAME_COMPONENT_KEY,
  generateFrameComponent,
} from './framework';
import { generateQuestion, INPUT_TYPE } from './engine.survey';

export const SUCCESS = true;
export const FAILURE = null;

// export let error = {
//   error: false,
//   Code: 0,
//   message: 'SUCCESS',
// };

export const FRAME_PRESETS: Record<FRAME_KEYS, IFrame> = {
  [FRAME_KEYS.PRE_START]: {
    components: [
      // generateFrameComponent(FRAME_COMPONENT_KEY.STATIC, {
      //   intro: 'first text in the page...',
      // }),
      generateFrameComponent(FRAME_COMPONENT_KEY.INPUT, {
        type: INPUT_TYPE.BOOLEAN,
        intro: 'Click This Button to begin the program',
        link: './buybuy',
        question: generateQuestion(INPUT_TYPE.BOOLEAN, {
          /** question conf object */
        }),
        handler: args => args,
      }),
    ],
  },
  [FRAME_KEYS.NO_FRAME]: { components: [] },
  [FRAME_KEYS.SELECT]: { components: [] },
  [FRAME_KEYS.MULTISELECT]: { components: [] },
};

const buildDialogStep = (title, survey?) => ({
  title,
  survey,
});
