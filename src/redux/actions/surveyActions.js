import api from '@/utils/api/survey-api';

export const CREATE_SURVEY_QUESTION_SUCCESS = 'CREATE_SURVEY_QUESTION_SUCCESS';
export const CREATE_SURVEY_QUESTION_FAIL = 'CREATE_SURVEY_QUESTION_FAIL';
export const CREATE_SURVEY_QUESTION_CHOICES_SUCCESS = 'CREATE_SURVEY_QUESTION_CHOICES_SUCCESS';
export const CREATE_SURVEY_QUESTION_CHOICES_FAIL = 'CREATE_SURVEY_QUESTION_CHOICES_FAIL';
export const CREATE_SURVEY_SUCCESS = 'CREATE_SURVEY_SUCCESS';
export const CREATE_SURVEY_FAIL = 'CREATE_SURVEY_FAIL';
export const CREATE_SURVEY_PAGE_SUCCESS = 'CREATE_SURVEY_PAGE_SUCCESS';
export const CREATE_SURVEY_PAGE_FAIL = 'CREATE_SURVEY_PAGE_FAIL';

export const ADD_SURVEY_PAGE_SUCCESS = 'ADD_SURVEY_PAGE_SUCCESS';
export const ADD_SURVEY_PAGE_FAIL = 'ADD_SURVEY_PAGE_FAIL';

export const FETCH_SURVEY_CATEGORIES_SUCCESS = 'FETCH_SURVEY_CATEGORIES_SUCCESS';
export const FETCH_SURVEY_CATEGORIES_FAIL = 'FETCH_SURVEY_CATEGORIES_FAIL';
export const FETCH_SURVEY_THEMES_SUCCESS = 'FETCH_SURVEY_THEMES_SUCCESS';
export const FETCH_SURVEY_THEMES_FAIL = 'FETCH_SURVEY_THEMES_FAIL';

export const FETCH_SURVEY_QUESTIONS = 'FETCH_SURVEY_QUESTIONS';

export const FETCH_SURVEY_PAGES_SUCCESS = 'FETCH_SURVEY_PAGES_SUCCESS';
export const FETCH_SURVEY_PAGES_FAIL = 'FETCH_SURVEY_PAGES_FAIL';


export const FETCH_STOCK_SURVEYS_SUCCESS = 'FETCH_STOCK_SURVEYS_SUCCESS';
export const FETCH_STOCK_SURVEYS_FAIL = 'FETCH_STOCK_SURVEYS_FAIL';

export const UPDATE_SURVEY_TITLE_SUCCESS = 'UPDATE_SURVEY_TITLE_SUCCESS';
export const UPDATE_SURVEY_TITLE_FAIL = 'UPDATE_SURVEY_TITLE_FAIL';
export const UPDATE_SURVEY_DESCRIPTION_SUCCESS = 'UPDATE_SURVEY_DESCRIPTION_SUCCESS';
export const UPDATE_SURVEY_DESCRIPTION_FAIL = 'UPDATE_SURVEY_DESCRIPTION_FAIL';

export const UPDATE_SURVEY_PAGE_TITLE_SUCCESS = 'UPDATE_SURVEY_PAGE_TITLE_SUCCESS';
export const UPDATE_SURVEY_PAGE_TITLE_FAIL = 'UPDATE_SURVEY_PAGE_TITLE_FAIL';
export const UPDATE_SURVEY_PAGE_DESCRIPTION_SUCCESS = 'UPDATE_SURVEY_PAGE_DESCRIPTION_SUCCESS';
export const UPDATE_SURVEY_PAGE_DESCRIPTION_FAIL = 'UPDATE_SURVEY_PAGE_DESCRIPTION_FAIL';

export const UPDATE_SURVEY_LAYOUT_SUCCESS = 'UPDATE_SURVEY_LAYOUT_SUCCESS';
export const UPDATE_SURVEY_LAYOUT_FAIL = 'UPDATE_SURVEY_LAYOUT_FAIL';

export const DELETE_SURVEY_QUESTION_SUCCESS = 'DELETE_SURVEY_QUESTION_SUCCESS';
export const DELETE_SURVEY_QUESTION_FAIL = 'DELETE_SURVEY_QUESTION_FAIL';


export const fetchSurveyCategoriesAction = () => async (dispatch) => {
  try {
    const response = await api.get('/survey-categories');
    console.log('katigories einai: ', response.data.data);
    dispatch({ type: FETCH_SURVEY_CATEGORIES_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_SURVEY_CATEGORIES_FAIL, payload: error.message });
  }
};

export const fetchSurveyThemesAction = () => async (dispatch) => {
  try {
    const response = await api.get('/themes');
    dispatch({ type: FETCH_SURVEY_THEMES_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_SURVEY_THEMES_FAIL, payload: error.message });
  }
};

