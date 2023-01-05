export class Answer {
  id: number | null;
  user_id: number | null;
  question_id: number | null;
  user_name: string | null;
  question: string | null;
  selected_option: string | null;
  is_correct: boolean | null;
  quiz_reference: string | null;
}

export class QuizSummary {
  quiz_reference: number | null;
  total_question: number | null;
  correct: number | null;
  wrong: number | null;
}
