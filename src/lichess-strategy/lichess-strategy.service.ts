import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

interface LichessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

@Injectable()
export class LichessStrategyService {
  async getLichessAccessToken(
    grantType: string,
    code: string,
    redirectUri: string,
    clientId: string,
    codeVerifier: string,
  ): Promise<LichessTokenResponse> {
    try {
      const response = await fetch('https://lichess.org/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: grantType,
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Lichess API error:', errorData);
        throw new Error(`Lichess API error: ${response.status} ${errorData}`);
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error('No access token in response');
      }

      return data;
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  }

  async getLichessUser(accessToken: string) {
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    const response = await fetch('https://lichess.org/api/account', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.json();
  }

  async revokeLichessAccessToken(token: string): Promise<boolean> {
    const response = await fetch('https://lichess.org/api/token/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${token}`,
    });

    return response.ok;
  }
}
