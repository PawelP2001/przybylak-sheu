import React, { useState, useRef } from 'react';
import { TextField, Button, Box } from '@mui/material';
import './CodeInputer.css';

const CodeInputer = () => {
  const [code, setCode] = useState(Array(15).fill('')); //liczba 15 określa tutaj ilość okienek udostępnionych użytkownikowi do wypełnienia, koreluje to z sumą generowanych okienek do wykorzystania w stałej codeStructure poniżej
  const inputsRef = useRef([]);

  const codeStructure = [3, 'P', 3, '=', 6, '.', 3]; //stała określająca docelowy kod, jw. do rozdysponowania '15' okienek, zachęcam do zmiany zarówno tej liczby powyżej jak i samej strukrury w tej stałej celem sprawdzenia działania komponentu

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value.length === 1 && index < code.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0) {
      if (code[index] !== '') {
        setCode(prevCode => {
          const newCode = [...prevCode];
          newCode[index] = '';
          return newCode;
        });
      } else {
        let newIndex = index - 1;
        while (newIndex > 0 && code[newIndex] === '') {
          newIndex--;
        }
        inputsRef.current[newIndex].focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData('Text');
    const trimmedData = clipboardData.trim();
    const maxLength = code.length - inputsRef.current.findIndex(input => input === document.activeElement);
    const pasteData = trimmedData.slice(0, maxLength);
    const newCode = [...code];
    let pasteIndex = inputsRef.current.findIndex(input => input === document.activeElement);
    for (let i = 0; i < pasteData.length; i++) {
      newCode[pasteIndex] = pasteData[i];
      pasteIndex++;
    }
    setCode(newCode);
  };

  const handleButtonClick = () => {
    if (code.filter(value => value === '').length === 0) {
      let alertMessage = '';
      let codeIndex = 0;

      codeStructure.forEach((element, index) => {
        if (typeof element === 'number') {
          for (let i = 0; i < element; i++) {
            alertMessage += code[codeIndex++] || '';
          }
        } else if (typeof element === 'string') {
          if (index !== 0) {
            alertMessage += element;
          }
        }
      });

      alert(alertMessage);
    }
  };

  const generateInputs = () => {
    const inputs = [];
    let inputIndex = 0;

    for (let i = 0; i < codeStructure.length; i++) {
      const element = codeStructure[i];
      if (typeof element === 'number') {
        for (let j = 0; j < element; j++) {
          const currentIndex = inputIndex;
          inputs.push(
            <TextField
              key={`input_${inputIndex}_${i}`}
              size="small"
              inputProps={{ maxLength: 1 }}
              value={code[currentIndex] || ''}
              onChange={(event) => handleInputChange(currentIndex, event.target.value)}
              onKeyDown={(event) => handleKeyDown(currentIndex, event)}
              onPaste={handlePaste}
              inputRef={(input) => (inputsRef.current[currentIndex] = input)}
              className="code-input"
            />
          );
          inputIndex++;
        }
      } else if (typeof element === 'string') {
        inputs.push(
          <TextField
            key={`separator_${i}`}
            size="small"
            value={element}
            disabled
            className="separator"
          />
        );
      }
    }

    return inputs;
  };

  return (
    <Box className="code-input-container">
      <h2 className="input-heading">Enter code</h2>
      <Box className="inputs-container">
        {generateInputs()}
      </Box>
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={code.filter(value => value === '').length > 0}
        className="input-button"
      >
        Send
      </Button>
    </Box>
  );
};

export default CodeInputer;
