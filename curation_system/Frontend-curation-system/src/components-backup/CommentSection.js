// src/components/CommentSection.jsx
import React from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const existingComments = [
  {
    id: 1,
    comment: "This trait needs verification",
    name: "Researcher A",
    date: "2023-05-15",
  },
  {
    id: 2,
    comment: "Related to drought resistance",
    name: "Researcher B",
    date: "2023-05-16",
  },
];

const CommentSection = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Comments
      </Typography>

      <List dense>
        {existingComments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={`${comment.id}- ${comment.comment} -${comment.name}-${comment.date}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
        New Comments
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Add your comment here..."
      />
    </Box>
  );
};

export default CommentSection;