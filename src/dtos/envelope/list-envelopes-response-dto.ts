import type { EnvelopeDto } from './envelope-types';

export interface ListEnvelopesResponseDto {
  data: EnvelopeDto[];
  meta?: {
    count: number;
  };
}

