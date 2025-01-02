import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import moment from 'moment-timezone'; // or use Intl.supportedValuesOf('timeZone')

const allTimeZones = moment.tz.names(); // ["Africa/Abidjan", "Africa/Accra", ...]
const timeZoneOptions = allTimeZones.map((tz) => tz); // or an object { label, value }

export default function TimeZoneSelectAutocomplete() {
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  return (
    <Autocomplete
      fullWidth
      options={timeZoneOptions}
      // Optionally, you can format label vs. value:
      // options={timeZoneOptions.map((tz) => ({ label: tz, value: tz }))}

      value={selectedTimeZone}
      onChange={(event, newValue) => {
        setSelectedTimeZone(newValue || '');
      }}

      // The text box for searching
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Time Zone"
          variant="outlined"
        />
      )}
      // This helps "type to search" among your array
      filterSelectedOptions
      autoHighlight
    />
  );
}
