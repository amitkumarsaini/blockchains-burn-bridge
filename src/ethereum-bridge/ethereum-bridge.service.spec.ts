import { Test, TestingModule } from '@nestjs/testing';
import { EthereumBridgeService } from './ethereum-bridge.service';

describe('EthereumBridgeService', () => {
  let service: EthereumBridgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthereumBridgeService],
    }).compile();

    service = module.get<EthereumBridgeService>(EthereumBridgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
