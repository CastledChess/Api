import { ApiProperty } from '@nestjs/swagger';

/**
 * Base Data Transfer Object (DTO)
 * Il permet de définir les propriétés communes à tous les DTO
 */
export abstract class BaseDto {
  @ApiProperty({ example: '837e5edb-c833-447e-a57d-a43fb6c0100b' })
  id: string;

  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
