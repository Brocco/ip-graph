import { Injectable } from '@angular/core';
import { Data, IpAddress, Link } from './data.model';

@Injectable()
export class DataService {

  constructor() { }

  getData (numberOfPoints: number): Data {
    const ips = this.getRandomIps(numberOfPoints);
    const links = this.buildLinks(ips);
    const data: Data = {
      ips: ips,
      links: links
    }
    return data;
  }

  private getRandomIps(count: number): IpAddress[] {
    const ips: IpAddress[] = [];
    for(let i=0; i<count; i++) {
      ips.push({ ip: this.getRandomIp() });
    }
    return ips;
  }

  private getRandomIp(): string {
    const parts: number[] = [];
    for(let i=0; i<4; i++) {
      parts.push(Math.floor(Math.random() * 256));
    }
    return parts.join('.');
  }

  private buildLinks(ips: IpAddress[]): Link[] {
    const links: Link[] = [];
    const count = ips.length;

    ips.forEach((ip, idx) => {
      const randomIndex = Math.floor(Math.random() * (count - 1));
      links.push({
        source: ip,
        target: ips[randomIndex >= idx ? randomIndex : randomIndex + 1]
      });
    });

    const howManyRandomLinks = Math.floor(Math.random() * 50) + 10;
    for(let i=0; i<howManyRandomLinks; i++) {
      links.push(this.buildRandomLink(ips));
    }

    return links;
  }

  private buildRandomLink(ips: IpAddress[]): Link {
    let randomIndex1 = Math.floor(Math.random() * ips.length);
    let randomIndex2 = Math.floor(Math.random() * ips.length);
    while(randomIndex1 === randomIndex2) {
      randomIndex1 = Math.floor(Math.random() * ips.length);
      randomIndex2 = Math.floor(Math.random() * ips.length);
    }
    return {
      source: ips[randomIndex1],
      target: ips[randomIndex2]
    }
  }
}