export const fetchSurveyPagesAction = (surveyId) => async (dispatch) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/pages`);
    dispatch({
      type: FETCH_SURVEY_PAGES_SUCCESS,
      payload: response.data, // Assuming response.data contains the list of survey pages
    });
  } catch (error) {
    dispatch({
      type: FETCH_SURVEY_PAGES_FAIL,
      payload: error.message,
    });
  }
};

// Action to fetch survey questions
export const fetchSurveyQuestionsAction = (surveyId, surveyPageId) => async (dispatch) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/pages/${surveyPageId}/questions`);
    dispatch({
      type: FETCH_SURVEY_QUESTIONS,
      payload: response.data, // Assuming response.data contains the list of questions
    });
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    // You can also dispatch an error action if needed
  }
};

export const fetchStockSurveysAction = () => async (dispatch) => {
  try {
    const response = await api.get('/surveys/stock');
    console.log(`Stock Surveys apo surveyAction response me data einai: `, response.data.data);
    dispatch({ type: FETCH_STOCK_SURVEYS_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_STOCK_SURVEYS_FAIL, payload: error.message });
    throw error;
  }
};

// Action to add a new survey page
export const addSurveyPageAction = (surveyId, newPageData) => async (dispatch) => {
  try {
    const response = await api.post(`/survey-pages`, newPageData);
    dispatch({ type: ADD_SURVEY_PAGE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: ADD_SURVEY_PAGE_FAIL, payload: error.message });
    throw error;
  }
};

export const createSurveyAction = (surveyData) => async (dispatch) => {
  try {
    const response = await api.post('/surveys', surveyData);
    dispatch({ type: CREATE_SURVEY_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: CREATE_SURVEY_FAIL, payload: error.message });
    throw error;
  }
};

export const createSurveyPageAction = (surveyPageData) => async (dispatch) => {
  try {
    const response = await api.post('/survey-pages', surveyPageData);
    dispatch({ type: CREATE_SURVEY_PAGE_SUCCESS, payload: response.data });
    return response.data; // Return survey page data for chaining actions
  } catch (error) {
    dispatch({ type: CREATE_SURVEY_PAGE_FAIL, payload: error.message });
    throw error;
  }
};

// Action to create a new survey question
export const createSurveyQuestionAction = (questionData) => async (dispatch) => {
  try {
    const response = await api.post('/survey-questions', questionData);
    dispatch({ type: CREATE_SURVEY_QUESTION_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: CREATE_SURVEY_QUESTION_FAIL, payload: error.message });
    throw error;
  }
};

// Action to delete a survey question
export const deleteSurveyQuestionAction = (surveyQuestionId) => async (dispatch) => {
  try {
    await api.delete(`/survey-questions/${surveyQuestionId}`);
    dispatch({ type: DELETE_SURVEY_QUESTION_SUCCESS, payload: surveyQuestionId });
  } catch (error) {
    dispatch({ type: DELETE_SURVEY_QUESTION_FAIL, payload: error.message });
    throw error;
  }
};

// Action to create survey question choices
export const createSurveyQuestionChoicesAction = (choicesData) => async (dispatch) => {
  try {
    const response = await api.post('/survey-question-choices', choicesData);
    dispatch({ type: CREATE_SURVEY_QUESTION_CHOICES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CREATE_SURVEY_QUESTION_CHOICES_FAIL, payload: error.message });
    throw error;
  }
};

// Action to update survey title
export const updateSurveyTitleAction = (surveyId, title) => async (dispatch) => {
  try {
    const response = await api.put(`/surveys/${surveyId}`, { title });
    dispatch({ type: UPDATE_SURVEY_TITLE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPDATE_SURVEY_TITLE_FAIL, payload: error.message });
    throw error;
  }
};
// Action to update survey description
export const updateSurveyDescriptionAction = (surveyId, description) => async (dispatch) => {
  try {
    const response = await api.put(`/surveys/${surveyId}`, { description });
    dispatch({ type: UPDATE_SURVEY_DESCRIPTION_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPDATE_SURVEY_DESCRIPTION_FAIL, payload: error.message });
    throw error;
  }
};

// Action to update survey page title
export const updateSurveyPageTitleAction = (surveyPageId, title) => async (dispatch) => {
  try {
    const response = await api.put(`/survey-pages/${surveyPageId}`, { title });
    dispatch({ type: UPDATE_SURVEY_PAGE_TITLE_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPDATE_SURVEY_PAGE_TITLE_FAIL, payload: error.message });
    throw error;
  }
};

export const updateSurveyPageDescriptionAction = (surveyPageId, description) => async (dispatch) => {
  try {
    const response = await api.put(`/survey-pages/${surveyPageId}`, { description });
    dispatch({ type: UPDATE_SURVEY_PAGE_DESCRIPTION_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPDATE_SURVEY_PAGE_DESCRIPTION_FAIL, payload: error.message });
    throw error;
  }
};

// Action to update survey layout
export const updateSurveyLayoutAction = (surveyId, layout) => async (dispatch) => {
  try {
    const response = await api.put(`/surveys/${surveyId}`, { layout });
    dispatch({ type: UPDATE_SURVEY_LAYOUT_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPDATE_SURVEY_LAYOUT_FAIL, payload: error.message });
    throw error;
  }
};
