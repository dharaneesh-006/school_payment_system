import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string): Promise<any> {
    const password_hash = await bcrypt.hash(pass, 10);
    const newUser = new this.userModel({ email, password_hash });
    return newUser.save();
  }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const payload = { sub: user._id, email: user.email };
      

      const accessToken = this.jwtService.sign(payload);

      // console.log('🔑 Generated JWT Token:', accessToken);
      
      return {
        access_token: accessToken,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
