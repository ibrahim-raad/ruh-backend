import { ApiProperty } from '@nestjs/swagger';

export class PageOutput<T> {
  @ApiProperty({
    description: 'Indicates if there are more items',
    type: Boolean,
  })
  readonly hasNext: boolean;
  @ApiProperty({ description: 'List of items', type: [Object] })
  readonly items: T[];
  @ApiProperty({ description: 'Total number of items', type: Number })
  readonly total: number;
}
