declare var ol: any;

let ballCenters = [];
let colors = ["lightsalmon", "coral", "tomato", "orangered", "darkorange", "orange"];

for (var x = 0; x < 20; x++) {
    var yC = -(x * 400);

    for (var y = 0; y < 20; y++) {
        var xC = (y * 400);

        ballCenters.push({ "x": xC, "y": yC });
    }
}

export interface RandyTrianglesModuleLayer {
    generateSource(): any;
    styleFunction(feature, resolution): any[];
}

export class RandyTrianglesLayer implements RandyTrianglesModuleLayer {
    generateSource() {

        var ballsSource = new ol.source.Vector();

        for (let ballCenter of ballCenters) {

            let randomColor = this.getRandomColor();
            let backColor = this.getRandomColor();
            // console.log("Color", randomColor);

            var ballFeature = new ol.Feature({
                geometry: new ol.geom.Circle([ballCenter.x, ballCenter.y], 199),
                type: "Ball",
                color: randomColor,
                back: backColor
            });

            ballsSource.addFeature(ballFeature);

            var ballImage = new ol.Feature({
                geometry: new ol.geom.Circle([ballCenter.x, ballCenter.y], 100),
                type: "Image",
                seed: ballCenter.x * ballCenter.y
            });

            ballsSource.addFeature(ballImage);
        }

        return ballsSource
    }

    styleFunction(feature, resolution) {
        // console.log("Res", resolution);
        var type = feature.get('type');

        if (type === "Ball") {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: feature.get('color'),
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: feature.get('back'),
                    }),
                })
            ]
        }
        else if (resolution <= 2) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 0, 0.1)'
                    }),
                })
            ]
        }
    }

    getRandomColor(): string {
        let nextIndex = this.next(0, colors.length);

        return colors[nextIndex];
    }

    next(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}