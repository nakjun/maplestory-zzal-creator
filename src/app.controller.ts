import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'; // express에서 Response 타입을 임포트합니다.


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('init')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('id')
  getID(): string{
    return this.appService.getID();
  }

  @Get('getImage')
  async getImage(@Query('id') id: string, @Res() res: Response) {
    const buffer = await this.appService.getImage(id); // async/await를 사용하여 Promise를 처리    
    const filename = id+"_짤_결과.png";
    const encodedFilename = encodeURI(filename);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`); // 인코딩된 파일 이름 사용  
    res.send(buffer);    
  }
}