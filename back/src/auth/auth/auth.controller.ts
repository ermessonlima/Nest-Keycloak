import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body) {
    console.log(body);
    return this.authService.login(body.username, body.password);
  }

  @Post('register')
  register(@Body() body) {
    return this.authService.register(
      body.firstName,
      body.lastName,
      body.email,
      body.username,
    );
  }
}
