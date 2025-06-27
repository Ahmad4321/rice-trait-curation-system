// export default SearchSection;

import React, { useState } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Paper,
  Button,
} from "@mui/material";

const SearchSection = ({ onSearchSubmit, data }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const searchOptions = data;
  const handleSubmit = () => {
    const searchTerm = inputValue;
    if (searchTerm) {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Term
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Autocomplete
          freeSolo
          options={searchOptions}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          value={selectedOption}
          onChange={(_, newValue) => setSelectedOption(newValue)}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => (
            <>
              <TextField
                {...params}
                label="Search trait..."
                variant="outlined"
                fullWidth
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, ml: 1 }}
              >
                e.g. Plant trait, Abiotic stress trait, Fungicide
              </Typography>
            </>
          )}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedOption && !inputValue}
          sx={{
            width: 150,
            height: 60,
            borderRadius: 5,
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchSection;
