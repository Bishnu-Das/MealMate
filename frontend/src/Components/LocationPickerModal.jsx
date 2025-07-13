import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Dialog } from "@headlessui/react";
import { Button } from "../restaurant/components/ui/button";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

function LocationPickerModal({ isOpen, onClose, onSelect, initialLocation }) {
  const [selected, setSelected] = useState(initialLocation || defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleClick = useCallback((e) => {
    setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  useEffect(() => {
    if (initialLocation) setSelected(initialLocation);
  }, [initialLocation]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black/50 p-4">
        <Dialog.Panel className="bg-white w-full max-w-3xl rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <Dialog.Title as="h2" className="text-lg font-semibold">
              Pick Location
            </Dialog.Title>
          </div>

          <div className="p-4">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={selected}
                zoom={14}
                onClick={handleClick}
              >
                <Marker position={selected} />
              </GoogleMap>
            ) : (
              <p>Loading map...</p>
            )}
          </div>

          <div className="flex justify-end p-4 border-t gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default React.memo(LocationPickerModal);
