import { HostListener, Component, OnInit } from '@angular/core';
import { BallsModuleLayer, BallsLayer } from './layers/recursive.balls'

import { Message } from 'primeng/api';

declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  map: any;
  ballsLayer: any;
  showDebug: boolean = true;
  showBallsTouhcingAha = true;

  msgs: Message[] = [];

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    // c or C
    if (event.keyCode === 99 || event.keyCode === 67) { 
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Key Pressed', detail: 'I "C" what you mean...' });
;    }
  }

  ngOnInit(): void {
    // oh shit the real map code kinda starts here!
    var mapExtent = [0.00000000, -8000.00000000, 8000.00000000, 0.00000000];
    var mapMinZoom = 0;
    var mapMaxZoom = 5;
    var mapMaxResolution = 1.00000000;
    var tileExtent = [0.00000000, -8000.00000000, 8000.00000000, 0.00000000];

    var mapResolutions = [];

    for (var z = 0; z <= mapMaxZoom; z++) {
      mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
    }

    var mapTileGrid = new ol.tilegrid.TileGrid({
      extent: tileExtent,
      minZoom: mapMinZoom,
      resolutions: mapResolutions
    });

    var controls = [
      new ol.control.Zoom(),
      new ol.control.FullScreen(),
    ];

    var ballsModule = new BallsLayer();

    this.ballsLayer = new ol.layer.Vector({
      source: ballsModule.generateSource(),
      name: "Balls",
      style: ballsModule.styleFunction
    });



    this.map = new ol.Map({
      layers: [
        this.ballsLayer
      ],
      target: 'map',
      controls: controls,
      view: new ol.View({
        zoom: 0,
        center: [4000, -4000],
        maxResolution: mapTileGrid.getResolution(mapMinZoom)
      })
    });

    this.map.on('moveend', (evt) => {
      console.log("Event", evt);
      console.log("Map", evt.map);

      let zoom = evt.map.getView().getZoom();
      if (zoom >= 7) {
        if (this.showBallsTouhcingAha) {
          this.showBallsTouhcingAha = false;
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: 'Aha!', detail: 'The balls are not touching!' });
        }
      }
      console.log("Zoom", zoom);
    });

    this.msgs.push({ severity: 'warn', summary: 'Welcome', detail: 'I wonder if these balls are touching...' });
  }
}



