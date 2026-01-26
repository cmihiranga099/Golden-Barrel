import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolesDecorator } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @RolesDecorator('ADMIN')
  @Get('sales')
  sales(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.salesReport(from, to);
  }

  @RolesDecorator('ADMIN')
  @Get('sales/csv')
  salesCsv(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.salesReportCsv(from, to);
  }
}