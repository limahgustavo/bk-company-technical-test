import { BadRequestException } from '@nestjs/common';

export function parseIsoDateOrThrow(value: string, fieldName: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${fieldName} inválido.`);
  }
  return date;
}

export function isWithinRange(date: Date, range: { start?: Date; end?: Date }): boolean {
  if (range.start && date < range.start) return false;
  if (range.end && date > range.end) return false;
  return true;
}

