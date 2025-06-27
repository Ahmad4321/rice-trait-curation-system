// src/components/EvidenceAccordion.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  Link,
  DialogContent,
  Typography,
  TextField,
  Grid,
  Button,
  Backdrop,
  CircularProgress,Radio,RadioGroup,FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const columns = [
  { field: "alterome_Gene", headerName: "Gene", width: 90 },
  {
    field: "alterome_PMID",
    headerName: "PMID",
    width: 90,
    renderCell: (params) => (
      <Link
        href={"https://pubmed.ncbi.nlm.nih.gov/" + params.value + "/"}
        target="_blank"
        underline="hover"
      >
        {params.value}
      </Link>
    ),
  },
  { field: "alterome_sentence", headerName: "Sentence", width: 800 },
];
const columns_pub = [
  {
    field: "alterome_PMID",
    headerName: "PMID",
    width: 90,
    renderCell: (params) => (
      <Link
        href={"https://pubmed.ncbi.nlm.nih.gov/" + params.value + "/"}
        target="_blank"
        underline="hover"
      >
        {params.value}
      </Link>
    ),
  },
  {
    field: "pubannotation_project_name",
    headerName: "Project Name",
    width: 150,
  },
  { field: "pubannotation_text", headerName: "Text", width: 800 },
];
const columnsLLM = [
  {
    field: "trait_name",
    headerName: "Name",
    width: 90,
  },
  {
    field: "created_date",
    headerName: "Date",
    width: 300,
    renderCell : (params) => {
      const date = new Date(params.value);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    },
  },
  { field: "LLM_response", headerName: "LLM Response", width: 800 },
];

