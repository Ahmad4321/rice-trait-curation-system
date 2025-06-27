
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
  
  // Extract all possible searchable terms from the data
  // const extractSearchTerms = (nodes) => {
  //   let terms = [];
  //   nodes.forEach(node => {
  //     terms.push({ label: node.ename, value: node.id });
  //     if (node.children) {
  //       terms = terms.concat(extractSearchTerms(node.children));
  //     }
  //   });
  //   return terms;
  // };

  const searchOptions = data //? extractSearchTerms(data) : [];

  const handleSubmit = () => {
    // Use either the selected option label or the raw input value
    const searchTerm = inputValue //selectedOption?.label || inputValue;
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
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          value={selectedOption}
          onChange={(_, newValue) => setSelectedOption(newValue)}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search trait..."
              variant="outlined"
              fullWidth
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          )}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedOption && !inputValue}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchSection;