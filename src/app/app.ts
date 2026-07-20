import { Component, ElementRef, HostListener, viewChild, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly menuOpen = signal(false);
  protected readonly athleteIndex = signal(0);
  protected readonly resultIndex = signal<Record<string, number>>({
    vanessa: 0,
    natalie: 0,
    ricardo: 0,
    jorge: 0,
  });

  private readonly athletesTrack = viewChild<ElementRef<HTMLElement>>('athletesTrack');

  protected readonly whatsappUrl =
    'https://wa.me/555185679046?text=' +
    encodeURIComponent(
      'Olá! Vim pelo site da DZ9 Performance e quero saber mais sobre o método e os programas.',
    );

  protected readonly navLinks = [
    { href: '#quem-somos', label: 'Quem Somos' },
    { href: '#metodo', label: 'Método' },
    { href: '#jornada', label: 'Jornada' },
    { href: '#atletas', label: 'Atletas' },
    { href: '#resultados', label: 'Resultados' },
    { href: '#contato', label: 'Contato' },
  ];

  protected readonly thalesCredentials = [
    'Educação Física (PUCRS)',
    'Atuação desde 2009',
    '10 anos na preparação física da base do Grêmio',
    'Especialista em performance e retorno pós-lesão',
  ];

  protected readonly rafaelaCredentials = [
    'Bacharel em Educação Física',
    'Ex-atleta de fisiculturismo',
    'Foco em hipertrofia, emagrecimento e técnica',
  ];

  protected readonly pillars = [
    {
      title: 'Mentalidade de atleta',
      description:
        'Criação de disciplina blindada, constância inabalável e mudança profunda de hábitos diários.',
    },
    {
      title: 'Treinamento estratégico',
      description:
        'Periodização inteligente e totalmente individualizada baseada em objetivos claros de estética e performance.',
    },
    {
      title: 'Alimentação limpa',
      description:
        'Foco estratégico em alimentos de verdade, nutrientes naturais e direcionamento preciso de macronutrientes.',
    },
    {
      title: 'Intensidade progressiva',
      description:
        'Evolução constante de cargas, aumento controlado de volume semanal e aplicação de técnicas primárias e avançadas.',
    },
    {
      title: 'Acompanhamento ativo',
      description:
        'Avaliações físicas periódicas, feedbacks constantes e correções cirúrgicas semanais de toda a estratégia.',
    },
  ];

  protected readonly levels = [
    {
      name: 'DZ9 Start',
      tone: 'start',
      description:
        'Direcionado para iniciantes. Foco total em emagrecimento ativo, adaptação neuromuscular ao treinamento e criação sólida de uma nova rotina saudável.',
    },
    {
      name: 'DZ9 Pro',
      tone: 'pro',
      description:
        'Nível intermediário. Foco em hipertrofia acelerada, recomposição corporal eficiente (ganhar massa e perder gordura) e aplicação de intensidade progressiva.',
    },
    {
      name: 'DZ9 Elite',
      tone: 'elite',
      description:
        'Nível avançado. Foco em máxima performance esportiva, definição muscular extrema e aplicação de técnicas avançadas com o acompanhamento mais próximo da equipe.',
    },
  ];

  protected readonly tripod = [
    { title: 'Treino', icon: 'dumbbell' },
    { title: 'Alimentação', icon: 'nutrition' },
    { title: 'Mental', icon: 'brain' },
  ];

  protected readonly athletes = [
    {
      name: 'Viery',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Atualmente Fiorentina (Itália)'],
      photo: '/viery.jpeg',
    },
    {
      name: 'Kauan Kelvin',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Seleção Brasileira de Base', 'Atualmente Braga (Portugal)'],
      photo: '/kauankevin.jpeg',
    },
    {
      name: 'Benjamim',
      role: 'Atleta profissional',
      details: ['Novo Hamburgo', 'Atualmente Real Murcia (Espanha)'],
      photo: '/benjamin.jpeg',
    },
    {
      name: 'Luizão',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Seleção Brasileira de Base', 'Fortaleza'],
      photo: '/luizao.jpeg',
    },
    {
      name: 'Nathan Fernandes',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Atualmente Botafogo'],
      photo: '/nathan.jpeg',
    },
  ];

  protected readonly resultPeople = [
    {
      id: 'vanessa',
      name: 'Vanessa',
      pairs: [
        {
          pose: 'Frente',
          before: '/vanessa1antes.jpeg',
          after: '/vanessa2dps.jpeg',
        },
        {
          pose: 'Perfil',
          before: '/vanessa2antes.jpeg',
          after: '/vanessa3dps.jpeg',
        },
        {
          pose: 'Costas',
          before: '/vanessa3antes.jpeg',
          after: '/vanessa4dps.jpeg',
        },
        {
          pose: 'Perfil',
          before: '/vanessa4antes.jpeg',
          after: '/vanessa1dps.jpeg',
        },
      ],
    },
    {
      id: 'natalie',
      name: 'Natalie',
      pairs: [
        {
          pose: 'Frente',
          before: '/natalie2antes.jpeg',
          after: '/natalie1dps.jpeg',
        },
        {
          pose: 'Perfil',
          before: '/natalie3antes.jpeg',
          after: '/natalie2dps.jpeg',
        },
      ],
    },
    {
      id: 'ricardo',
      name: 'Ricardo',
      pairs: [
        {
          pose: 'Frente',
          before: '/ricardoantes.jpeg',
          after: '/ricardodps.jpeg',
        },
      ],
    },
    {
      id: 'jorge',
      name: 'Jorge',
      pairs: [
        {
          pose: 'Transformação',
          before: '/jorge1antes.jpeg',
          after: '/jorge1dps.jpeg',
        },
        {
          pose: 'Transformação',
          before: '/jorge2antes.jpeg',
          after: '/jorge2dps.jpeg',
        },
      ],
    },
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.syncBodyScroll();
  }

  onAthletesScroll(event: Event): void {
    const track = event.target as HTMLElement;
    const card = track.querySelector('.athlete-card') as HTMLElement | null;
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
    const cardWidth = card.offsetWidth + gap;
    if (cardWidth <= 0) return;

    const index = Math.round(track.scrollLeft / cardWidth);
    const clamped = Math.max(0, Math.min(index, this.athletes.length - 1));
    this.athleteIndex.set(clamped);
  }

  goToAthlete(index: number): void {
    const track = this.athletesTrack()?.nativeElement;
    if (!track) return;

    const card = track.querySelector('.athlete-card') as HTMLElement | null;
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
    const cardWidth = card.offsetWidth + gap;
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.athleteIndex.set(index);
  }

  prevAthlete(): void {
    const next = Math.max(0, this.athleteIndex() - 1);
    this.goToAthlete(next);
  }

  nextAthlete(): void {
    const next = Math.min(this.athletes.length - 1, this.athleteIndex() + 1);
    this.goToAthlete(next);
  }

  onResultsScroll(personId: string, event: Event): void {
    const person = this.resultPeople.find((item) => item.id === personId);
    if (!person) return;

    const track = event.target as HTMLElement;
    const card = track.querySelector('.result-card') as HTMLElement | null;
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
    const cardWidth = card.offsetWidth + gap;
    if (cardWidth <= 0) return;

    const index = Math.round(track.scrollLeft / cardWidth);
    const clamped = Math.max(0, Math.min(index, person.pairs.length - 1));
    this.resultIndex.update((state) => ({ ...state, [personId]: clamped }));
  }

  goToResult(personId: string, index: number): void {
    if (typeof document === 'undefined') return;

    const track = document.getElementById(`results-track-${personId}`);
    if (!track) return;

    const card = track.querySelector('.result-card') as HTMLElement | null;
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
    const cardWidth = card.offsetWidth + gap;
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.resultIndex.update((state) => ({ ...state, [personId]: index }));
  }

  prevResult(personId: string): void {
    const current = this.resultIndex()[personId] ?? 0;
    this.goToResult(personId, Math.max(0, current - 1));
  }

  nextResult(personId: string): void {
    const person = this.resultPeople.find((item) => item.id === personId);
    if (!person) return;
    const current = this.resultIndex()[personId] ?? 0;
    this.goToResult(personId, Math.min(person.pairs.length - 1, current + 1));
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && this.menuOpen()) {
      this.closeMenu();
    }
  }

  private syncBodyScroll(): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }
}
