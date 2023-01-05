export class Questions {
  id: number;
  question: string | null;
  topic: string | null;
  options: string;
  correct_option: string | null;
  time_in_minutes: number | null;
  duration: string | null;
  active: boolean | 0;
  locked: boolean | 0;
  is_correct: boolean | false;

  //additional properties
  selected_option: string | null;
}

export class Options {
  option: string;
  is_correct: boolean | null;
}

