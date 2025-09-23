import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from '../schemas/school.schema';

@Injectable()
export class SchoolsService {
  constructor(@InjectModel(School.name) private schoolModel: Model<SchoolDocument>) {}

  async onModuleInit() {
    // Populate with dummy data if collection is empty
    const count = await this.schoolModel.countDocuments().exec();
    if (count === 0) {
      await this.schoolModel.create([
        { _id: '65b0e6293e9f76a9694d84b4', name: 'Edvance School (Main)' },
        { name: 'Global Tech Academy' },
        { name: 'Innovate High School' },
      ]);
    }
  }

  findAll(): Promise<School[]> {
    return this.schoolModel.find().exec();
  }
}