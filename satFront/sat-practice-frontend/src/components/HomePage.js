import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import backgroundImage from './baground.jpg';

const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '100vh', 
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        zIndex: 1,
    },
    '& > *': {
        position: 'relative',
        zIndex: 2, 
    },
    animation: 'fadeIn 1.5s ease-out',
    '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(30px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: '6.5rem',
    fontWeight: 'bold',
    fontFamily: "'Poppins', sans-serif", 
    textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        fontSize: '3rem',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    padding: '12px 24px',
    fontSize: '1.2rem',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        fontSize: '1rem',
    },
}));

const ContactInfo = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(4),
    borderRadius: '8px',
    marginTop: theme.spacing(4),
    maxWidth: '800px',
    margin: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    '& svg': {
        marginRight: theme.spacing(1),
    },
}));

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    marginTop: theme.spacing(2),
    color: '#ccc',
    textAlign: 'center',
    position: 'relative',
    bottom: 0,
    width: '100%',
    padding: theme.spacing(2),
}));

const HomePage = () => {
    return (
        <>
            <HeroSection>
                <Box>
                    <Title variant="h1">
                        ACE SAT
                    </Title>
                    <Typography variant="h6" style={{ margin: '16px 0' }}>
                        Your ultimate destination for SAT preparation. Enhance your skills and achieve your dream score!
                    </Typography>
                </Box>
                <StyledButton onClick={() => (window.location.href = '/login')}>
                    Get Started <ArrowForwardIcon style={{ marginLeft: '8px' }} />
                </StyledButton>
            </HeroSection>

            <Box mt={4} px={2}>
                <ContactInfo>
                    <Typography variant="h6">Contact Us</Typography>
                    <Typography variant="body1">
                        <Email /> support@acesat.com
                    </Typography>
                    <Typography variant="body1">
                        <Phone /> 090 000 000
                    </Typography>
                    <Typography variant="body1">
                        <LocationOn /> 123 SAT Prep Lane, Education City
                    </Typography>
                </ContactInfo>
            </Box>

            <FooterText variant="body2">
                © 2024 ACE SAT. All rights reserved. License information or other disclaimers can go here.
            </FooterText>
        </>
    );
};

export default HomePage;
