import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import Zoom from 'ol/control/Zoom';
import { ImCross } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import useUserService from "../services/UserService";
import { FaWeightHanging } from "react-icons/fa";
import { TbDimensions } from "react-icons/tb";
import useProductsService from "../services/ProduitsService";
import toast from "react-hot-toast";

const MapComponent = () => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [click, setClicked] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [clickeditem, setClickedItem] = useState(null);
  const { getById } = useUserService();
  const { update, getAll } = useProductsService();
  const locations = getAll();
  const [user, setUser] = useState(null);
  const [map, setMap] = useState(null);
  const vectorSourceRef = useRef(new VectorSource());

  const getPlaceName = async (lat, lon) => {
    const cacheKey = "locationCache";
    const cache = JSON.parse(localStorage.getItem(cacheKey)) || {};

    const locationKey = `${lat},${lon}`;
    if (cache[locationKey]) {
      return cache[locationKey]; 
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const placeName = data.display_name || "Unknown Location";

      
      cache[locationKey] = placeName;
      localStorage.setItem(cacheKey, JSON.stringify(cache));

      return placeName;
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Unknown Location";
    }
  };


  useEffect(() => {
    if (!mapRef.current || map) return; 

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
      controls: [
        new Zoom({
          className: "absolute top-5 right-2 z-50",
        }),
      ],
    });

    setMap(newMap);

    
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    newMap.addLayer(vectorLayer);

    const popup = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      offset: [0, -10],
    });

    newMap.addOverlay(popup);

    newMap.on("pointermove", async (event) => {
      const feature = newMap.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (feature) {
        const properties = feature.getProperties();

        if (properties.from === true || properties.to === true) {
          setPopupContent(`<div><b>${properties.from ? "From" : "To"}:</b> ${properties.name}</div>`);
        } else {
          setPopupContent(`
            <div style="display: flex; padding : 20px; width: max-content; align-items: center;">
              <img src=${properties.image} width="100" height="100" />
              <div>
                <b>Name:</b> ${properties.name} <br/> 
                <b>Weight:</b> ${properties.weight}kg <br/> 
                <b>Dimensions:</b> ${properties.dimensions} <br/>
              </div>
            </div>
          `);
        }

        popup.setPosition(event.coordinate);
      } else {
        popup.setPosition(undefined);
      }
    });


    newMap.on("click", (event) => {
      const feature = newMap.forEachFeatureAtPixel(event.pixel, (feat) => feat);

      if (feature) {

        const properties = feature.getProperties();
        const coordinates = feature.getGeometry().getCoordinates();
        newMap.getView().animate({
          zoom: 10,
          center: coordinates,
          duration: 1000,
        });
        setClickedItem(properties); 
        setUser(getById(properties.user));

      } else {
        setClicked(false)
        setClickedItem(null); 
      }
    });

    newMap.on("pointermove", (event) => {
      newMap.getTargetElement().style.cursor = newMap.hasFeatureAtPixel(event.pixel) ? "pointer" : "";
    });



    return () => {
      newMap.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    vectorSourceRef.current.clear(); 

    if (clickeditem) {
     
      const { from, to } = clickeditem;

     
      const fetchPlaceNames = async () => {
        const fromName = await getPlaceName(from.lat, from.lon);
        const toName = await getPlaceName(to.lat, to.lon);

        
        const fromMarkerFeature = new Feature({
          geometry: new Point(fromLonLat([from.lon, from.lat])),
        });
        fromMarkerFeature.setProperties({
          from: true,
          name: fromName
        });


        fromMarkerFeature.setStyle(
          new Style({
            image: new Icon({
              src: "/marker.png",
              scale: 0.1,
            }),
          })
        );

        vectorSourceRef.current.addFeature(fromMarkerFeature);
        const toMarkerFeature = new Feature({
          geometry: new Point(fromLonLat([to.lon, to.lat])),
        });
        toMarkerFeature.setProperties({
          to: true,
          name: toName
        });




        toMarkerFeature.setStyle(
          new Style({
            image: new Icon({
              src: "/tomarker.png",
              scale: 0.1,
            }),
          })
        );

        vectorSourceRef.current.addFeature(toMarkerFeature);

        
        const lineFeature = new Feature({
          geometry: new LineString([
            fromLonLat([from.lon, from.lat]),
            fromLonLat([to.lon, to.lat]),
          ]),
        });

        lineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: "#ff0000",
              width: 2,
            }),
          })
        );

        vectorSourceRef.current.addFeature(lineFeature);

       




      };

      fetchPlaceNames();
    } else {
      locations.forEach((location) => {
        const marker = new Feature({
          geometry: new Point(fromLonLat([location.from.lon, location.from.lat])),
        });

        marker.setProperties({
          id: location.id,
          image: location.image,
          name: location.name,
          weight: location.weight,
          from: location.from,
          to: location.to,
          dimensions: location.dimensions,
          done: location.done,
          user: location.user_id,
        });

        marker.setStyle(
          new Style({
            image: new Icon({
              src: "/marker.png",
              scale: 0.1,
            }),
          })
        );

        vectorSourceRef.current.addFeature(marker);
      });
    }
  }, [locations, map, clickeditem]);



  const takeItem = (clickeditem) => {
    const { geometry, ...properties } = clickeditem;
    console.log(properties);
    try {

      update(properties);
      toast.success("placed successfully!");

    } catch (err) {
      toast.error(err.message)
    }

  };

  return (
    <div className="w-full h-screen" style={{ position: "relative" }}>
      <div ref={mapRef} className="z-30" style={{ width: "100%", height: "100%" }} />
      <div
        dangerouslySetInnerHTML={{ __html: popupContent }}
        ref={popupRef}
        className="popup bg-white rounded-2xl aspect-square p-4 h-[200px]"
      />
      {clickeditem && (
        <div
          className={`flex flex-col w-64 absolute right-0 transition-transform duration-1000 top-0 h-full z-50 bg-white rounded-l-2xl p-4 ${clickeditem ? "translate-x-0" : "translate-x-[100%]"
            }`}
        >
          <button onClick={() => setClickedItem(null)} className="absolute top-2 cursor-pointer right-2 p-2">
            <ImCross />
          </button>
          <h1 className="text-2xl font-bold">{clickeditem.name}</h1>
          <img src={clickeditem.image} className="w-full h-1/2 object-contain" alt="" />
          <h2 className="text-lg font-bold flex items-center justify-start capitalize gap-2">
            <FaUser /> {user?.name}
          </h2>
          <h3 className="text-lg font-bold flex items-center justify-start capitalize gap-2">
            <FaWeightHanging /> {clickeditem.weight} kg
          </h3>
          <h3 className="text-lg font-bold flex items-center justify-start capitalize gap-2">
            <TbDimensions /> {clickeditem.dimensions} cm
          </h3>
          <button onClick={() => takeItem(clickeditem)} className="w-full bg-[#f84525] p-2 rounded-xl cursor-pointer text-white mt-4">
            Take it
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;