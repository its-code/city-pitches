import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('pitch')
export class PitchController {
  @Get(':city')
  async getCityPitch(@Param('city') city: string, @Res() res: Response) {
    try {
      const pitch = await this.getPitchFromOpenAI(city);
      res.send({ city, pitch });
    } catch (error) {
      console.error('Failed to fetch pitch:', error);
      res.status(500).send('Failed to fetch pitch');
    }
  }

  private async getPitchFromOpenAI(city: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Give a short pitch about ${city}, which must be a real city on Earth. If ${city} is not a recognized city, please state "Enter a correct city name."`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    return response.data.choices[0].message.content.trim();
  }
}
