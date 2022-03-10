import { Test, TestingModule } from '@nestjs/testing';
import { BurnBridgeService } from './burn-bridge.service';

describe('BurnBridgeService', () => {
  let service: BurnBridgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurnBridgeService],
    }).compile();

    service = module.get<BurnBridgeService>(BurnBridgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
