import { Controller, Get, Delete, Body, Res, UseGuards } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { UserDeleteDto } from '../user/dtos/user-delete.dto';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.enum';

@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @Get('users')
  getUsers() {
    return this.administrationService.getUsers();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Get('addresses')
  getAddresses() {
    return this.administrationService.getAddresses();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete('delete')
  async deleteUser(@Body() user: UserDeleteDto, @Res() res) {
    await this.administrationService.deleteUser(user);
    return res.status(200).send('User deleted');
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete('clear')
  clearAll() {
    return this.administrationService.clearRepositories();
  }
}
