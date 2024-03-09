import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCheckAnswer, getDataTest, selectTest } from '../../redux/slice/testSlice';

function CheckTheAnw() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data, checkAnswer } = useSelector(selectTest);

  console.log(data);
  console.log(checkAnswer);

  useEffect(() => {
    dispatch(getDataTest());
    dispatch(getCheckAnswer());
  }, []);

  const score = () => {
    if (data.length > 0) {
      const totalQuestion = data[id]?.dataQuestion?.length;
      const scoreOneQuestion = totalQuestion ? 10 / totalQuestion : 0.0;
      let count = 0;
      data[id]?.dataQuestion?.map((item, index) => {
        const dataCorrect = checkAnswer?.dataQuestion[index]?.dataCorrect;
        if (dataCorrect) {
          item.dataCorrect?.map((it, i) => {
            if (dataCorrect[i]?.correct === 1 && it?.correct === 1) {
              count += 1;
            }
          });
        }
      });
      return { scores: (count * scoreOneQuestion).toFixed(1), rightSentence: count };
    }
  };
  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-10 right-10 flex bg-emerald-400 text-white px-2.5 py-2 rounded-xl hover:bg-emerald-500 "
      >
        Trang chủ
      </button>
      <div className="w-[1440px] flex flex-col items-center mx-auto mb-5 mt-5">
        <div className="w-full flex justify-between">
          <div className="w-[30%] ">
            <h2 className="border-l-4 px-5 border-red-200 font-bold py-2">Thông tin</h2>
            <div className="w-full border rounded-xl mt-5 p-5">
              <p className="mb-2">
                <span className="font-semibold">Bài kiểm tra</span> : {checkAnswer?.title}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Mô tả :</span> {checkAnswer?.des}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Thời gian làm bài: </span>
                {checkAnswer?.time}
              </p>
              {data[id] && (
                <p className="mb-2">
                  <span className="font-semibold">Kết quả:</span> {score().rightSentence} /{' '}
                  {checkAnswer?.dataQuestion.length}
                </p>
              )}
              <div className="flex">
                <p className="font-semibold">Điểm :</p>
                {data[id] && <p className=" w-[70%] text-center text-5xl font-bold text-red-600">{score().scores}</p>}
              </div>
            </div>
          </div>
          {data && checkAnswer && (
            <div className="w-[65%] ">
              <h2 className="border-l-4 px-5 border-red-200 font-bold py-2">Bài làm kiểm tra của bạn</h2>

              <div className="mt-5">
                {data[id]?.dataQuestion?.map((item, index) => {
                  const checkErorr = checkAnswer?.dataQuestion[index];
                  return (
                    <div key={index} className="p-5 mb-5 border rounded-xl">
                      <p className="font-bold">
                        {`Câu ${index + 1}`}: {item.question}
                      </p>
                      <div className="mt-2 font-bold">
                        {item.type === 'paragraph' ? (
                          <div>
                            <textarea
                              disabled
                              id="message"
                              rows="4"
                              value={checkErorr?.dataCorrect}
                              class="block p-2.5 min-h-40 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Write your thoughts here..."
                            ></textarea>
                          </div>
                        ) : (
                          item.dataCorrect &&
                          item.dataCorrect?.map((it, i) => {
                            const dataCorrectUser = checkErorr?.dataCorrect[i];
                            const notCheck = (checkErorr?.dataCorrect || []).some((ite) => ite.correct === 1);
                            return (
                              <p
                                key={i}
                                className={`rounded-lg flex mb-1 py-1 ${
                                  it.correct === 1 && dataCorrectUser?.correct === 0 && !notCheck
                                    ? 'bg-red-200'
                                    : it.correct === 1
                                    ? 'bg-emerald-200'
                                    : it.correct === 0 && dataCorrectUser?.correct === 1
                                    ? 'bg-red-200'
                                    : ''
                                } `}
                              >
                                <i
                                  className={` mx-2  ${
                                    it.correct === 1 && dataCorrectUser?.correct === 0 && !notCheck
                                      ? 'fi fi-rr-check'
                                      : it.correct === 1
                                      ? 'fi fi-rr-check'
                                      : it.correct === 0 && dataCorrectUser?.correct === 1
                                      ? 'fi fi-rr-cross-small'
                                      : 'fi fi-rr-circle'
                                  } `}
                                ></i>
                                {it.title}
                              </p>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckTheAnw;
