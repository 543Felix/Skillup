import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import QuizInstruction from './quizInstruction';
import AxiosInstance from '../../../utils/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// import { useLocation } from 'react-router-dom';
import ProposalPage from './proposalPage'; 

interface Props{
  jobId:string;
  displayJobComponent:()=>void
}

const Quiz:React.FC<Props> = ({jobId,displayJobComponent})=>{
  const devId = useSelector((state: RootState) => {
    return state.developerRegisterData._id;
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [passingScore, setPassingScore] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const hasEndedRef = useRef(false);
  const [strokeDasharray, setStrokeDasharray] = useState("0, 100");
  const [showProposalPage,setShowProposalPage] = useState(false)
 
  useEffect(() => {
    let isMounted = true; // Add a flag to ensure cleanup on unmount
    AxiosInstance.get(`/job/getQuiz/${devId}/${jobId}`)
      .then((res) => {
        if (isMounted) {
          console.log('res = ', res);
          setQuestions(res.data.Quiz.questions);
          setPassingScore(res.data.Quiz.passingScore);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [devId, jobId]);

  const enterFullScreen = () => {
    const element = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    const doc = document as Document & {
      mozCancelFullScreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };

    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) { // Firefox
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) { // Chrome, Safari, Opera
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) { // IE/Edge
      doc.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleBlur = () => {
      if (quizStarted) {
        // Cheating check only if the quiz has started
        disqualifyUser();
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      disqualifyUser();
    };

    const handleContextMenu = (event) => event.preventDefault();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && quizStarted && !hasEndedRef.current) {
        disqualifyUser();
      }
    };

    const cleanupEventListeners = () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };

    const disqualifyUser = () => {
      setQuizEnded(true);
      hasEndedRef.current = true;
      cleanupEventListeners();
    };

    if (quizStarted) {
      window.addEventListener('blur', handleBlur);
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    }

    return () => {
      cleanupEventListeners();
    };
  }, [quizStarted]);

  useEffect(() => {
    const percentage = (time / 30) * 100;
    setStrokeDasharray(`${percentage}, 100`);
  }, [time]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTime((prevState) => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          clearInterval(myInterval);
          handleSubmit();
          setTime(30);
          return prevState;
        }
      });
    }, 1000);

    return () => clearInterval(myInterval); // Clear interval on component unmount
  }, [currentQuestion]);

  const startQuiz = () => {
    setTime(30);
    setQuizStarted(true);
    enterFullScreen();
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
    setSelectedOption('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizStarted(false);
      setQuizEnded(true);
      exitFullScreen();
    }

    setTime(30);
  };

  if (quizEnded) {
    return (
      <div className="h-[31.5rem]  flex justify-center items-center  p-5 text-white border-2 border-violet rounded-[28px] shadow-lg shadow-violet">
        <div className='h-[200px] flex flex-col w-[300px] space-y-1 justify-center bg-white rounded-[15px] shadow-custom-black items-center text-black'>

          {score >= passingScore ?
            (showProposalPage ?
              <ProposalPage displayJobComponent={displayJobComponent} jobId={jobId} hideProposalPage={setShowProposalPage} score={score} />
              :
              <>
              <FontAwesomeIcon className='text-green-600 h-14' icon={faCircleCheck} />
              <h2 className='text-2xl text-green-600 font-bold'>Selected for next round</h2>
              <p className='text-2xl'>Your score: {score}/{questions.length}</p>
              <button className='bg-green-600 px-4 py-1 text-white font-semibold rounded-[5px]' onClick={()=>setShowProposalPage(true)}>Continue</button>
              </>)
             
            
            :
            <>
              <FontAwesomeIcon className='text-red-500 h-14' icon={faCircleXmark} />
              <h2 className='text-3xl text-red-500 font-semibold'>Rejected</h2>
              <p className='text-xl'>Your score: {score}/{questions.length}</p>
            </>
          }
        </div>

      </div>
    );
  }

  
  return (
    quizStarted ?
      <div className="h-[31.5rem] absolute top-0 left-0 right-0 backdrop-blur-xl z-50 flex flex-col mx-[12rem] my-[100px] p-5 text-white border-2 border-violet rounded-[28px] shadow-md shadow-violet">
        <div className='flex justify-end'>
          <div className="right-6 flex justify-center items-center h-[70px] w-[70px] rounded-full ">
          {time !== 0 && (
                    <svg className="absolute" width="70" height="70" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{
                          fill: "none",
                          stroke: "transparent",
                          strokeWidth: 1,
                          strokeLinecap: "round",
                        }}
                      />
                      <path
                        strokeDasharray={strokeDasharray}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{
                          fill: "none",
                          stroke: "#7f00ff",
                          strokeWidth: 1,
                          strokeLinecap: "round",
                        }}
                      />
                    </svg>
                  )}
                  <span className="font-mono text-4xl">{time}</span>
          </div>
        </div>

        <div className='h-[400px]'>
          <h2 className="text-2xl font-bold mb-4">{questions[currentQuestion]?.question}</h2>
          <ul>
            {questions[currentQuestion]?.options.map((option, index) => (
              <li key={index} className='py-2'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type="radio"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionChange(option)}
                    className='form-radio'
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
           
          >
            Next <FontAwesomeIcon icon={faArrowRightLong} />
          </button>
        </div>
      </div>
      :
      <QuizInstruction startQuiz={startQuiz} />
  );
}

export default Quiz;
