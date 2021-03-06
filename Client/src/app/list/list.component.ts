import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { newDeviceMutation } from './list.model';

import gql from 'graphql-tag';

import { Survey, Query } from '../types'
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
    surveys: Observable<Survey[]>;

//Router zum weiterleiten an die nächste Component /project
    constructor(private apollo: Apollo, private router: Router, private dataService: DataService) { }
    //
    openProject(contextID : string): void{
        this.dataService.setContextID(contextID);
        this.router.navigateByUrl('/project');
    }

    openSpecificProject(): void{
        let id=(<HTMLInputElement>document.getElementById("specificContextID")).value;
        this.dataService.setContextID(id);
        this.router.navigateByUrl('/project');
    }
    ngOnInit() {
    this.surveys = this.apollo.watchQuery<Query>({
    query: gql`
        query list{
            surveys{
                id
                title
                description
                creator{
                  lastName
                  firstName
                }
            }
        }
    `
    })
    .valueChanges
    .pipe(
    map(result => result.data.surveys)
    );

//TODO neues Device immer??
    this.apollo.mutate({
        fetchPolicy: 'no-cache',
       mutation: newDeviceMutation,
       variables: { 
         deviceName: "Fernseher",
       }
     }).subscribe(({data}) => { 
      this.dataService.setDevice(data.createDevice.token, data.createDevice.device.id, data.createDevice.device.name);
    });

  }

}
