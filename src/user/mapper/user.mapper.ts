import { User } from "src/user/entities/user.entity";
import { SignupInput } from "src/auth/dto/inputs/signup.input";

export class UserMapper {

  static toEntity(signupInput: SignupInput): User {
      const user = new User();
      user.fullName = signupInput.fullName;
      user.email = signupInput.email;
      user.password = signupInput.password;
      return user;
  }
}