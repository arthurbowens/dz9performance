import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

type FieldKey =
  | 'name'
  | 'age'
  | 'height'
  | 'weight'
  | 'goal'
  | 'experience'
  | 'gymSchedule'
  | 'frequency'
  | 'modality'
  | 'trainer'
  | 'medical'
  | 'difficulty';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface Step {
  key: FieldKey;
  placeholder: string;
  inputType: 'text' | 'number';
  options?: string[];
  preferOptions?: boolean;
  validate: (value: string) => string | null;
}

const WHATSAPP_NUMBER = '555185679046';
const OTHER_OPTIONS = new Set(['Outro', 'Outros']);

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
      placeholder: 'Seu nome',
      inputType: 'text',
      validate: (v) => (v.trim().length < 2 ? 'Informe seu nome.' : null),
    },
    {
      key: 'age',
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
      placeholder: 'Ex: 175',
      inputType: 'number',
      validate: (v) => {
        const n = Number(String(v).replace(',', '.'));
        if (!Number.isFinite(n) || n < 120 || n > 230) return 'Informe a altura em centímetros (120 a 230).';
        return null;
      },
    },
    {
      key: 'weight',
      placeholder: 'Ex: 80',
      inputType: 'number',
      validate: (v) => {
        const n = Number(String(v).replace(',', '.'));
        if (!Number.isFinite(n) || n < 30 || n > 250) return 'Informe o peso em kg (30 a 250).';
        return null;
      },
    },
    {
      key: 'goal',
      placeholder: 'Qual o seu objetivo?',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Emagrecimento',
        'Ganho de massa muscular',
        'Definição corporal',
        'Condicionamento',
        'Qualidade de vida',
        'Concurso',
        'Performance esportiva',
        'Outros',
      ],
      validate: (v) => (v.trim().length < 2 ? 'Escolha ou digite seu objetivo.' : null),
    },
    {
      key: 'experience',
      placeholder: 'Ex: Sim, há 1 ano',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Não treino ainda',
        'Menos de 3 meses',
        '3 a 6 meses',
        '6 a 12 meses',
        'Mais de 1 ano',
        'Outro',
      ],
      validate: (v) => (v.trim().length < 2 ? 'Conte se você já treina e há quanto tempo.' : null),
    },
    {
      key: 'gymSchedule',
      placeholder: 'Ex: Smart Fit Moinhos, manhã',
      inputType: 'text',
      validate: (v) =>
        v.trim().length < 3 ? 'Informe a academia (unidade) e o horário disponível.' : null,
    },
    {
      key: 'frequency',
      placeholder: 'Ex: 3x',
      inputType: 'text',
      preferOptions: true,
      options: ['2x', '3x', '4x', '5x ou mais'],
      validate: (v) => (v.trim().length < 1 ? 'Escolha quantas vezes por semana.' : null),
    },
    {
      key: 'modality',
      placeholder: 'Modalidade de atendimento',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Treino presencial com o treinador',
        'Consultoria on-line',
        'Híbrido (1 ou 2 aulas presenciais + consultoria)',
      ],
      validate: (v) => (v.trim().length < 2 ? 'Escolha a modalidade de atendimento.' : null),
    },
    {
      key: 'trainer',
      placeholder: 'Preferência de treinador',
      inputType: 'text',
      preferOptions: true,
      options: ['Treinador Thales', 'Treinadora Rafaela', 'Sem preferência'],
      validate: (v) => (v.trim().length < 2 ? 'Escolha sua preferência de treinador.' : null),
    },
    {
      key: 'medical',
      placeholder: 'Ex: Nenhuma, ou descreva a restrição',
      inputType: 'text',
      preferOptions: true,
      options: ['Nenhuma', 'Lesão', 'Dor', 'Outro'],
      validate: (v) => (v.trim().length < 2 ? 'Informe se há restrição médica, lesão ou dor.' : null),
    },
    {
      key: 'difficulty',
      placeholder: 'Sua maior dificuldade',
      inputType: 'text',
      preferOptions: true,
      options: [
        'Consistência',
        'Alimentação',
        'Falta de tempo',
        'Técnica nos exercícios',
        'Motivação',
        'Lesão/dores',
        'Outro',
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
    this.messages.set([
      this.botMessage(
        'Oi! Somos da DZ9 Performance 🔥, e vamos te fazer uma anamnese bem prática, para te conhecer melhor e traçar o caminho mais específico para teu objetivo 🚀',
      ),
      this.botMessage('Sou o treinador Thales, como você se chama?'),
    ]);
    this.syncInputVisibility();
    this.scrollFeed();
    this.focusInput();
  }

  pickOption(option: string): void {
    const needsDetail =
      OTHER_OPTIONS.has(option) ||
      (this.currentStep().key === 'medical' && (option === 'Lesão' || option === 'Dor'));

    if (needsDetail) {
      this.showCustomInput.set(true);
      this.draft.set(OTHER_OPTIONS.has(option) ? '' : `${option}: `);
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

    window.setTimeout(() => {
      this.pushMessage({ role: 'bot', text: this.questionFor(next) });
      this.focusInput();
    }, 220);
  }

  restart(): void {
    this.begin();
  }

  private questionFor(index: number): string {
    const name = (this.answers().name ?? '').split(' ')[0];
    const key = this.steps[index].key;

    switch (key) {
      case 'age':
        return `Prazer, ${name}! Qual a sua idade?`;
      case 'height':
        return 'Qual sua altura? Em centímetros.';
      case 'weight':
        return 'E seu peso atual em kg?';
      case 'goal':
        return 'E qual seu principal objetivo com os treinos?';
      case 'experience':
        return 'Você já treina? Quanto tempo?';
      case 'gymSchedule':
        return 'Qual academia (unidade) você pretende treinar? E qual horário tem disponibilidade?';
      case 'frequency':
        return 'Quantas vezes por semana você consegue treinar?';
      case 'modality':
        return `${name}, você tem preferência por qual modalidade de atendimento?`;
      case 'trainer':
        return 'Tem preferência por treinar com o treinador Thales, a treinadora Rafaela, ou sem preferência?';
      case 'medical':
        return 'Possui alguma restrição médica? Lesão ou dor que devemos considerar?';
      case 'difficulty':
        return 'Por último, qual sua maior dificuldade hoje?';
      default:
        return 'Pode continuar.';
    }
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
      'Olá! Vim pelo Assistente DZ9 Performance (anamnese do site).',
      '',
      `Nome: ${a.name}`,
      `Idade: ${a.age}`,
      `Altura: ${a.height} cm`,
      `Peso: ${a.weight} kg`,
      `Objetivo: ${a.goal}`,
      `Experiência: ${a.experience}`,
      `Academia/horário: ${a.gymSchedule}`,
      `Frequência: ${a.frequency}`,
      `Modalidade: ${a.modality}`,
      `Preferência de treinador: ${a.trainer}`,
      `Restrição médica: ${a.medical}`,
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
