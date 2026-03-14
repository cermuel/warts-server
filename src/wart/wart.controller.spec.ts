import { Test, TestingModule } from '@nestjs/testing';
import { WartController } from './wart.controller';
import { WartService } from './wart.service';

describe('WartController', () => {
  let controller: WartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WartController],
      providers: [
        {
          provide: WartService,
          useValue: {
            findAll: jest.fn(),
            importFromDriveFolder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WartController>(WartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
