import { Component, ElementRef, HostListener, viewChild, signal } from '@angular/core';
import { Calculator } from './calculator/calculator';

@Component({
  selector: 'app-root',
  imports: [Calculator],
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
    franciele: 0,
    alegra: 0,
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
    { href: '#calculadora', label: 'Calculadora' },
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
      name: 'Kevyn',
      role: 'Atleta profissional',
      details: ['Internacional', 'Palmeiras', 'América-MG', 'Atlético-GO'],
      photo: '/kevyn.jpeg',
    },
    {
      name: 'Bernardo',
      role: 'Atleta profissional',
      details: ['Grêmio', 'São José-RS'],
      photo: '/bernardo.jpeg',
    },
    {
      name: 'Caniggia',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Botafogo', 'Paraná'],
      photo: '/caniggia.jpeg',
    },
    {
      name: 'Da Silva',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Paraná', 'Ponte Preta'],
      photo: '/dasilva.jpeg',
    },
    {
      name: 'Robyson Lukas',
      role: 'Atleta profissional',
      details: ['Grêmio', 'Monsoon', 'Lajeadense'],
      photo: '/robyson.jpeg',
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
    {
      id: 'franciele',
      name: 'Franciele',
      pairs: [
        {
          pose: 'Perfil',
          before: '/franciele1antes.jpeg',
          after: '/franciele1dps.jpeg',
        },
        {
          pose: 'Frente',
          before: '/franciele2antes.jpeg',
          after: '/franciele2dps.jpeg',
        },
      ],
    },
    {
      id: 'alegra',
      name: 'Alegra',
      pairs: [
        {
          pose: 'Treino',
          before: '/alegra1antes.jpeg',
          after: '/alegra1dps.jpeg',
        },
        {
          pose: 'Costas',
          before: '/alegra2antes.jpeg',
          after: '/alegra2dps.jpeg',
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
    this.goToResult(personId, Math.max(0, this.resultIdx(personId) - 1));
  }

  nextResult(personId: string): void {
    const person = this.resultPeople.find((item) => item.id === personId);
    if (!person) return;
    this.goToResult(personId, Math.min(person.pairs.length - 1, this.resultIdx(personId) + 1));
  }

  resultIdx(personId: string): number {
    return this.resultIndex()[personId] ?? 0;
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
