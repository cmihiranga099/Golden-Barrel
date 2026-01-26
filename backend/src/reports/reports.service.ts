import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async salesReport(from?: string, to?: string) {
    const match: any = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }
    return this.orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
          avgOrder: { $avg: '$total' },
        },
      },
    ]);
  }

  async salesReportCsv(from?: string, to?: string) {
    const data = await this.salesReport(from, to);
    const row = data[0] || { totalSales: 0, orderCount: 0, avgOrder: 0 };
    const header = 'totalSales,orderCount,avgOrder';
    const line = `${row.totalSales},${row.orderCount},${row.avgOrder}`;
    return { csv: `${header}\n${line}` };
  }
}