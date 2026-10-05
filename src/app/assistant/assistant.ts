import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

type FieldKey =
  | 'name'
  | 'age'
  | 'height'
  | 'weight'
  | 'goal'
  | 'gym'
  | 'difficulty';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface Step {
  key: FieldKey;
  question: string;
  placeholder: string;
  inputType: 'text' | 'number';
  options?: string[];
  /** When true, free typing is hidden unless the user picks "Outro". */
  preferOptions?: boolean;
  validate: (value: string) => string | null;
}

const WHATSAPP_NUMBER = '555185679046';
const OTHER_LABEL = 'Outro';

@Component({
  selector: 'app-assistant',
  imports: [],
  templateUrl: './assistant.html',
  styleUrl: './assistant.css',
})
export class Assistant {
  private readonly feedEl = viewChild<ElementRef<HTMLElement>>('chatFeed');
  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('composerInput');
  private messageId = 0;

  protected readonly open = signal(false);
  protected readonly started = signal(false);
  protected readonly finished = signal(false);
  protected readonly showCustomInput = signal(true);
  protected readonly stepIndex = signal(0);
  protected readonly draft = signal('');
  protected readonly error = signal('');
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly answers = signal<Partial<Record<FieldKey, string>>>({});
  protected readonly whatsappHref = signal('');

