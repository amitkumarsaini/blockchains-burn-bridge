import { Test, TestingModule } from '@nestjs/testing';
import { BridgeEventService } from './bridge-event.service';

describe('BridgeEventService', () => {
  let service: BridgeEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BridgeEventService],
    }).compile();

    service = module.get<BridgeEventService>(BridgeEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
