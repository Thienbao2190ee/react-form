import { useEffect, useRef, useState } from 'react';
import CardForm from '../../components/CardForm';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createTest } from '../../redux/slice/testSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactSelect from 'react-select';

function CreateForm() {
  const [title, setTitle] = useState('Tiêu đề');
  const [des, setDes] = useState('Mô tả');
  const valueQuestion = { question: '', dataCorrect: [], type: 'multiple-choice' };
  const navigate = useNavigate();
  const [dataQuestion, setDataQuestion] = useState([valueQuestion]);
  const [time, setTimeTest] = useState();
  // const [dataTest, setDataTest] = useState();
  const [isInput, setInput] = useState(false);

  const [isSetTime, setIsSetTime] = useState(false);

  const typingTimeout = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      if (title === '' || des === '') {
        setTitle('Tiêu đề');
        setDes('Mô tả');
      }
    }, 1000);
  }, [title, des]);

  // useEffect(() => {
  //   const data = { title, des, dataQuestion };
  //   setDataTest(data);
  // }, [dataQuestion, title.des]);

  const handleAddQuestion = () => {
    const dataPush = valueQuestion;
    setDataQuestion((arr) => [...arr, dataPush]);
  };

  const handleRemoveQuestion = (index) => {
    setDataQuestion((arr) => arr.filter((_, i) => i !== index));
  };

  const handleSubimt = async () => {
    let QUESTION = '';
    await dataQuestion.map(async (item, index) => {
      if (item.question === '') {
        QUESTION += (index + 1).toString() + (dataQuestion.length - 1 === index ? '' : ',');
      } else {
        if (item.type === 'multiple-choice') {
          await item.dataCorrect.map((it) => {
            if (it.title === '') {
              return (QUESTION += (index + 1).toString() + (dataQuestion.length - 1 === index ? '' : ','));
            }
          });
        }
      }
    });
    if (QUESTION === '') {
      setIsSetTime(true);
    } else {
      toast.warn(`Bạn chưa điền đủ thông tin câu ${QUESTION}`, {
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
  };

  return (
    <div>
      {isSetTime && (
        <div
          className="w-screen h-screen fixed top-0 flex justify-center items-center right-0 z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="w-[500px] p-5 bg-white rounded-xl flex flex-col items-center relative ">
            <button
              onClick={() => {
                setIsSetTime(false);
                setInput(false);
              }}
              className="flex w-6 h-6 rounded-full text-white absolute bg-red-400 -top-2 -right-2 justify-center items-center"
            >
              <i className="fi fi-rr-cross-small"></i>
            </button>
            <h2 className="font-bold">Thời gian làm bài kiểm (phút)</h2>

            {!isInput ? (
              <div className="w-full mt-3">
                <ReactSelect
                  onChange={(e) => {
                    if (e.value === 0) {
                      setInput(true);
                    } else {
                      setTimeTest(e.value);
                    }
                  }}
                  options={[
                    { value: 15, label: '15 phút' },
                    { value: 30, label: '30 phút' },
                    { value: 45, label: '45 phút' },
                    { value: 60, label: '60 phút' },
                    { value: 0, label: 'Tùy chỉnh' },
                  ]}
                />
              </div>
            ) : (
              <input
                value={time}
                type="number"
                className="w-full border px-2 py-1.5 mt-3"
                placeholder="Nhập Thời gian kiểm tra bạn muốn"
                onChange={(e) => {
                  setTimeTest(e.target.value);
                }}
              />
            )}
            <button
              className="px-5 py-1.5 bg-emerald-400 font-bold text-white rounded-lg mt-3"
              onClick={() => {
                if (time) {
                  if (time < 5) {
                    // Người dùng đã nhấn nút OK

                    toast.warn('Thời gian phải lớn hơn 5 phút', {
                      position: 'bottom-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light',
                    });
                  } else {
                    const data = { title, des, dataQuestion, time };
                    console.log(data);
                    Swal.fire({
                      title: 'Bạn có muốn Tạo bài?',
                      // text: "You won't be able to revert this!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Tạo',
                      cancelButtonText: 'Không',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        dispatch(createTest(data));
                        navigate('/');
                      }
                    });
                  }
                } else {
                  toast.warn(`Bạn chưa chọn thời gian làm bài`, {
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
              }}
            >
              Tạo bài
            </button>
          </div>
        </div>
      )}
      <button
        onClick={handleSubimt}
        className="fixed bottom-10 right-10 flex bg-emerald-400 text-white px-2.5 py-2 rounded-xl hover:bg-emerald-500 "
      >
        <i className="fi fi-rr-disk mr-2"></i> Lưu bài kiểm tra
      </button>
      <div className="w-[1440px] flex flex-col items-center mx-auto mb-5">
        <div className="mt-5 border rounded-xl w-[600px] overflow-hidden ">
          <div className="h-2 w-full bg-red-300"></div>
          <div className="p-5 flex flex-col">
            <input
              onChange={(text) => setTitle(text.target.value)}
              className="text-2xl font-semibold mb-2 focus:border-b-2 focus:border-red-500"
              value={title}
            />
            <input
              className="focus:border-b-2 focus:border-red-500"
              value={des}
              onChange={(text) => setDes(text.target.value)}
            />
          </div>
        </div>
        {dataQuestion.map((item, index) => {
          const getDataCorrect = (data) => {
            setDataQuestion((arr) => arr.map((item, i) => (i === index ? { ...item, dataCorrect: data } : item)));
          };
          const handleChangeQuestion = (event) => {
            const Text = event.target.innerText;
            setDataQuestion((arr) => arr.map((item, i) => (i === index ? { ...item, question: Text } : item)));
          };

          const changeTybeQuestion = (value) => {
            setDataQuestion((arr) =>
              arr.map((item, i) =>
                i === index ? { ...item, type: value, dataCorrect: value === 'file' ? null : [] } : item,
              ),
            );
          };
          return (
            <CardForm
              changeTybeQuestion={changeTybeQuestion}
              key={index}
              stt={index + 1}
              length={dataQuestion.length}
              getDataCorrect={getDataCorrect}
              question={item.question}
              handleRemoveQuestion={() => handleRemoveQuestion(index)}
              handleChangeQuestion={handleChangeQuestion}
            />
          );
        })}

        <button onClick={handleAddQuestion} className="px-5 py-2.5 bg-emerald-400 text-white rounded-xl mt-5">
          Thêm bài
        </button>
        {/* <CardForm /> */}
      </div>
    </div>
  );
}

export default CreateForm;
