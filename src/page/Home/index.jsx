import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { optionsLOP } from '../../data';
import { optionsKHOI } from '../../data';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getDataTest, selectTest } from '../../redux/slice/testSlice';

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [dataLOP, setDataLOP] = useState([]);
  const [KHOIID, setKHOIID] = useState(null);
  const [LOPID, setLOPID] = useState(null);
  const dataSelect = useSelector(selectTest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataTest());
  }, []);

  useEffect(() => {
    if (KHOIID) {
      const data = optionsLOP.filter((item) => item.KHOI_ID === Number(KHOIID));
      setDataLOP(data);
    }
  }, [KHOIID]);

  const handleNextPage = () => {
    if (LOPID && KHOIID) {
      navigate('/create-form');
    } else {
      toast.warn('Bạn chưa chọn lớp', {
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

  console.log(dataSelect?.data);

  return (
    <>
      <div>
        <div className="relative flex justify-center">
          <img className="w-full h-[70vh] object-cover" src="./images/pana.png" alt="" />
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-40 px-5 py-2.5 bg-red-400 text-white rounded-xl hover:bg-red-500"
          >
            Tạo bài
          </button>

          {/* <Link to="/create-form" className="absolute bottom-40 px-5 py-2.5 bg-red-400 text-white rounded-xl">
          Tạo bài
        </Link> */}
        </div>
        <div className="flex flex-col items-center p-10 w-[1440px] mx-auto">
          <h2 className="text-2xl font-semibold">Bài kiểm tra</h2>
          {dataSelect?.data?.length > 0 ? (
            <div className="grid grid-cols-5 gap-4 mt-10">
              {dataSelect.data?.map((item, index) => (
                <Link
                  to={`take-a-test/${index}`}
                  key={index}
                  className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]"
                >
                  <img
                    className="w-full h-auto rounded-t-xl"
                    src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
                    alt="Image Description"
                  />
                  <div className="p-4 md:p-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{item.title}</h3>
                    <p
                      className="mt-1 text-gray-500 dark:text-gray-400  h-[72px] overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                      }}
                    >
                      {item.des}
                    </p>
                    <button className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                      Làm bài
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xl font-bold w-full flex justify-center">
              <img
                className="w-[20%]"
                src="https://static.vecteezy.com/system/resources/previews/002/076/417/original/data-search-not-found-illustration-concept-vector.jpg"
                alt=""
              />{' '}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="w-screen h-screen flex justify-center items-center fixed left-0 top-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="bg-white w-[500px] p-5 rounded-xl">
            <div className="flex w-full justify-between mb-2">
              <h2 className="font-bold">Chọn lớp</h2>
              <button onClick={() => setShowModal(false)}>
                <i className="fi fi-rr-cross-small"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <h3>Khối</h3>
                <Select
                  onChange={(value) => {
                    setDataLOP([]);
                    setLOPID(null);
                    setKHOIID(value.value);
                  }}
                  options={optionsKHOI}
                />
              </div>
              <div>
                <h3>Lớp</h3>
                <Select
                  onChange={(value) => setLOPID(value)}
                  value={LOPID}
                  isDisabled={dataLOP.length > 0 ? false : true}
                  options={dataLOP}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleNextPage}
                className="px-5 py-2.5 rounded-xl hover:bg-red-500 bg-red-400 text-white"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
