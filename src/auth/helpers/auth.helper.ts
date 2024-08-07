import * as bcript from 'bcrypt';

export class AuthHelper {
    static hashPassword(password: string): string {
      return bcript.hashSync(password, 10);
    }
      
    static comparePassword(password: string, password1: string) {
      return bcript.compareSync(password, password1);
    }
}