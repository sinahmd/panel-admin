import { RoleValidationPipe } from './role-validation.pipe';

describe('RoleValidationPipe', () => {
  it('create an instance', () => {
    const pipe = new RoleValidationPipe();
    expect(pipe).toBeTruthy();
  });
});
