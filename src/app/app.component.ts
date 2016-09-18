import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/combineLatest';

import { DataService } from './data.service';
import { Data, Link } from './data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup;
  refreshes: Subject<any> = new Subject<any>();
  refreshSubscription: Subscription;
  graphData: Observable<Data>;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      search: ''
    });

    this.refreshSubscription = this.refreshes.subscribe(_ => this.form.controls['search'].setValue(''));

    let randomData = this.refreshes.startWith(null)
      .map(_ => Math.floor(Math.random() * 100) + 100)
      .map(count => this.dataService.getData(count));

    let latestQuery: Observable<string> = this.form.controls['search'].valueChanges.startWith('');

    this.graphData = Observable.combineLatest<Data, string>(
      randomData,
      latestQuery)
      .map(([data, query]: [Data, string]) => {
        //don't mutate the data object
        data = Object.assign({}, data);
        const ips = data.ips.filter(ip => ip.ip.indexOf(query) >= 0);
        const links = data.links.filter(l =>
          l.source.ip.indexOf(query) >= 0 && l.target.ip.indexOf(query) >= 0);
        data.ips = ips;
        data.links = links;
        return data;
      });
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }
}
