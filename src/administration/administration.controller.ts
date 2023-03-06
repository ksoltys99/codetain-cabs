import {
  Controller,
  Get,
  Delete,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { Response } from 'express';

@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @Get('users')
  getUsers() {
    return this.administrationService.getUsers();
  }

  @Delete('delete/:id')
  async deleteUser(@Request() req, @Res() res) {
    await this.administrationService.deleteUser(req.params.id);
    return res.status(200).send('User deleted');
  }

  @Delete('clear')
  clearAll() {
    return this.administrationService.clearRepositories();
  }
}
