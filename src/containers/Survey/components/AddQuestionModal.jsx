import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { createSurveyQuestion, createSurveyQuestionChoices } from '@/redux/actions/surveyActions';
import OptionInputList from './OptionInputList';

const AddQuestionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  validationErrors = {}, 
  surveyPages = [], 
  currentSurveyPageId,
  onAddNewPage, 
  }) => {
  const dispatch = useDispatch();
  const surveyState = useSelector(state => state.survey); // Accessing the survey state

  const [newQuestion, setNewQuestion] = useState('');
  const [surveyPage, setSurveyPage] = useState('');
  const [selectedSurveyPage, setSelectedSurveyPage] = useState(currentSurveyPageId || '');
  const [questionType, setQuestionType] = useState('1');
  const [numOptions, setNumOptions] = useState(2);
  const [optionInputs, setOptionInputs] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedQuestionTags, setSelectedQuestionTags] = useState([]);

  useEffect(() => {
      if (currentSurveyPageId) {
        setSelectedSurveyPage(currentSurveyPageId);
      }
    }, [currentSurveyPageId]);

  const handleQuestionInputChange = e => setNewQuestion(e.target.value);
  const handleSurveyPageChange = e => setSelectedSurveyPage(e.target.value);

  const handleSurveyPageInputChange = e => setSurveyPage(e.target.value);
  const handleQuestionTypeChange = (e) => {
    console.log(e.target.value);
    setQuestionType(e.target.value);
    if (e.target.value === 1 || e.target.value === 2) {
      setNumOptions(2);
      setOptionInputs(['', '']);
    } else {
      setNumOptions(0);
      setOptionInputs([]);
      setSelectedOptions([]);
    }
  };

const handleNumOptionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumOptions(value > 0 ? value : 1);
    const updatedOptionInputs = [...optionInputs];
    while (updatedOptionInputs.length < value) {
      updatedOptionInputs.push('');
    }
    setOptionInputs(updatedOptionInputs.slice(0, value));
  };

  const handleOptionInputChange = (e, index) => {
    const updatedInputs = [...optionInputs];
    updatedInputs[index] = e.target.value;
    setOptionInputs(updatedInputs);
  };

  const handleNewQuestionOptionSelection = (e, option) => {
    const selectedOptionsSet = new Set(selectedOptions);
    if (selectedOptionsSet.has(option)) {
      selectedOptionsSet.delete(option);
    } else {
      selectedOptionsSet.add(option);
    }
    setSelectedOptions(Array.from(selectedOptionsSet));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      title: newQuestion,
      surveyPageId: selectedSurveyPage,
      options: (questionType !== '1' && questionType !== '2')
        ? optionInputs.slice(0, numOptions).filter(Boolean)
        : [],
      selectedOptions,
      question_tags: JSON.stringify(selectedQuestionTags),
      is_required: false,
      question_type_id: questionType,
      additional_settings: {
        color: 'blue',
        align: 'center',
        font_style: 'bold',
        font_family: 'Calibri',
        font_size: '4',
      },
    };
    onSubmit(questionData);
  };

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formQuestionType">
            <Form.Label>Question Type</Form.Label>
            <Form.Control as="select" value={questionType} onChange={handleQuestionTypeChange}>
              <option value="1">Multiple Choice</option>
              <option value="2">Checkboxes</option>
              <option value="3">Star Rating</option>
              <option value="4">Best worst scale</option>
              <option value="5">Single Textbox</option>
              <option value="6">Comment Box</option>
              <option value="7">Dropdown</option>
              <option value="8">Ranking</option>
              <option value="9">Slider</option>
              <option value="10">Multiple Checkboxes</option>
              <option value="11">Date / Time</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formQuestionText">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              value={newQuestion}
              onChange={handleQuestionInputChange}
              placeholder="Enter your question"
            />
          </Form.Group>

          <Form.Group controlId="formSurveyPage">
            <Form.Label>Survey Page</Form.Label>
            <Form.Control as="select" value={selectedSurveyPage} onChange={handleSurveyPageChange}>
              {surveyPages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.title || `Page ${page.id}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button
            variant="link"
            onClick={async () => {
            const newPage = await onAddNewPage();
            if (newPage) {
              setSelectedSurveyPage(newPage.id); // Automatically select the new page
            }
          }}
          >
            + Add New Page
          </Button>

          {questionType === '1' || questionType === '2' ? (
            <div>
              <Form.Group controlId="formNumOptions">
                <Form.Label>Number of Options</Form.Label>
                <Form.Control
                  type="number"
                  value={numOptions}
                  onChange={handleNumOptionsChange}
                />
              </Form.Group>
              <OptionInputList
                questionType={questionType}
                numOptions={numOptions}
                optionInputs={optionInputs}
                handleOptionInputChange={handleOptionInputChange}
              />
            </div>
          ) : null}

          {Object.keys(validationErrors).length > 0 && (
            <div className="validation-errors">
              {Object.keys(validationErrors).map(key => (
                <p key={key} style={{ color: 'red' }}>{validationErrors[key]}</p>
              ))}
            </div>
          )}

          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Question
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validationErrors: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
  surveyPages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  currentSurveyPageId: PropTypes.string,
  onAddNewPage: PropTypes.func.isRequired,
};

AddQuestionModal.defaultProps = {
  validationErrors: {},
  currentSurveyPageId: '',
};

export default AddQuestionModal;
