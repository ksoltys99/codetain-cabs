import { Controller, Get, Delete, Body, Res, UseGuards } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { UserDeleteDto } from 'src/user/dtos/user-delete.dto';

@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @Get('users')
  getUsers() {
    return this.administrationService.getUsers();
  }

  @Delete('delete')
  async deleteUser(@Body() user: UserDeleteDto, @Res() res) {
    await this.administrationService.deleteUser(user);
    return res.status(200).send('User deleted');
  }

  @Delete('clear')
  clearAll() {
    return this.administrationService.clearRepositories();
  }
}
