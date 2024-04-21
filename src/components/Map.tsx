import React from 'react';

const Map = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443087.5486239773!2d-95.68148361227509!3d29.817478217379257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX%2C%20USA!5e0!3m2!1sen!2sng!4v1678785253217!5m2!1sen!2sng"
      width={'100%'}
      height="400"
      style={{ border: 0 }}
      // allowfullscreen="false"
      loading="lazy"
      title="map showing location"
      // referrerpolicy={'no-referrer-when-downgrade'}
    ></iframe>
  );
};

export default Map;
