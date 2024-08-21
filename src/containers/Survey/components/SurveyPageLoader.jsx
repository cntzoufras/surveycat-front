import React, { useState, useEffect } from 'react';
import { CircularProgress as MuiCircularProgress } from '@mui/material';
import SurveyPage from './SurveyPage';
import { getSurveyPage, getSurveyQuestions } from '../../../utils/api/survey-api';

const SurveyPageLoader = ({ surveyId, surveyPageId }) => {
  console.log(`surveypageloader loads ${surveyId} , ${surveyPageId}`);
  const [surveyPage, setSurveyPage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
  const fetchSurveyPageData = async () => {
    try {
      console.log('Fetching survey page data');
      
      const surveyPageResponse = await getSurveyPage(surveyPageId);
        const surveyPageData = Array.isArray(surveyPageResponse.data) ? surveyPageResponse.data[0] : surveyPageResponse.data;
        
        if (!surveyPageData) {
          throw new Error('Survey page data is missing or invalid');
        }
        
        setSurveyPage({
          title: surveyPageData.title || 'Untitled Survey Page',
          description: surveyPageData.description || 'No description available.',
          ...surveyPageData,
        });

      const questionsResponse = await getSurveyQuestions(surveyId, surveyPageId);
      console.log('Survey questions response:', questionsResponse.data);
      setQuestions(questionsResponse.data.data || []); // Handle cases with no questions

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching survey page or questions:', error);

      if (error.message === 'Survey ID or Survey Page ID is missing') {
        setError('Invalid URL. Please navigate through the application.');
      } else {
        setError('Error fetching survey page or questions');
      }

      setIsLoading(false);
    }
  };

  if (surveyId && surveyPageId) {
    fetchSurveyPageData();
  } else {
    setError('Survey ID or Survey Page ID is missing');
    setIsLoading(false);
  }
}, [surveyId, surveyPageId]);


  if (isLoading) {
    return <MuiCircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!surveyPage) {
    return <div>Error loading survey page: No survey page found.</div>;
  }

  // Pass the surveyPage data and questions to SurveyPage component
  return <SurveyPage surveyPage={surveyPage} questions={questions} />;
};

export default SurveyPageLoader;