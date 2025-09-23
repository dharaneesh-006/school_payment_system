import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchoolsService } from './schools.service';

@UseGuards(AuthGuard('jwt'))
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }
}