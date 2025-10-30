import { IsNotEmpty } from 'class-validator';
import { IsArrayOrSingle } from '../decorators/is-array-or-single.decorator';

export class DeleteImagesDto {
  @IsNotEmpty()
  @IsArrayOrSingle()
  images: string[];
}
