import { UsersService } from '../src/users/users.service';

const mockModel = () => ({
  findOne: jest.fn(),
});

describe('UsersService', () => {
  it('findByEmail lowercases email', async () => {
    const model = mockModel();
    const service = new UsersService(model as any);
    await service.findByEmail('TEST@EXAMPLE.COM');
    expect(model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});