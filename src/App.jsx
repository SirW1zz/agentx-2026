import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  // Grid, // REMOVED Grid
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Send as SendIcon,
  AccountCircle,
  EventNote,
  AddTask,
  CalendarMonth,
  Groups
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import gsap from 'gsap';

// --- 1. Theme Definition ---
const m3Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7cbf7b',
    },
    secondary: {
      main: '#3b8c5a',
    },
    background: {
      default: '#0d1a12',
      paper: '#1a2e21',
    },
    text: {
      primary: '#e8f5e9',
      secondary: '#a3d9a1',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontFamily: '"Instrument Serif", serif',
      fontWeight: 400,
    },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }),
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: { 
            backgroundColor: 'transparent',
            width: '100%', 
            maxWidth: '100%',
            overflow: 'visible' 
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: '#0d1a12',
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          },
        }),
        today: ({ theme }) => ({ borderColor: theme.palette.primary.main }),
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: { paddingLeft: 0 },
        label: ({ theme }) => ({ color: theme.palette.text.primary, fontWeight: 600 }),
        switchViewButton: ({ theme }) => ({ color: theme.palette.text.primary })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.palette.text.primary })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.palette.text.primary })
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          '&.Mui-checked': { color: theme.palette.primary.main }
        })
      }
    }
  },
});

// --- 2. Styled Components ---
const GradientSearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 50,
  padding: '4px',
  background: 'linear-gradient(90deg, #7cbf7b 0%, #3b8c5a 100%)',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
}));

const SearchInner = styled('div')(({ theme }) => ({
  backgroundColor: '#1a2e21',
  borderRadius: 46,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
    width: '100%',
    fontWeight: 500,
    '&::placeholder': { color: theme.palette.text.secondary, opacity: 0.5 }
  },
}));

// --- 3. Main App Component ---
function App() {
  const [date, setDate] = useState(new Date());
  const [checked, setChecked] = useState([0, 1, 2]);

  // ANIMATION STATE
  const [isAnimating, setIsAnimating] = useState(true);
  const mindTextRef = useRef(null);

  // GSAP Animation Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = mindTextRef.current.querySelectorAll('.mind-char');

      if (isAnimating) {
        gsap.to(chars, {
          y: -15, 
          ease: "sine.inOut", 
          duration: 0.6, 
          stagger: {
            each: 0.1, 
            repeat: -1, 
            yoyo: true 
          }
        });
      } else {
        gsap.killTweensOf(chars);
        gsap.to(chars, {
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }, mindTextRef);

    return () => ctx.revert();
  }, [isAnimating]);

  // Timer to stop animation
  useEffect(() => {
    let timer;
    if (isAnimating) {
      timer = setTimeout(() => {
        setIsAnimating(false);
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isAnimating]);


  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const wordToAnimate = "mind";

  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden'
      }}>

        {/* --- Top Bar --- */}
        <AppBar position="static" elevation={0} sx={{ pt: 1, backgroundColor: 'background.paper', borderBottom: '1px solid #2f4836' }}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                ml: 1,
                color: 'text.primary',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}
            >
              Agenta
            </Typography>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle sx={{ fontSize: 32 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={isMenuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { backgroundColor: '#1a2e21', color: 'white' },
              }}
            >
              <MenuItem onClick={handleMenuClose}>Sign In</MenuItem>
              <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* --- Main Content --- */}
        <Box
          component="div"
          sx={{
            px: 4,
            py: 4,
            flexGrow: 1,
            width: '100%',
            maxWidth: 'none !important',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Header & Search Section */}
          <Box sx={{ textAlign: 'center', mb: 10, mt: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                mb: 6,
                color: 'text.primary',
                fontFamily: '"Instrument Serif", serif',
                fontSize: '4.5rem',
                letterSpacing: '0.01em',
                wordSpacing: '0.05em',
              }}
            >
              What do you have in
              <Box
                component="span"
                ref={mindTextRef}
                sx={{
                  fontStyle: 'italic',
                  color: 'secondary.main',
                  display: 'inline-block',
                  ml: 1.5,
                  mr: 1.5,
                  whiteSpace: 'nowrap'
                }}
              >
                {wordToAnimate.split('').map((char, index) => (
                  <span
                    key={index}
                    className="mind-char"
                    style={{ display: 'inline-block', minWidth: char === ' ' ? '1rem' : 'auto' }}
                  >
                    {char}
                  </span>
                ))}
              </Box>
              today?
            </Typography>

            <GradientSearchBox>
              <SearchInner>
                <StyledInputBase
                  placeholder="Schedule a meeting..."
                  inputProps={{ 'aria-label': 'schedule a meeting' }}
                />
                <IconButton
                  sx={{ p: '10px', color: 'primary.main' }}
                  aria-label="send"
                  onClick={() => console.log("Sent!")}
                >
                  <SendIcon />
                </IconButton>
              </SearchInner>
            </GradientSearchBox>
          </Box>

          {/* Widgets Grid REPLACEMENT - Flexbox for Equal Widths */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' }, // Stack on small, Row on large
            gap: 4,
            alignItems: 'stretch',
            width: '100%',
          }}>
            
            {/* Widget 1: Today's Task */}
            {/* flex: 1 combined with minWidth: 0 forces equal width division */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AddTask sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Today’s task</Typography>
                  </Box>
                  <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                    {[0, 1, 2].map((value) => {
                      const labelId = `checkbox-list-label-${value}`;
                      return (
                        <ListItem
                          key={value}
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              onChange={handleToggle(value)}
                              checked={checked.indexOf(value) !== -1}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton onClick={handleToggle(value)} dense>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <EventNote sx={{ color: 'text.secondary' }} />
                            </ListItemIcon>
                            <ListItemText
                              id={labelId}
                              primary={`Task name ${value + 1}`}
                              primaryTypographyProps={{ fontWeight: 500 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Box>

            {/* Widget 2: Calendar */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Select date</Typography>
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateCalendar
                      value={date}
                      onChange={(newValue) => setDate(newValue)}
                      showDaysOutsideCurrentMonth
                      fixedWeekNumber={6}
                      sx={{
                        width: '100%',
                        overflow: 'visible',
                        [`& .${pickersLayoutClasses.contentWrapper}`]: { alignItems: 'center' }
                      }}
                    />
                  </LocalizationProvider>
                </CardContent>
              </Card>
            </Box>

            {/* Widget 3: Upcoming Meetings */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Groups sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Upcoming meetings</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'text.secondary' }}>
                    <Typography variant="body2">No meetings scheduled</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'transparent' }}>
          <Typography variant="body2" color="text.secondary">
            © IT Mambas / Gemini can make mistakes, so double-check it.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;