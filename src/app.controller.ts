import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'; // express에서 Response 타입을 임포트합니다.
const nodemailer = require('nodemailer');

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}
asdasd
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

    if (!buffer || buffer.length === 0) {
      // 버퍼가 비어있으면 경고 메시지 전송
      return res.status(400).send({ alert: 'Buffer is empty. Image not found or an error occurred.' });
    }

    const filename = id+"_짤_결과.png";
    const encodedFilename = encodeURI(filename);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`); // 인코딩된 파일 이름 사용  
    res.send(buffer);    
  }

  @Get('sendEmail')
  async sendEmail(@Query('id') id:string, @Query('date') date:string, @Query('status') status:string){
    
    function decodeIfEncoded(value: string) {
      // 이 정규식은 백분율 인코딩된 문자열을 확인합니다.
      if (/^%[0-9a-fA-F]{2}/.test(value)) {
        try {
          return decodeURIComponent(value);
        } catch (e) {
          console.error('Invalid encoding:', value);
          // 필요한 경우 여기에 추가 처리를 수행할 수 있습니다.
        }
      }
      return value; // 인코딩되지 않은 경우 그대로 반환
    }
    
    const transporter = nodemailer.createTransport({      
      service: 'naver',
      host: 'smtp.naver.com', // 사용할 SMTP 서버
      port: 465,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'tjdskrwl', // 이메일 계정
        pass: 'as660225!!' // 비밀번호
      }
    });
    const id_decode = decodeIfEncoded(id);
    const status_decode = decodeIfEncoded(status);
    const title = "[시스템 알림] " + id_decode + " 변경이 있습니다";
    const text = date + " => " + status_decode;

    // 이메일 옵션 설정
    const mailOptions = {
      from: 'tjdskrwl@naver.com',
      to: 'njsung1217@gmail.com',
      subject: title,
      text: text
    };
  
    // 이메일 전송
    try {
      const info = await transporter.sendMail(mailOptions);
      const message = `Message sent: [${title}]:${text}`;      
      this.logger.log(message);      
    } catch (error) {
      this.logger.error('Error sending email:', error);
      return "send email fail";
    }
    return "send email success";
  }
}