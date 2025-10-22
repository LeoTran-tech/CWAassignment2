export interface Question {
    id?: number;
    topic: string;
    question: string;
    hint: string;
    answer: string;
}

export interface ObjectItem {
    src: string;
    action: 'question' | 'hint' | 'if correct' | 'answer';
}
