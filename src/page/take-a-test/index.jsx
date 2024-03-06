import { useEffect, useRef, useState } from 'react';
import CardTest from '../../components/CardTest';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAnswer, getDataTest, selectTest } from '../../redux/slice/testSlice';
import Swal from 'sweetalert2';

function TakeATest() {
  const navigate = useNavigate();
  const { id } = useParams();

  //   const valueQuestion = { question: '', dataCorrect: [], type: 'multiple-choice' };
  const [dataQuestion, setDataQuestion] = useState([]);
  const [dataTest, setDataTest] = useState();
  const dataSelect = useSelector(selectTest);
  const [startTime, setStartTime] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(null); // 15 minutes in seconds

  // console.log(time);
  const dispatch = useDispatch();

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra vị trí cuộn. Đây chỉ là một ví dụ, bạn có thể điều chỉnh giá trị dựa vào nhu cầu của bạn.
      const scrollY = window.scrollY;
      const threshold = 200;

      if (scrollY > threshold) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Đăng ký sự kiện cuộn
    window.addEventListener('scroll', handleScroll);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(getDataTest());
  }, []);
  useEffect(() => {
    if (dataSelect.data.length > 0) {
      let intervalId;

      if (startTime && !paused) {
        intervalId = setInterval(() => {
          if (time > 0) {
            setTime((prevTime) => prevTime - 1);
          } else {
            clearInterval(intervalId);
            setStartTime(false);
            Swal.fire('Đã hết giờ làm bài');
            const timeInMilliseconds = Number(dataSelect.data?.[id]?.time) * 60 * 1000;
            const timeoutInMilliseconds =
              parseInt(formattedTime.split(':')[0]) * 60 * 1000 + parseInt(formattedTime.split(':')[1]) * 1000;

            // Tính thời gian còn lại
            const remainingTime = Math.max(0, timeInMilliseconds - timeoutInMilliseconds);

            // Chuyển đổi thời gian còn lại thành phút và giây
            const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
            const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

            const data = {
              title: dataSelect.data?.[id]?.title,
              des: dataSelect.data?.[id]?.des,
              dataQuestion: dataQuestion,
              time: `${remainingMinutes} phút ${remainingSeconds} giây`,
            };
            dispatch(checkAnswer(data));
            navigate(`/check-the-answer/${id}`);
          }
        }, 1000);
      }
      return () => clearInterval(intervalId); // Clean up the interval on component unmount or when startTime is set to false
    }
  }, [startTime, time]);
  useEffect(() => {
    if (dataSelect.data.length > 0) {
      setTime(Number(dataSelect.data?.[id]?.time) * 60);
      const newDataQuestion = dataSelect.data[id]?.dataQuestion.map((item) => {
        return {
          question: item.question,
          dataCorrect: item.dataCorrect
            ? item.dataCorrect.map((it) => {
                return { title: it.title, correct: 0 };
              })
            : null,
          type: item.type,
        };
      });
      setDataQuestion(newDataQuestion);
    }
  }, [dataSelect.data]);

  // useEffect(() => {
  //   const data = { title: dataSelect.data?.[id]?.title, des: dataSelect.data?.[id]?.des, dataQuestion };
  //   setDataTest(data);
  // }, [dataQuestion]);
  const handlleCheckAns = () => {
    Swal.fire({
      title: 'Bạn có muốn nộp bài?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Nộp',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(checkAnswer(dataTest));
        navigate(`/check-the-answer/${id}`);
        Swal.fire({
          title: 'Thông báo',
          text: 'Bạn đã Nộp bài thành công',
          icon: 'success',
        });
      }
    });
  };

  const handleStart = () => {
    if (!startTime) {
      setStartTime(true);
    } else {
      Swal.fire({
        title: 'Bạn có muốn nộp bài sớm?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Nộp',
        cancelButtonText: 'Không',
      }).then((result) => {
        if (result.isConfirmed) {
          const timeInMilliseconds = Number(dataSelect.data?.[id]?.time) * 60 * 1000;
          const timeoutInMilliseconds =
            parseInt(formattedTime.split(':')[0]) * 60 * 1000 + parseInt(formattedTime.split(':')[1]) * 1000;

          // Tính thời gian còn lại
          const remainingTime = Math.max(0, timeInMilliseconds - timeoutInMilliseconds);

          // Chuyển đổi thời gian còn lại thành phút và giây
          const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
          const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
          // const data = {
          //   title: dataSelect.data?.[id]?.title,
          //   des: dataSelect.data?.[id]?.des,
          //   dataQuestion: dataQuestion,
          //   time: `${remainingMinutes} phút ${remainingSeconds} giây`,
          // };
          // console.log(data);

          const data = new FormData();
          data.append('title', dataSelect.data?.[id]?.title);
          data.append('des', dataSelect.data?.[id]?.des);
          data.append('time', `${remainingMinutes} phút ${remainingSeconds} giây`);

          // Lặp qua mảng dataQuestion và thêm vào FormData
          dataQuestion.forEach((question, index) => {
            // Chuyển đối tượng question thành chuỗi JSON và thêm vào FormData
            data.append(`dataQuestion[${index}]`, JSON.stringify(question));
          });

          dispatch(checkAnswer(data));
          navigate(`/check-the-answer/${id}`);
          Swal.fire({
            title: 'Thông báo',
            text: 'Bạn đã Nộp bài thành công',
            icon: 'success',
          });
        }
      });
    }
  };

  const formattedTime = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
  return (
    <div>
      <div
        className=" px-20 h-[50vh] bg-cover bg-center flex"
        style={{ backgroundImage: 'url("../images/image 1.png")' }}
      >
        <div className="flex flex-col w-[50%] items-center py-16">
          <h1 className="font-bold text-white text-3xl mb-10">{dataSelect.data?.[id]?.title}</h1>
          <h2 className="font-semibold text-xl text-white text-center mb-10">{dataSelect.data?.[id]?.des}</h2>
          <div className="flex">
            <button
              onClick={handleStart}
              className="w-40 text-center px-5 py-2.5 bg-red-600 text-white rounded-lg mx-2"
            >
              {startTime ? 'Nộp bài' : 'Bắt đầu'}
            </button>
            <div className="w-40 text-center px-5 py-2.5 bg-red-600 text-white rounded-lg mx-2"> {formattedTime}</div>
          </div>
        </div>
        <div className="w-[50%] flex justify-center">
          <img className="h-full object-cover" src="../images/image 2.png" alt="" />
        </div>
      </div>

      {startTime && (
        <>
          <h2 className="text-4xl font-bold my-5 text-center">Bài làm</h2>
          {showButton && (
            <button
              onClick={handleStart}
              className="fixed bottom-10 right-10 flex bg-emerald-400 text-white px-2.5 py-2 rounded-xl hover:bg-emerald-500 "
            >
              Nộp bài
            </button>
          )}
          {showButton && (
            <div
              // onClick={handlleCheckAns}
              className="fixed bottom-24 right-10 flex bg-red-400 text-white px-5 py-2 rounded-xl hover:bg-emerald-500 "
            >
              {formattedTime}
            </div>
          )}
          <div className="w-[1440px] flex flex-col items-center mx-auto mb-5">
            {/* <div className="mt-5 border rounded-xl w-[600px] overflow-hidden ">
          <div className="h-2 w-full bg-red-300"></div>
          <div className="p-5 flex flex-col">
            <div className="text-2xl font-semibold mb-2 focus:border-b-2 focus:border-red-500">
              {dataSelect.data?.[id]?.title}
            </div>
            <div className="focus:border-b-2 focus:border-red-500">{dataSelect.data?.[id]?.des}</div>
          </div>
        </div> */}
            {dataSelect.data?.[id]?.dataQuestion?.map((item, index) => {
              const getAnswerData = (data) => {
                console.log(data);
                setDataQuestion((arr) => arr.map((item, i) => (i === index ? { ...item, dataCorrect: data } : item)));
              };

              return (
                <CardTest
                  getAnswerData={getAnswerData}
                  key={index}
                  stt={index + 1}
                  typeQuestion={item.type}
                  dataCorrect={item.dataCorrect}
                  question={item.question}
                />
              );
            })}

            {/* <CardForm /> */}
          </div>
        </>
      )}
    </div>
  );
}

export default TakeATest;
