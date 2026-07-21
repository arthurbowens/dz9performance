import { Component, ElementRef, signal, viewChild } from '@angular/core';

type Goal = 'saude' | 'emagrecimento' | 'hipertrofia' | 'alto-rendimento';

interface CalcResult {
  waterL: number;
  proteinG: number;
  creatineG: number;
}

const PROTEIN_FACTOR: Record<Goal, number> = {
  saude: 1.2,
  emagrecimento: 1.8,
  hipertrofia: 2.0,
  'alto-rendimento': 2.2,
};

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  private readonly resultsEl = viewChild<ElementRef<HTMLElement>>('calcResults');

  protected readonly weight = signal<string>('');
  protected readonly goal = signal<Goal>('hipertrofia');
  protected readonly error = signal('');
  protected readonly result = signal<CalcResult | null>(null);
  protected readonly showResults = signal(false);

  protected readonly goals: { value: Goal; label: string }[] = [
    { value: 'saude', label: 'Saúde' },
    { value: 'emagrecimento', label: 'Emagrecimento' },
    { value: 'hipertrofia', label: 'Hipertrofia' },
    { value: 'alto-rendimento', label: 'Alto rendimento' },
  ];

  onWeightInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.weight.set(value);
    this.error.set('');
  }

  onGoalChange(event: Event): void {
    this.goal.set((event.target as HTMLSelectElement).value as Goal);
  }

  calculate(): void {
    const peso = Number(String(this.weight()).replace(',', '.'));

    if (!this.weight().trim() || Number.isNaN(peso)) {
      this.error.set('Informe um peso válido.');
      this.showResults.set(false);
      this.result.set(null);
      return;
    }

    if (peso <= 0) {
      this.error.set('O peso deve ser maior que zero.');
      this.showResults.set(false);
      this.result.set(null);
      return;
    }

    if (peso < 30 || peso > 250) {
      this.error.set('Informe um peso entre 30 e 250 kg.');
      this.showResults.set(false);
      this.result.set(null);
      return;
    }

    const aguaMl = peso * 40;
    const waterL = Math.round((aguaMl / 1000) * 10) / 10;
    const proteinG = Math.round(peso * PROTEIN_FACTOR[this.goal()]);
    const creatineG = Math.round(Math.min(Math.max(peso * 0.03, 3), 5) * 10) / 10;

    this.error.set('');
    this.result.set({ waterL, proteinG, creatineG });
    this.showResults.set(false);

    // Force reflow then animate
    requestAnimationFrame(() => {
      this.showResults.set(true);
      setTimeout(() => {
        this.resultsEl()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    });
  }

  formatWater(value: number): string {
    return value.toFixed(1).replace('.', ',');
  }

  formatCreatine(value: number): string {
    return value.toFixed(1).replace('.', ',');
  }
}
