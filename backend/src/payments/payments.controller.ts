import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('intent')
  createIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createIntent(dto.amount, dto.currency, dto.orderId);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const payload = req.rawBody || req.body;
    const event = this.paymentsService.constructEvent(payload, signature);
    await this.paymentsService.handleWebhook(event);
    return { received: true, type: event.type };
  }
}
