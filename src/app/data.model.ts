export type Data = {
  ips: IpAddress[];
  links: Link[]
}

export type IpAddress = {
  ip: string;
}

export type Link = {
  source: IpAddress;
  target: IpAddress
};