// src/components/EvidenceAccordion.jsx
import React, { useState } from "react";
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

const paginationModel = { page: 0, pageSize: 10 };
const paginationModel_pub = { page: 0, pageSize: 10 };
const EvidenceAccordion = ({ trait }) => {
  const [value, setValue] = React.useState(0);
  const [selectedRowRice, setSelectedRowRice] = useState(null);
  const [selectedRowPub, setSelectedRowPub] = useState(null);

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
  return (
    <Paper elevation={2}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Rice-Alterome" {...a11yProps(0)} />
            <Tab label="PubAnnotation" {...a11yProps(1)} />
            <Tab label="LLM" {...a11yProps(2)} />
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
          {"No data found!"}
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
    </Paper>
  );
};

export default EvidenceAccordion;
