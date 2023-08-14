import { Injectable, Logger } from '@nestjs/common';
const axios = require('axios');
const cheerio = require('cheerio');
const mergeImages = require('merge-images');
const {createCanvas, loadImage, registerFont} = require('canvas');
const fs = require('fs');
import * as path from 'path';

@Injectable()
export class AppService {
  
  private readonly logger = new Logger(AppService.name);
 
  getHello(): string {
    return 'nj';
  }

  getID(): string{    
    return "njnjnj";
  }

  async getImage(id: string): Promise<Buffer> {
    
    
    
    const currentDirectory = __dirname;
  
    const image1Path = path.join(currentDirectory, '..', 'resource', 'background.png');
    const fontPath = path.join(currentDirectory, '..', 'resource', 'Maplestory Bold.ttf');
    registerFont(fontPath, { family: 'Maplestory' });
  
    const url = `https://maple.gg/u/${id}`;
    let image2Path;
  
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      image2Path = $('img.character-image').first().attr('src');
    } catch (error) {
      this.logger.error('An error occurred: ', error);      
      throw error; // 외부에서 적절하게 처리할 수 있도록 에러를 던져줍니다.
    }
  
    const x = 90;
    const y = 85;
  
    const [image1, image2] = await Promise.all([
      loadImage(image1Path),
      loadImage(image2Path)
    ]);
  
    const canvas = createCanvas(image1.width, image1.height);
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(image1, 0, 0);
    ctx.translate(x + image2.width / 2, y + image2.height / 2);
    ctx.rotate((-35 * Math.PI) / 180);
    ctx.drawImage(image2, -image2.width / 2, -image2.height / 2);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.translate(-x - image2.width / 2, -y - image2.height / 2);
  
    ctx.font = '25px Maplestory';
    ctx.fillStyle = 'black';
    ctx.fillText(id, 145, 370);
  
    const buffer = canvas.toBuffer('image/png');  
    this.logger.log(id+" create job success");
  
    return buffer;
  }
  
}
