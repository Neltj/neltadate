export type FlowPhase = 'quiz' | 'decision' | 'availability' | 'summary' | 'declined';

export type Decision = 'accepted' | 'declined' | null;

export type LocalDateTime = string;

export type QuestionCategory = 'general' | 'food' | 'venue';

export interface QuizOption {
  readonly id: string;
  readonly label: string;
  readonly reaction: string;
  /** Used by the completion summary only; it never changes quiz navigation. */
  readonly skipsCategory?: boolean;
}

export interface QuizQuestion {
  readonly id: string;
  readonly category: QuestionCategory;
  readonly prompt: string;
  readonly options: readonly QuizOption[];
}

export type QuizAnswers = Readonly<Record<string, string>>;

interface BaseFlowState {
  readonly answers: QuizAnswers;
}

export interface QuizFlowState extends BaseFlowState {
  readonly phase: 'quiz';
  readonly currentQuestionIndex: number;
  readonly decision: null;
  readonly selectedDateTimes: readonly LocalDateTime[];
  readonly preferredDateTime: LocalDateTime | null;
}

export interface DecisionFlowState extends BaseFlowState {
  readonly phase: 'decision';
  readonly decision: null;
  readonly selectedDateTimes: readonly LocalDateTime[];
  readonly preferredDateTime: LocalDateTime | null;
}

export interface AvailabilityFlowState extends BaseFlowState {
  readonly phase: 'availability';
  readonly decision: 'accepted';
  readonly selectedDateTimes: readonly LocalDateTime[];
  readonly preferredDateTime: LocalDateTime | null;
}

export interface SummaryFlowState extends BaseFlowState {
  readonly phase: 'summary';
  readonly decision: 'accepted';
  readonly selectedDateTimes: readonly LocalDateTime[];
  readonly preferredDateTime: LocalDateTime | null;
}

export interface DeclinedFlowState extends BaseFlowState {
  readonly phase: 'declined';
  readonly decision: 'declined';
  readonly selectedDateTimes: readonly [];
  readonly preferredDateTime: null;
}

export type DateQuizFlowState =
  QuizFlowState | DecisionFlowState | AvailabilityFlowState | SummaryFlowState | DeclinedFlowState;

export interface DateQuizCommands {
  answer(questionId: string, optionId: string): boolean;
  back(): boolean;
  continueQuiz(): boolean;
  decide(decision: Exclude<Decision, null>): boolean;
  addOrToggleDateTime(value: string): boolean;
  removeDateTime(value: LocalDateTime): boolean;
  setPreferredDateTime(value: LocalDateTime): boolean;
  complete(): boolean;
  reset(): void;
}
