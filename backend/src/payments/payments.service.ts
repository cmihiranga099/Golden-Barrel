import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-04-10',
    });
  }

  async createIntent(amount: number, currency: string, orderId?: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: orderId ? { orderId } : undefined,
    });
  }

  constructEvent(payload: Buffer, signature: string | string[]) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        await this.ordersService.markPaid(orderId, { paymentStatus: 'PAID' } as any);
      } else if (intent.id) {
        await this.ordersService.markPaidByPaymentIntent(intent.id, 'PAID');
      }
    }
    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      if (intent.id) {
        await this.ordersService.markPaidByPaymentIntent(intent.id, 'FAILED');
      }
    }
    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await this.ordersService.markPaidByPaymentIntent(String(charge.payment_intent), 'REFUNDED');
      }
    }
  }
}