const paginationModel = { page: 0, pageSize: 10 };
const paginationModel_pub = { page: 0, pageSize: 10 };
const paginationModel_llm = { page: 0, pageSize: 10 };
const EvidenceAccordion = ({ trait }) => {
  const [value, setValue] = React.useState(0);
  const [selectedRowRice, setSelectedRowRice] = useState(null);
  const [selectedRowPub, setSelectedRowPub] = useState(null);
  const [selectedRowLLM, setSelectedRowLLM] = useState(null);
  const [llmAPIKey, setllmAPIKey] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [llmResults, setllmResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    if (trait) {
      setInputPrompt(trait.llmPrompt);
    } else {
      setInputPrompt("");
    }
  }, [trait]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRowClickRice = (params) => {
    if (selectedRowRice && selectedRowRice.id === params.row.id) {
      setSelectedRowRice(null); // close popup if clicking same row again
    } else {
      setSelectedRowRice(params.row); // show new popup
    }
  };
  const handleRowClickPub = (params) => {
    if (selectedRowPub && selectedRowPub.id === params.row.id) {
      setSelectedRowPub(null); // close popup if clicking same row again
    } else {
      setSelectedRowPub(params.row); // show new popup
    }
  };

  const handleRowClickLLM = (params) => {
    if (selectedRowLLM && selectedRowPub.id === params.row.id) {
      setSelectedRowLLM(null); // close popup if clicking same row again
    } else {
      setSelectedRowLLM(params.row); // show new popup
    }
  };

  const LLMQuerySubmit = async () => {
    setLoading(true);
    try {
      const body = JSON.stringify({
        llm_api_key: llmAPIKey,
        input_prompt: inputPrompt,
        trait_primary_id: trait.trait_val,
        trait_selected_name: trait.trait_name,
        llm_tool:action
      });

      const res = await fetch(
        "http://127.0.0.1:8000/rice_trait_ontology_curation_system/api-request/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        }
      );
      if (res.ok) {
        const data = await res.json()
        if (data.code !== 200) { 
          setErrorMsg(data.error)
          setLoading(false);
        } else {
          setllmResults(data.result)
          setErrorMsg("")
          setLoading(false);

        }
        
      }
    } catch (error) {
      setErrorMsg("Contact Administrator!")
      setLoading(false);

    }
     setLoading(false);
  };
  return (
    <Paper elevation={2}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Rice-Alterome" {...a11yProps(0)} />
            <Tab label="PubAnnotation" {...a11yProps(1)} />
            <Tab label="LLM Responses" {...a11yProps(2)} />
            <Tab label="LLM Prompt Query" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {trait ? (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                stickyHeader
                rows={trait.rice_alterome_evidence}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 20]}
                sx={{
                  // Customize the selected row background color
                  "& .MuiDataGrid-row.Mui-selected": {
                    bgcolor: "rgba(25, 118, 210, 0.3)", // light blue
                    "&:hover": {
                      bgcolor: "rgba(25, 118, 210, 0.5)", // darker on hover
                    },
                  },
                }}
                onRowClick={handleRowClickRice}
              />
            </div>
          ) : (
            "No Data Found!"
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {trait ? (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                stickyHeader
                rows={trait.pubannotation_evidence}
                columns={columns_pub}
                initialState={{ pagination: { paginationModel_pub } }}
                pageSizeOptions={[10, 20]}
                sx={{
                  // Customize the selected row background color
                  "& .MuiDataGrid-row.Mui-selected": {
                    bgcolor: "rgba(25, 118, 210, 0.3)", // light blue
                    "&:hover": {
                      bgcolor: "rgba(25, 118, 210, 0.5)", // darker on hover
                    },
                  },
                }}
                onRowClick={handleRowClickPub}
              />
            </div>
          ) : (
            "No Data Found!"
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {trait ? (
            <>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  stickyHeader
                  rows={trait.LLM_Trait_information}
                  columns={columnsLLM}
                  initialState={{ pagination: { paginationModel_llm } }}
                  pageSizeOptions={[10, 20]}
                  sx={{
                    // Customize the selected row background color
                    "& .MuiDataGrid-row.Mui-selected": {
                      bgcolor: "rgba(25, 118, 210, 0.3)", // light blue
                      "&:hover": {
                        bgcolor: "rgba(25, 118, 210, 0.5)", // darker on hover
                      },
                    },
                  }}
                  onRowClick={handleRowClickLLM}
                />
              </div>
            </>
          ) : (
            "No Response Found"
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {trait ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item size={6}>
                  <TextField
                    label="LLM Authentication Key"
                    type="password"
                    onChange={(e) => setllmAPIKey(e.target.value)}
                    id="apikey"
                    name="apikey"
                    fullWidth
                  />
                  <Typography
                    variant="caption"
                    color="red"
                    sx={{ mt: 0.5, ml: 1 }}
                  >
                    *Note: Curation System is not saving the LLM API sensitive
                    key.
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                                <Typography
                    variant="caption"
                    sx={{ mt: 0.5, ml: 1 }}
                  >
                    LLM Tools
                  </Typography>
                                <RadioGroup
                                  row
                                  value={action}
                                  onChange={(e) => setAction(e.target.value)}
                                >
                                  <FormControlLabel value="KIMI" control={<Radio />} label="KIMI" />
                                  <FormControlLabel
                                    value="DEEPSEEK"
                                    control={<Radio />}
                                    label="DeepSeek"
                                  />
                                </RadioGroup>
                            </Box>
                  <TextField
                    id="formDataTextArea"
                    label="LLM Prompt"
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Enter your query here..."
                    multiline
                    value={inputPrompt}
                    rows={10}
                    fullWidth
                    sx={{ mt: 2, paddingTop: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="red"
                    sx={{ mt: 0.5, ml: 1 }}
                  >{errorMsg}
                  </Typography>

                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={LLMQuerySubmit}
                    sx={{ mt: 2 }}
                    id="showDataButton"
                    disabled={!inputPrompt || !llmAPIKey } 
                  >
                    Query LLM
                  </Button>
                </Grid>

                <Grid item size={6}>
                  <TextField
                    id="formDataTextArearesults"
                    label="LLM Results/Existing LLM Results"
                    multiline
                    rows={13}
                    fullWidth
                    value={llmResults}
                    sx={{}}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            "No Data Found!"
          )}
        </CustomTabPanel>
      </Box>
      <Dialog
        open={Boolean(selectedRowRice)}
        onClose={() => setSelectedRowRice(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          {selectedRowRice && (
            <>
              <Typography>
                <strong>PMID:</strong>{" "}
                <Link
                  href={
                    "https://pubmed.ncbi.nlm.nih.gov/" +
                    selectedRowRice.alterome_PMID +
                    "/"
                  }
                  target="_blank"
                >
                  {selectedRowRice.alterome_PMID}
                </Link>
              </Typography>
              <Typography>
                <strong>Gene:</strong> {selectedRowRice.alterome_Gene}
              </Typography>
              <Typography>
                <strong>Paper Title:</strong> {selectedRowRice.alterome_title}
              </Typography>
              <Typography>
                <strong>Sentence:</strong>
              </Typography>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{
                  __html: selectedRowRice.alterome_sentence,
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(selectedRowPub)}
        onClose={() => setSelectedRowPub(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          {selectedRowPub && (
            <>
              <Typography>
                <strong>PMID:</strong> {selectedRowPub.alterome_PMID}{" "}
                <Link
                  href={
                    "https://pubmed.ncbi.nlm.nih.gov/" +
                    selectedRowPub.alterome_PMID +
                    "/"
                  }
                  target="_blank"
                >
                  {" "}
                  NCBI{" "}
                </Link>
                |{" "}
                <Link
                  href={
                    "https://pubannotation.org/docs/sourcedb/PubMed/sourceid/" +
                    selectedRowPub.alterome_PMID +
                    "/"
                  }
                  target="_blank"
                >
                  {" "}
                  PubAnnotation{" "}
                </Link>
              </Typography>
              <Typography>
                <strong>Project Name:</strong>{" "}
                {selectedRowPub.pubannotation_project_name}
              </Typography>
              <Typography>
                <strong>Text:</strong> {selectedRowPub.pubannotation_text}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedRowLLM)}
        onClose={() => setSelectedRowLLM(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          {selectedRowLLM && (
            
            <>
              <Typography>
                <strong>Trait Name:</strong> {selectedRowLLM.trait_name}{" "}
              </Typography>
              <Typography>
                <strong>LLM Prompt:</strong>{" "}
                {selectedRowLLM.LLM_Prompt}
              </Typography>
              <Typography>
                <strong>Text:</strong> {selectedRowLLM.LLM_response}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default EvidenceAccordion;
