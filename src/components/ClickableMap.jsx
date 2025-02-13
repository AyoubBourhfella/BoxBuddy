import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point, LineString } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Stroke } from "ol/style";
import {Zoom} from "ol/control"
const ClickableMap = ({setProduct}) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [vectorSource] = useState(new VectorSource());
    const [fromMarker, setFromMarker] = useState(null);
    const [toMarker, setToMarker] = useState(null);
    const [routeFeature, setRouteFeature] = useState(null);
    const [locations, setLocations] = useState({ from: null, to: null });
    const [isChoosing, setIsChoosing] = useState(true);

    useEffect(() => {
        if (!mapRef.current) return;

       
        const newMap = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([-6.8326, 34.0194]), 
                zoom: 6,
            }),
            controls:[
                new Zoom({
                    className: "ol-zoom ol-unselectable ol-control",
                    zoomInTipLabel: "Zoom in",
                    zoomOutTipLabel: "Zoom out",
                })
            ]
        });

       
        const vectorLayer = new VectorLayer({ source: vectorSource });
        newMap.addLayer(vectorLayer);
        setMap(newMap);

        return () => newMap.setTarget(null);
    }, []);

    useEffect(() => {
        if (!map || !isChoosing) {
            return;
        } else {
           
            const handleMapClick = async (event) => {
                const coords = toLonLat(event.coordinate);
    
                if (!fromMarker && isChoosing) {
                    
                    const newFromMarker = createMarker(event.coordinate, "/marker.png");
                    vectorSource.addFeature(newFromMarker);
                    setFromMarker(newFromMarker);
                    setLocations({ ...locations, from: { lat: coords[1], lon: coords[0] } });
                    
                    setProduct((prev) => ({ ...prev, from: { lat: coords[1], lon: coords[0] } }));
                    
                } else if (!toMarker && isChoosing) {
                    
                    const newToMarker = createMarker(event.coordinate, "/marker.png");
                    vectorSource.addFeature(newToMarker);
                    setToMarker(newToMarker);
                    setLocations({ ...locations, to: { lat: coords[1], lon: coords[0] } });
                    
               
                    setProduct((prev) => ({ ...prev, to: { lat: coords[1], lon: coords[0] } }));
                    
                    const newRouteFeature = drawRoute(fromMarker.getGeometry().getCoordinates(), event.coordinate);
                    vectorSource.addFeature(newRouteFeature);
                    setRouteFeature(newRouteFeature);
    
                   
                    setIsChoosing(false);
                }
            };
    
            
            map.on("click", handleMapClick);
    
            
            return () => {
                map.un("click", handleMapClick);
            };
        }
    }, [map, fromMarker, toMarker, isChoosing, locations]);
    
    
    const createMarker = (coordinates, iconSrc) => {
        const marker = new Feature({
            geometry: new Point(coordinates),
        });
        marker.setStyle(
            new Style({
                image: new Icon({
                    src: iconSrc,
                    scale: 0.05,
                }),
            })
        );
        return marker;
    };

    
    const drawRoute = (fromCoord, toCoord) => {
        return new Feature({
            geometry: new LineString([fromCoord, toCoord]),
            style: new Style({
                stroke: new Stroke({
                    color: "blue",
                    width: 3,
                }),
            }),
        });
    };

    
    const getPlaceName = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            return data.display_name || "Unknown Location";
        } catch (error) {
            console.error("Error fetching place name:", error);
            return "Unknown Location";
        }
    };

    
    const resetMap = () => {
        vectorSource.clear(); 
        setFromMarker(null);
        setToMarker(null);
        setRouteFeature(null);
        setLocations({ from: null, to: null });
        setIsChoosing(true);
    };

    return (
        <>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box map-container h-[80vh] max-w-[90vw] aspect-video ">
                    <div ref={mapRef} className="cursor-crosshair" style={{ width: "100%", height: "80%" }} />

                   
                    <div className="modal-action">

                            <button className="btn" onClick={resetMap}>Reset</button>
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};



export default ClickableMap;
