import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly menuOpen = signal(false);

  protected readonly navLinks = [
    { href: '#quem-somos', label: 'Quem Somos' },
    { href: '#metodo', label: 'Método' },
    { href: '#atletas', label: 'Atletas' },
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

  protected readonly methodPoints = [
    {
      title: 'Treinamento personalizado',
      description: 'Baseado em evidências científicas',
      icon: 'dumbbell',
    },
    {
      title: 'Planejamento individual',
      description: 'Protocolo sob medida para o seu objetivo',
      icon: 'clipboard',
    },
    {
      title: 'Acompanhamento contínuo',
      description: 'Evolução monitorada de perto',
      icon: 'chart',
    },
    {
      title: 'Correção técnica',
      description: 'Execução precisa e segura',
      icon: 'target',
    },
  ];

  protected readonly focuses = ['Performance', 'Saúde', 'Hipertrofia', 'Longevidade'];

  protected readonly tripod = [
    { title: 'Treinamento', icon: 'dumbbell' },
    { title: 'Alimentação', icon: 'nutrition' },
    { title: 'Mentalidade', icon: 'brain' },
  ];

  protected readonly athletes = [
    { name: 'Bernardo', clubs: 'Grêmio • São José' },
    { name: 'Da Silva', clubs: 'Grêmio • Juventude • Novo Hamburgo • Turquia' },
    { name: 'Henry Douglas', clubs: 'Grêmio • Emirados Árabes' },
    { name: 'Viery', clubs: 'Grêmio • Fiorentina' },
    { name: 'Luizão', clubs: 'Grêmio • Juventude • Fortaleza • Seleção Brasileira de Base' },
    { name: 'Nathan Fernandes', clubs: 'Grêmio • Botafogo' },
    { name: 'Kauan Kelvin', clubs: 'Grêmio • Braga' },
    { name: 'Benjamim Bagetti', clubs: 'Novo Hamburgo • Real Murcia' },
  ].map((athlete, index) => ({
    ...athlete,
    index: String(index + 1).padStart(2, '0'),
  }));

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.syncBodyScroll();
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
