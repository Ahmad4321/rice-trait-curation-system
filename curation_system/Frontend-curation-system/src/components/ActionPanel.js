// src/components/ActionPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  TableContainer,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";

const ActionPanel = ({
  isLogged,
  trait,
  userData,
  searchquery,
  onEvaluationValue,
}) => {
  const [newComment, setNewComment] = useState("");
  const [action, setAction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [evaluationValue, setEvaluationValue] = useState("");
  const [traitInformation, setTraitInformation] = useState("");

  const [username, setUsername] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [edit_comment, setEdit_comment] = useState("");
  const [rowId, setRowId] = useState(null);
  const [rows, setRows] = useState(evaluationValue ? evaluationValue : null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setEdit_comment(row.evaluation);
    setRowId(row.id);
    setOpen(true);
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const body = JSON.stringify({
        evo_id: rowId,
        comment: edit_comment,
        trait_id: trait.id,
      });
      const res = await fetch(
        "http://127.0.0.1:8000/rice_trait_ontology_curation_system/edit-evaluation/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );
      if (res.ok) {
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === selectedRow.id ? selectedRow : row))
        );
        setLoading(false);
        setOpen(false);
        setSelectedRow(null);
      } else {
        setLoading(false);
        setOpen(false);
        setSelectedRow(null);
      }
    } catch (error) {
      setLoading(false);
      setOpen(false);
      setSelectedRow(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    if (userData?.username) {
      setUsername(userData.username);
    } else {
      setUsername("");
    }
  }, [userData]);

  useEffect(() => {
    if (onEvaluationValue) {
      setEvaluationValue(onEvaluationValue.data);
      setRows(onEvaluationValue.data);
      setTraitInformation(onEvaluationValue.Trait_information);
    } else {
      setEvaluationValue([]);
      setTraitInformation(null);
    }
  }, [onEvaluationValue]);

  const handleevoSubmit = async () => {
    setLoading(true);
    if (!newComment || !username) {
      setMsg("❌ Please fill in all fields.");
      return;
    }

    const payload = {
      expert_name: userData?.username || username || "",
      user: userData ? userData : null,
      trait: trait,
      function: action,
      comment: newComment,
      searchTerm: searchTerm,
    };

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/rice_trait_ontology_curation_system/save_action_evaluation/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMsg("✅" + data.msg);
        setEvaluationValue((prev) => [...prev, data.evaluation]);
        setNewComment("");
        setAction("");
        setSearchTerm("");
        isLogged ? setUsername(username) : setUsername("");
        setLoading(false);
      } else {
        setMsg(data.error || "❌ Submission failed.");
        setLoading(false);
      }
    } catch (err) {
      setMsg("❌ Error connecting to server.");
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        {trait && (
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            <strong>Selected trait</strong> : {trait.ename}
          </Typography>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <strong>Trait Definition</strong>
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead></TableHead>
              <TableBody>
                {traitInformation
                  ? traitInformation.map((row, index) => (
                      <>
                        {row.trait_ontology_id && (
                          <TableRow key={index + "1"}>
                            <TableCell>
                              {" "}
                              <strong>ID</strong>
                            </TableCell>
                            <TableCell>{row.trait_ontology_id}</TableCell>
                          </TableRow>
                        )}
                        {row.sentence && (
                          <TableRow key={index + "2"}>
                            <TableCell>
                              <strong>Definition</strong>
                            </TableCell>
                            <TableCell>{row.sentence}</TableCell>
                          </TableRow>
                        )}
                        {row.is_a && (
                          <TableRow key={index + "3"}>
                            <TableCell>
                              <strong>is_a</strong>
                            </TableCell>
                            <TableCell>{row.is_a}</TableCell>
                          </TableRow>
                        )}
                        {row.synonym && (
                          <TableRow key={index + "4"}>
                            <TableCell>
                              <strong>Synonym</strong>
                            </TableCell>
                            <TableCell>{row.synonym}</TableCell>
                          </TableRow>
                        )}
                        {row.comment && (
                          <TableRow key={index + "5"}>
                            <TableCell>
                              <strong>Comment</strong>
                            </TableCell>
                            <TableCell>{row.comment}</TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  : ""}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <strong>Expert Comments</strong>
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Comment</TableCell>
                  <TableCell>Expert</TableCell>
                  <TableCell>DateTime</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  ? rows.map((row, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(row)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{row.evaluation}</TableCell>
                        <TableCell>{row.expert_name}</TableCell>
                        <TableCell>
                          {format(
                            new Date(row.created_at),
                            "MMMM dd, yyyy hh:mm:ss a"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  : ""}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box gap={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            label="Expert Comment"
            rows={3}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setMsg("");
            }}
            variant="outlined"
            placeholder="Add your comment here..."
          />
          <Box sx={{ mb: 3 }} display="flex" paddingTop={2}>
            <TextField
              label="Expert Name"
              size="small"
              value={username}
              placeholder="e.g. John Doe|Field Name or Lab Name"
              onChange={(e) => {
                setUsername(e.target.value);
                setMsg("");
              }}
              disabled={!!userData?.username}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Box>

        {isLogged === true && (
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Fucntions</FormLabel>
              <RadioGroup
                row
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <FormControlLabel value="add" control={<Radio />} label="Add" />
                <FormControlLabel
                  value="merge"
                  control={<Radio />}
                  label="Merge"
                />
                <FormControlLabel
                  value="remain"
                  control={<Radio />}
                  label="Remain"
                />
                <FormControlLabel
                  value="remove"
                  control={<Radio />}
                  label="Remove"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
        <Typography variant="body2" color="error">
          {msg}
        </Typography>
        <Box display="flex" alignItems="center" paddingTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleevoSubmit}
            fullWidth
            disabled={!newComment || !username || !trait}
          >
            Save Evaluation
          </Button>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "500px",
            height: "350px",
            maxWidth: "none",
          },
        }}
      >
        {selectedRow && (
          <>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <DialogTitle>Edit By : {selectedRow.expert_name}</DialogTitle>
            <DialogContent>
              <Typography sx={{ padding: 3, color: "green" }}>
                <strong>*Note:</strong> Please update your comment below.
              </Typography>
              <TextField
                fullWidth
                multiline
                label="Expert Comment"
                rows={3}
                name="evaluation"
                value={edit_comment}
                onChange={(e) => {
                  setEdit_comment(e.target.value);
                  console.log(e.target);
                  const { name, value } = e.target;
                  console.log(name, value);
                  setSelectedRow((prev) => ({
                    ...prev,
                    [name]: name === "evaluation" ? value : value,
                  }));
                  console.log(selectedRow);
                  setMsg("");
                }}
                variant="outlined"
                placeholder="Add your comment here..."
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditSubmit}
              >
                Save Evaluation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ActionPanel;
