import { SaveBridgeEventDto } from './save-bridge-event.dto';

export class CreateBridgeEventDto extends SaveBridgeEventDto {
  sourceTx: string;
}
