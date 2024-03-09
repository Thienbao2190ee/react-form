import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

function CardTest({ dataCorrect, question, stt, typeQuestion, getAnswerData }) {
  const containerCorrectRef = useRef(null);

  const [answerData, setAnswerData] = useState([]);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      return toast.warn('File của bạn lớn hơn 10MB', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    setFile(selectedFile);
    setAnswerData(selectedFile);

    // Simulate loading, you would replace this with your actual upload logic
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Replace 3000 with the actual time it takes to upload the file
  };

  useEffect(() => {
    if (typeQuestion === 'multiple-choice') {
      const newData = dataCorrect.map((item) => {
        return { title: item.title, correct: 0 };
      });
      setAnswerData(newData);
    }
  }, []);

  useEffect(() => {
    getAnswerData(answerData);
  }, [answerData]);
  //   const [dataCorrect, setDataCorrect] = useState([{ title: '', correct: 1 }]);
  //   const [typeQuestion, settypeQuestion] = useState({ value: 'multiple-choice', label: 'Trắc nghiệm' });
  // const [question, setQuestion] = useState(que);

  const handleCheckCorrect = (index) => {
    setAnswerData((arr) => arr.map((item, i) => (i === index ? { ...item, correct: 1 } : { ...item, correct: 0 })));
  };
  return (
    <div className="mt-5 border rounded-xl w-[600px] p-5 flex flex-col relative card-form">
      <div className="flex justify-between">
        {/* <textarea placeholder="Nhập " className="w-[65%] border-b-2 border-red-400" type="text" /> */}
        <div className="w-full font-bold pt-2 px-2 outline-none" placeholder="Câu hỏi">
          {stt} {'. '}
          {question}
        </div>
      </div>

      <div ref={containerCorrectRef}>
        {typeQuestion === 'multiple-choice' ? (
          answerData.map((item, index) => (
            <div
              onClick={() => handleCheckCorrect(index)}
              className="flex justify-between mt-1 flex-col cursor-pointer hover:bg-gray-100"
              key={index}
            >
              <div className="flex w-full">
                <button className="w-[5%] flex justify-center items-center">
                  {item.correct === 1 ? (
                    <i className="fi fi-ss-check-circle text-emerald-400"></i>
                  ) : (
                    <div className="border-emerald-400 border w-4 h-4 rounded-full"></div>
                  )}
                </button>

                <div className="input-1 w-[90%] focus:border-b-2 focus:border-red-400 outline-none py-2">
                  {item.title}
                </div>
              </div>
            </div>
          ))
        ) : typeQuestion === 'paragraph' ? (
          <div class="mt-2">
            <textarea
              id="message"
              rows="4"
              class="block min-h-40 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập đoạn văn bản..."
              onBlur={(e) => setAnswerData(e.target.value)}
            ></textarea>
          </div>
        ) : (
          <div className="mt-2">
            <div>
              {!file && (
                <div className="mb-8">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={loading}
                    accept=".mp3, .mp4"
                  />
                  <label
                    htmlFor="file"
                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>
                        <span className="mb-2 block text-xl font-semibold text-[#07074D]">Tải file lên</span>
                        <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                          Browse
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
              {file && (
                <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
                  <div className="flex items-center justify-between">
                    <span className="truncate pr-3 text-base font-medium text-[#07074D]">{file.name}</span>
                    <button
                      className="text-[#07074D] flex"
                      onClick={() => {
                        setFile(null);
                        setAnswerData(null);
                      }}
                    >
                      <i className="fi fi-br-cross-small"></i>
                    </button>
                  </div>
                  {loading && (
                    <div className="relative mt-5 h-[6px] w-full rounded-lg bg-[#E2E5EF] overflow-hidden">
                      <div
                        className="absolute left-0 right-0 h-full w-[100%] rounded-lg bg-[#6A64F1]"
                        style={{
                          animation: 'progressAnimation 3s linear infinite',
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardTest;
