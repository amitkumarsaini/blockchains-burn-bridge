import { SaveBatchDto } from './save-batch.dto';

export class CreateBatchDto extends SaveBatchDto {
  keyName: string;
  chainId: string;
}
