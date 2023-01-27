import { Injectable } from '@nestjs/common';
import { User } from 'src/model/user';

@Injectable()
export class RegisterService {
  addUser(user: User) {
    console.log(user);
    return;
  }
}
