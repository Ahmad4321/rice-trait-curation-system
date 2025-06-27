import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import SearchSection from "./SearchSection";
import TraitHierarchy from "./TraitHierarchy";
import ActionPanel from "./ActionPanel";
import EvidenceAccordion from "./EvidenceAccordion";
import searchdata from "../assets/OutputSearch.json";
import Header from './Header';
import Footer from './Footer';


const CurationSystem = () => {
  // define trait data
  const [traitData, setTraitData] = useState(null);
  const [evaluationValue, setEvaluationValue] = useState(null);

  const [setSelectedNodeId] = useState(null);

  const [searchinital, setSearchinital] = useState(null);

  const [loading, setLoading] = useState(true);

  const [searchResult, setSearchResult] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [openLogin, setOpenLogin] = useState(false); 
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [msg, setMsg] = useState("");
  const [userData, setUserData] = useState(null); 

  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);
  const [selectedTrait, setSelectedTrait] = useState(null);

  const handleLoginSubmit = async () => {
    setLoading(true);
    try {
      
      if (username && password) {
        const res = await fetch("http://127.0.0.1:8000/rice_trait_ontology_curation_system/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: password }),
        });
        const data = await res.json();
        if (res.ok) {
          setMsg("login successful!");
          //  data into state
          setUserData(data.user);

         
          setUsername("");
          setPassword("");

          
          setIsLoggedIn(true);
          setOpenLogin(false);
        } else {
          if (res.status === 401) setMsg("Invalid credentials");
          else if (res.status === 403) setMsg("Permission denied");
          else if (res.status === 404) setMsg("User not found");
        }
      }
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
   
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/rice_trait_ontology_curation_system/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setUserData(null);
        setIsLoggedIn(false);
        setMsg("");
      }
    } catch (error) {
      // console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/rice_trait_ontology_curation_system/get_data_json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setTraitData(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/rice_trait_ontology_curation_system/curation_system_trait/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.ok) {
          const data = await res.json();
          data.length>0 ? setSearchinital(data) : setSearchinital(searchdata);
        }
      } catch (error) {
        
      }
    };

    fetchData();
  }, []);


  return (
    <>
    <Header/>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ my: 4 }}>
        {/* <Header /> */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={isLoggedIn ? handleLogout : handleLoginOpen}
          >
            {isLoggedIn ? "Sign Out" : "Sign In"}
          </Button>
        </Box>
        <Divider textAlign="center"></Divider>
        <>
          <SearchSection onSearchSubmit={setSearchResult} data={searchinital} />

          <Grid container spacing={3} sx={{ mt: 2,paddingBottom:12 }} className="grid-container">
            <Grid item size={6} >
              <Paper elevation={2} sx={{ p: 2, height: "500px", overflowY: "auto" }}>
                <TraitHierarchy
                  searchResult={searchResult}
                  data={traitData}
                  onTraitSelect={setSelectedTrait}
                  setSelectedNodeId={setSelectedNodeId}
                  onEvaluationValue={setEvaluationValue}
                />
              </Paper>
            </Grid>
            <Grid item size={6}>
              <Paper elevation={2} sx={{ p: 2, height: "500px", overflowY: "auto"}}>
                <ActionPanel
                  data={searchinital}
                  isLogged={isLoggedIn}
                  userData={userData}
                  trait={selectedTrait}
                  searchquery={searchResult}
                  onEvaluationValue={evaluationValue}
                />
              </Paper>
            </Grid>
            {selectedTrait && (
                <Grid item size={12}>
                <EvidenceAccordion trait={evaluationValue} />
              </Grid>)
}
          </Grid>
        </>
        {/* <Footer /> */}
      </Container>
      <Footer />
      <Dialog open={openLogin} onClose={handleLoginClose}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setMsg("");
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography variant="body2" color="error">
            {msg}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleLoginClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLoginSubmit}
            color="primary"
            variant="contained"
            disabled={ !username || !password } 
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CurationSystem;