  protected readonly steps: Step[] = [
    {
      key: 'name',
      question:
        'Olá! Sou o Assistente DZ9 Performance. Qual é o seu nome?',
      placeholder: 'Seu nome',
      inputType: 'text',
      validate: (v) => (v.trim().length < 2 ? 'Informe seu nome.' : null),
    },
    {
      key: 'age',
      question: 'Qual a sua idade?',
      placeholder: 'Ex: 28',
      inputType: 'number',
      validate: (v) => {
        const n = Number(v);
        if (!Number.isFinite(n) || n < 14 || n > 90) return 'Informe uma idade entre 14 e 90.';
        return null;
      },
    },
    {
      key: 'height',
      question: 'Qual a sua altura em cm?',
      placeholder: 'Ex: 175',
      inputType: 'number',
      validate: (v) => {
        const n = Number(String(v).replace(',', '.'));
        if (!Number.isFinite(n) || n < 120 || n > 230) return 'Informe uma altura entre 120 e 230 cm.';
        return null;
      },
    },
    {
      key: 'weight',
      question: 'E o seu peso atual em kg?',
      placeholder: 'Ex: 80',
      inputType: 'number',
      validate: (v) => {
        const n = Number(String(v).replace(',', '.'));
        if (!Number.isFinite(n) || n < 30 || n > 250) return 'Informe um peso entre 30 e 250 kg.';
        return null;
      },
    },
    {
      key: 'goal',
      question: 'Qual é o seu objetivo principal?',
      placeholder: 'Seu objetivo',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Saúde',
        'Emagrecimento',
        'Hipertrofia',
        'Alto rendimento',
        'Recomposição',
        OTHER_LABEL,
      ],
      validate: (v) => (v.trim().length < 2 ? 'Escolha ou digite seu objetivo.' : null),
    },
    {
      key: 'gym',
      question: 'Em qual academia ou rede você deseja treinar?',
      placeholder: 'Nome da academia ou rede',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Smart Fit',
        'Bluefit',
        'Bodytech',
        'Bio Ritmo',
        'Selfit',
        'Academia particular',
        'Ainda não sei',
        OTHER_LABEL,
      ],
      validate: (v) => (v.trim().length < 2 ? 'Informe a academia ou rede.' : null),
    },
    {
      key: 'difficulty',
      question: 'Por último: qual é a sua maior dificuldade hoje?',
      placeholder: 'Sua maior dificuldade',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Consistência',
        'Alimentação',
        'Falta de tempo',
        'Técnica nos exercícios',
        'Motivação',
        'Lesão / dores',
        OTHER_LABEL,
      ],
      validate: (v) => (v.trim().length < 2 ? 'Conte qual é a maior dificuldade.' : null),
    },
  ];

  protected currentStep(): Step {
    return this.steps[this.stepIndex()];
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }

  openAssistant(): void {
    this.open.set(true);
    document.body.style.overflow = 'hidden';
    if (!this.started() || this.finished()) {
      this.begin();
    } else {
      this.scrollFeed();
      this.focusInput();
    }
  }

  close(): void {
    this.open.set(false);
    document.body.style.overflow = '';
  }

  begin(): void {
    this.started.set(true);
    this.finished.set(false);
    this.stepIndex.set(0);
    this.answers.set({});
    this.draft.set('');
    this.error.set('');
    this.whatsappHref.set('');
    this.showCustomInput.set(true);
    this.messages.set([this.botMessage(this.steps[0].question)]);
    this.syncInputVisibility();
    this.scrollFeed();
    this.focusInput();
  }

  pickOption(option: string): void {
    if (option === OTHER_LABEL) {
      this.showCustomInput.set(true);
      this.draft.set('');
      this.error.set('');
      this.focusInput();
      return;
    }

    this.draft.set(option);
    this.submitAnswer();
  }

  onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
    this.error.set('');
  }

  submitAnswer(): void {
    if (this.finished()) return;

    const step = this.currentStep();
    const raw = this.draft().trim();
    const normalized = this.normalizeValue(step.key, raw);
    const validationError = step.validate(normalized);

    if (validationError) {
      this.error.set(validationError);
      return;
    }

    const display =
      step.key === 'height'
        ? `${normalized} cm`
        : step.key === 'weight'
          ? `${normalized} kg`
          : normalized;

    const stored =
      step.key === 'height' || step.key === 'weight' ? normalized : display;

    this.answers.update((prev) => ({ ...prev, [step.key]: stored }));
    this.pushMessage({ role: 'user', text: display });
    this.draft.set('');
    this.error.set('');

    const next = this.stepIndex() + 1;
    if (next >= this.steps.length) {
      this.finish();
      return;
    }

    this.stepIndex.set(next);
    this.syncInputVisibility();

    const name = this.answers().name ?? '';
    const nextQuestion =
      next === 1
        ? `Prazer, ${name.split(' ')[0]}! Qual a sua idade?`
        : this.steps[next].question;

    window.setTimeout(() => {
      this.pushMessage({ role: 'bot', text: nextQuestion });
      this.focusInput();
    }, 220);
  }

  restart(): void {
    this.begin();
  }

  private normalizeValue(key: FieldKey, raw: string): string {
    if (key === 'height' || key === 'weight' || key === 'age') {
      return String(raw).replace(/[^\d.,]/g, '').replace(',', '.');
    }
    return raw;
  }

  private syncInputVisibility(): void {
    const step = this.currentStep();
    this.showCustomInput.set(!step.preferOptions);
  }

  private finish(): void {
    const a = this.answers();
    const summary = [
      'Olá! Vim pelo Assistente DZ9 Performance.',
      '',
      `Nome: ${a.name}`,
      `Idade: ${a.age}`,
      `Altura: ${a.height} cm`,
      `Peso: ${a.weight} kg`,
      `Objetivo: ${a.goal}`,
      `Academia/Rede: ${a.gym}`,
      `Maior dificuldade: ${a.difficulty}`,
      '',
      'Quero iniciar o acompanhamento com a equipe.',
    ].join('\n');

    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
    this.whatsappHref.set(href);
    this.finished.set(true);

    this.pushMessage({
      role: 'bot',
      text: `${a.name?.split(' ')[0]}, anotei tudo. Abrindo o WhatsApp com sua mensagem...`,
    });

    window.setTimeout(() => {
      window.location.href = href;
      this.close();
    }, 450);
  }

  private botMessage(text: string): ChatMessage {
    return { id: ++this.messageId, role: 'bot', text };
  }

  private pushMessage(partial: Omit<ChatMessage, 'id'>): void {
    this.messages.update((list) => [...list, { id: ++this.messageId, ...partial }]);
    this.scrollFeed();
  }

  private scrollFeed(): void {
    requestAnimationFrame(() => {
      const el = this.feedEl()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private focusInput(): void {
    requestAnimationFrame(() => {
      if (this.showCustomInput()) {
        this.inputEl()?.nativeElement.focus();
      }
    });
  }
}
