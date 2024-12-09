import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Fade } from '@mui/material';
import { keyframes } from '@mui/system';
import { Email, Phone, LocationOn } from '@mui/icons-material'; // Import icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const HeroSection = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    padding: theme.spacing(4),
    borderRadius: '8px',
    margin: '10px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const DescriptionContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#e3f2fd', 
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: '3rem',
    fontFamily: "'Dancing Script', cursive",
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: theme.palette.secondary.main, 
}));

const Description = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    margin: theme.spacing(2, 0),
    opacity: 0,
    animation: `${fadeIn} 1s forwards`,
    color: '#000', 
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: '12px 24px',
    fontSize: '1.2rem',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
    display: 'flex',
    alignItems: 'center',
}));

const ContactInfo = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    borderRadius: '8px',
    color: '#fff',
    textAlign: 'center',
}));

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    marginTop: theme.spacing(2),
    color: '#ccc',
}));

const HomePage = () => {
    return (
        <Container maxWidth="lg">
            <Fade in={true} timeout={1000}>
                <HeroSection>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <DescriptionContainer>
                                <Title variant="h1">ACE SAT</Title>
                                <Description variant="body1">
                                    Your ultimate destination for SAT preparation. Join us to enhance your skills and achieve your dream score! 
                                    We provide comprehensive resources, including practice tests, study materials, and expert guidance tailored to help you succeed. 
                                    <Description>
                                    Our team of experienced educators is dedicated to ensuring you have the tools you need to excel. Prepare with confidence and 
                                    take the first step towards your future. Our platform is designed to adapt to your learning pace, offering personalized 
                                    feedback and progress tracking. Don't leave your success to chance—join thousands of satisfied students who have transformed 
                                    their SAT experience with us!
                                    </Description>
                                    
                                </Description>
                            </DescriptionContainer>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <ContactInfo>
                                <Typography variant="h6">Contact Us</Typography>
                                <Typography variant="body1"><Email /> support@acesat.com</Typography>
                                <Typography variant="body1"><Phone /> (123) 456-7890</Typography>
                                <Typography variant="body1"><LocationOn /> 123 SAT Prep Lane, Education City</Typography>
                            </ContactInfo>
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="flex-end">
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={() => window.location.href = '/login'}
                        >
                            Get Started <ArrowForwardIcon style={{ marginLeft: '8px' }} />
                        </StyledButton>
                    </Box>
                    <FooterText variant="body2">
                        © 2024 ACE SAT. All rights reserved. License information or other disclaimers can go here.
                    </FooterText>
                </HeroSection>
            </Fade>
        </Container>
    );
};

export default HomePage;