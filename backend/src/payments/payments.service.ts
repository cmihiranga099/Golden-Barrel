import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
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
}