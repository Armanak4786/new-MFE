import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactK',
  pure: true,
})
export class CompactKPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '$0';

    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return '$0';

    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

    if (abs >= 1000) {
      const k = Math.round(abs / 1000);
      return `${sign}$${formatter.format(k)}K`;
    }

    return `${sign}$${formatter.format(Math.round(abs))}`;
  }
}

