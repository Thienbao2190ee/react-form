import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

function CardForm({
  getDataCorrect,
  question,
  handleChangeQuestion,
  handleRemoveQuestion,
  changeTybeQuestion,
  length,
  stt,
}) {
  const containerCorrectRef = useRef(null);
  const contentEditableRef = useRef(null);
  const [dataCorrect, setDataCorrect] = useState([{ title: '', correct: 1 }]);
  const [typeQuestion, settypeQuestion] = useState({ value: 'multiple-choice', label: 'Trắc nghiệm' });
  // const [question, setQuestion] = useState(que);

  useEffect(() => {
    getDataCorrect(dataCorrect);
  }, [dataCorrect]);

  const handleAddQuestion = () => {
    const dataPush = { title: '', correct: 0 };
    setDataCorrect((arr) => [...arr, dataPush]);
  };

  const handleContentChange = (event, index) => {
    let Text = event.target.value;

    setDataCorrect((arr) => arr.map((item, i) => (i === index ? { ...item, title: Text } : item)));
  };

  const handleDeleteQuestion = (index) => {
    if (dataCorrect.length === 2) {
      setDataCorrect((arr) => arr.map((item, i) => ({ ...item, correct: 1 })));
    }
    setDataCorrect((arr) => arr.filter((_, i) => i !== index));
  };

  const handleCheckCorrect = (index) => {
    setDataCorrect((arr) => arr.map((item, i) => (i === index ? { ...item, correct: 1 } : { ...item, correct: 0 })));
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior of the Enter key

      const nextIndex = index + 1;
      if (nextIndex === dataCorrect.length) {
        // inputRefs.current[nextIndex].current.focus();
        handleAddQuestion();
      }
    }
  };

  // useEffect(() => {
  //   // Ensure the cursor stays at the end after each change
  //   if (contentEditableRef.current) {
  //     const contentEditable = contentEditableRef.current;
  //     const length = contentEditable.innerText.length;
  //     contentEditable.focus();
  //     window.getSelection().collapse(contentEditable.firstChild, length);
  //   }
  // }, [question]);

  return (
    <div className="mt-5 border rounded-xl w-[600px] p-5 flex flex-col relative card-form">
      {length > 1 && (
        <button
          onClick={handleRemoveQuestion}
          className="absolute -right-2 rounded-full -top-2 bg-red-400 hover:bg-red-500 flex w-6 h-6 justify-center text-white btn-remove"
        >
          <i className="fi fi-br-cross-small"></i>
        </button>
      )}
      <div className="flex justify-between items-start">
        {/* <textarea placeholder="Nhập " className="w-[65%] border-b-2 border-red-400" type="text" /> */}
        <div className="font-bold mt-2">{stt}</div>
        <div
          ref={contentEditableRef}
          className="w-[64%] pt-1.5 pb-1.5 px-2 outline-none bg-gray-100"
          onBlur={(e) => {
            handleChangeQuestion(e);
          }}
          contentEditable={true}
          placeholder="Câu hỏi ?"
          dangerouslySetInnerHTML={{ __html: question }}
        ></div>
        <div className="w-[30%]">
          <Select
            onChange={(e) => {
              settypeQuestion(e);
              changeTybeQuestion(e.value);
            }}
            value={typeQuestion}
            options={[
              { value: 'multiple-choice', label: 'Trắc nghiệm' },
              { value: 'file', label: 'Tải tệp lên' },
              { value: 'paragraph', label: 'Đoạn văn' },
            ]}
          />
        </div>
      </div>

      <div ref={containerCorrectRef}>
        {typeQuestion.value === 'multiple-choice' ? (
          dataCorrect.map((item, index) => (
            <div className="flex justify-between mt-1 flex-col" key={index}>
              <div className="flex w-full">
                <button onClick={() => handleCheckCorrect(index)} className="w-[5%] flex justify-center items-center">
                  {item.correct === 1 ? (
                    <i className="fi fi-ss-check-circle text-emerald-400"></i>
                  ) : (
                    <div className="border-emerald-400 border w-4 h-4 rounded-full"></div>
                  )}
                </button>
                <input
                  // ref={inputRefs.current[index]}
                  value={item.title}
                  placeholder="Đáp án"
                  className="input-1 w-[90%] focus:border-b-2 focus:border-red-400 outline-none py-2"
                  onChange={(event) => handleContentChange(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                />
                <button className="w-[5%] flex justify-center items-center">
                  {dataCorrect.length > 1 && (
                    <i onClick={() => handleDeleteQuestion(index)} className="fi fi-br-cross-small"></i>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : typeQuestion.value === 'paragraph' ? (
          <div className="mt-2 ml-5 ">(Viết đoạn văn)</div>
        ) : (
          <div className="mt-2 ml-5 ">(Tải file)</div>
        )}
      </div>
      {typeQuestion.value === 'multiple-choice' && (
        <button onClick={handleAddQuestion} className="flex mt-2 ml-1 text-blue-500 font-semibold">
          <i className="fi fi-br-plus-small"></i>
          Thêm đáp án
        </button>
      )}
    </div>
  );
}

export default CardForm;
