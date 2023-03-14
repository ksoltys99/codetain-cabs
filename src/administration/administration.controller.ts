import { Controller, Get, Delete, Body, Res, UseGuards } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { UserDeleteDto } from '../user/dtos/user-delete.dto';
import { RoleGuard } from '../role/role.guard';

@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @UseGuards(RoleGuard)
  @Get('users')
  getUsers() {
    return this.administrationService.getUsers();
  }

  @UseGuards(RoleGuard)
  @Delete('delete')
  async deleteUser(@Body() user: UserDeleteDto, @Res() res) {
    await this.administrationService.deleteUser(user);
    return res.status(200).send('User deleted');
  }

  @UseGuards(RoleGuard)
  @Delete('clear')
  clearAll() {
    return this.administrationService.clearRepositories();
  }
}
