import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpService) {}

  async login(username: string, password: string) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          'http://host.docker.internal:8080/auth/realms/or/protocol/openid-connect/token',
          new URLSearchParams({
            client_id: 'orCliente',
            client_secret: 'ZePwE2ae5TC6i4xTkOO04W5Ywmi2joR5',
            grant_type: 'password',
            username,
            password,
          }),
        ),
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          'http://host.docker.internal:8080/auth/realms/master/protocol/openid-connect/token',
          new URLSearchParams({
            client_id: 'admin-cli',
            client_secret: 'CrIBKYLeRbAH7xDw2oVuWttoPsMhyf16',
            grant_type: 'client_credentials',
          }),
        ),
      );

      await firstValueFrom(
        await this.http.post(
          'http://host.docker.internal:8080/auth/admin/realms/or/users',
          {
            firstName,
            lastName,
            email,
            enabled: 'true',
            username,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.access_token}`,
            },
          },
        ),
      );

      return {
        usuario: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
        },
      };
    } catch (error) {
      return { error: error };
    }
  }
}
