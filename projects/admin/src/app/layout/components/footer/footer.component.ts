import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LayoutService } from 'shared-lib';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    releaseInfo: any;
    microservicesList: any[] = [];
    visible: boolean = false;
    columnsAsset = [
        { field: "name", headerName: "Service", sortable: true },
        { field: "version", headerName: "Version", sortable: true },
    ];
    constructor(public layoutService: LayoutService, private http: HttpClient) { }

    ngOnInit(): void {
        this.http.get<any>("assets/data/versionFile.json").subscribe((res: any) => {
            this.releaseInfo = res;
            if (res?.microservices) {
                this.microservicesList = Object.entries(res?.microservices || {}).map(
                    ([name, serviceData]: any) => ({
                        name,
                        ...serviceData,
                    })
                );
            }
        });
    }

    openVersionPopup() {
        this.visible = true;
    }
}

