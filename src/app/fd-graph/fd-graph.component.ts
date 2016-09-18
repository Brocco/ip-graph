import { Component, OnInit, OnChanges, SimpleChanges,
  ElementRef, Input, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Data, IpAddress, Link } from '../data.model';

import * as d3 from 'd3';
import * as d3Force from 'd3-force';

@Component({
  selector: 'fd-graph',
  templateUrl: './fd-graph.component.html',
  styleUrls: ['./fd-graph.component.scss']
})
export class FdGraphComponent implements OnInit, OnChanges {
  @Input() graphData: Data;
  @ViewChild('fdsvg') fdsvg;
  svg: any;
  simulation: d3Force.Simulation<IpAddress, Link>;
  contextInfo: any;

  constructor(
    private elem: ElementRef,
    private http: Http) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.buildGraph(changes['graphData'].currentValue);
  }

  initSimulation() {
    this.svg = d3.select(this.fdsvg.nativeElement);

    const height = +this.svg.attr('height');
    const width = +this.svg.attr('width');

    this.simulation = d3Force.forceSimulation<IpAddress, Link>()
      .force('link', d3Force.forceLink().id((d: IpAddress) => d.ip))
      .force('charge', d3Force.forceManyBody().distanceMax(70))
      .force('center', d3Force.forceCenter(width / 2, height / 2));
  }

  private getUglyColor(ip: string) {
    let firstChar = parseInt(ip[0]);
    switch(firstChar) {
      case 1: return 'red';
      case 2: return 'blue';
      case 3: return 'green';
      case 4: return 'yellow';
      case 5: return 'black';
      case 6: return 'purple';
      case 7: return 'gray';
      case 8: return 'pink';
      case 9: return 'orange';
      default: return 'lime';
    }
  }

  private buildGraph(data: Data) {
    this.initSimulation();
    // clear the svg
    this.svg.selectAll('*').remove();

    let link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke-width', .3)
      .attr('stroke', 'black');

    const menu = {
      title: 'Lookup IP'
    }

    let node = this.svg.append('g')
      .selectAll('circle')
      .data(data.ips)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', d => this.getUglyColor(d.ip))
      .on('contextmenu', (d, i) => {
        d3.event['preventDefault']();
        this.contextInfo = {
          text: `Find ${d.ip}`,
          ip: d.ip,
          top: (d3.event['offsetY'] - 10) + 'px',
          left: (d3.event['offsetX'] - 10) + 'px'
        };
      });

    this.simulation
      .nodes(data.ips)
      .on('tick', ticked);

    let force: any = this.simulation.force('link')
    force.links(data.links);

    function ticked() {
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

      node
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
    }
  }

  private conextButtonBlur() {
    this.contextInfo = undefined;
  }

  private conextButtonClick() {
    let url = `http://ip-api.com/json/${this.contextInfo.ip}`
    let subscription = this.http.get(url)
      .map((response: Response) => response.json())
      .subscribe(response => {
        subscription.unsubscribe();
        if (response.status === 'fail') {
          alert('invalid IP address');
        } else {
          alert(`The IP address ${response.query} is located` +
            `\nin ${response.city}, ${response.country}` +
            `\n(${response.lat}, ${response.lon})`);
        }
      });
    this.contextInfo = undefined;
  }
}
