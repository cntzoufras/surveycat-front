import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector hook
import {
 Box as MuiBox, Typography as MuiTypography, TextField as MuiTextField, Button as MuiButton, FormControl as MuiFormControl, InputLabel as MuiInputLabel, Select as MuiSelect, MenuItem as MuiMenuItem, 
} from '@mui/material';
import styled from '@emotion/styled';
import {
 getSurveyCategories, getSurveyThemes, createSurvey, createSurveyPage, 
} from '@/utils/api/survey-api.js';
import { useNavigate } from 'react-router-dom';
import FontSelector from './FontSelector';
import useSurveyPages from '../hooks/useSurveyPages';

const MuiStyledFormControl = styled(MuiFormControl)`
  margin-bottom: 1rem;
  min-height: 56px; // Ensure a consistent height
`;

const CustomInputLabel = styled(MuiInputLabel)`
  background-color: transparent; /* This removes the white background */
  color: white; /* Sets the text color to white */
`;

const MuiStyledErrorBox = styled(MuiBox)`
  margin-top: 1rem;
  background-color: #f44336;
  color: white;
  padding: 1rem;
  border-radius: 4px;
`;

const SurveyForm = ({ user_id }) => {
  console.log(`SurveyForm user_id: ${user_id}`);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyCategories, setSurveyCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [surveyThemes, setSurveyThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedFont, setSelectedFont] = useState('Roboto'); // Default font

  const navigate = useNavigate();
  
   useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const categoriesResponse = await getSurveyCategories();
        const themesResponse = await getSurveyThemes();
        if (isMounted) {
          setSurveyCategories(categoriesResponse.data.data);
          setSurveyThemes(themesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, []);
  
  const { addSurveyPage } = useSurveyPages();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        survey_category_id: selectedCategoryId,
        theme_id: selectedThemeId,
        user_id,
      };
    
      const response = await createSurvey(surveyData);
      const surveyId = response.data.id;
      
      const surveyPageData = {
        title: '',
        description: '',
        survey_id: surveyId,
      };

      const surveyPageResponse = await addSurveyPage(surveyPageData);
      console.log('survey page response einai: ', surveyPageResponse);
      const surveyPageId = surveyPageResponse.data.id;
      
      navigate(`/surveys/${surveyId}/survey-pages/${surveyPageId}`, {
      state: { surveyData, surveyPageData },
    });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error('Error creating survey:', error);
      }
    }
  };
  
  return (
    <MuiBox mb={3} sx={{ fontFamily: 'Roboto, Arial, sans-serif', width: 800, maxWidth: 800 }}>
      <form onSubmit={handleSubmit}>
        <FontSelector selectedFont={selectedFont} setSelectedFont={setSelectedFont} />
        <MuiBox style={{ fontFamily: selectedFont }}>

          <MuiTextField
            fullWidth
            label="Survey Title"
            variant="outlined"
            margin="normal"
            value={surveyTitle}
            onChange={e => setSurveyTitle(e.target.value)}
            required
          />
          <MuiTextField
            fullWidth
            label="Survey Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={12}
            value={surveyDescription}
            onChange={e => setSurveyDescription(e.target.value)}
          />
          <MuiStyledFormControl fullWidth required>
            <CustomInputLabel id="category-label" shrink={Boolean(selectedCategoryId)}>
              Category
            </CustomInputLabel>
            <MuiSelect
              labelId="category-label"
              name="Process"
              id="category-select"
              value={selectedCategoryId}
              label="Category"
              onChange={e => setSelectedCategoryId(e.target.value)}
              sx={{ width: '100%', maxWidth: 400 }}
            >
              <MuiMenuItem value="" disabled>
                <em>Select Category</em>
              </MuiMenuItem>
              {surveyCategories.map(category => (
                <MuiMenuItem key={category.id} value={category.id} sx={{ lineHeight: 1.5 }}>
                  {category.title}
                </MuiMenuItem>
              ))}
            </MuiSelect>
          </MuiStyledFormControl>
          <MuiStyledFormControl fullWidth>
            <CustomInputLabel id="theme-label" shrink={Boolean(selectedThemeId)}>
              Theme
            </CustomInputLabel>
            <MuiSelect
              labelId="theme-label"
              name="Process-theme"
              id="theme-select"
              value={selectedThemeId}
              label="Theme"
              onChange={e => setSelectedThemeId(e.target.value)}
              sx={{ maxWidth: 400 }}
              
            >
              <MuiMenuItem value="" disabled>
                <em>Select Theme</em>
              </MuiMenuItem>
              {surveyThemes.map(theme => (
                <MuiMenuItem key={theme.id} value={theme.id} sx={{ lineHeight: 1.5 }}>
                  {theme.title}
                </MuiMenuItem>
              ))}
            </MuiSelect>
          </MuiStyledFormControl>
        </MuiBox>
        <MuiBox display="flex" justifyContent="center" mt={2}>
          <MuiButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              padding: '12px 24px',
              fontSize: '1rem',
            }}
          >
            Create New Survey
          </MuiButton>
        </MuiBox>
        {Object.keys(validationErrors).length > 0 && (
          <MuiStyledErrorBox marginTop="1rem" bgcolor="#f44336" color="white" padding="1rem" borderRadius="4px">
            {Object.keys(validationErrors).map(key => (
              <MuiTypography key={key}>{validationErrors[key]}</MuiTypography>
            ))}
          </MuiStyledErrorBox>
        )}
      </form>
    </MuiBox>
  );
};

export default SurveyForm;